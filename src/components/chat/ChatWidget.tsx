'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send, X } from 'lucide-react';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { chatCopy } from '@/lib/chatCopy';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';
import { buildContextualWhatsAppMessage } from '@/lib/whatsappMessage';
import {
  sendChatMessage,
  startPolling,
  type PollHandle,
  type OutMessage,
} from './chatClient';
import { ChatMessageList, type ChatViewMessage } from './ChatMessageList';
import { ChatLeadCard } from './ChatLeadCard';

/**
 * Floating live-chat widget. Replaces the previous WhatsAppFab as the
 * primary CTA in the bottom-right corner. Visitor can start an anonymous
 * conversation; an operator replies from Telegram; replies appear here
 * via long-poll within ≤5 s.
 *
 * See /home/hfgomezgo/.claude/plans/valiant-chasing-nygaard.md for the
 * full architecture — this component orchestrates the client side of it.
 */

const SESSION_STORAGE_KEY = 'rohu_session_id';
const LEAD_CARD_STORAGE_KEY = 'rohu_chat_lead_card_shown';
const LEAD_CARD_MIN_MESSAGES = 3;
const LEAD_CARD_MIN_ELAPSED_MS = 120_000;
const IDLE_HINT_MS = 60_000;

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'sess_ssr';
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const fresh = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
  return fresh;
}

export function ChatWidget() {
  const pathname = usePathname() ?? '/';
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatViewMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitedSeconds, setRateLimitedSeconds] = useState<number | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [restarted, setRestarted] = useState(false);
  const [showIdleHint, setShowIdleHint] = useState(false);
  const [leadCardVisible, setLeadCardVisible] = useState(false);
  const [leadCardDismissed, setLeadCardDismissed] = useState(false);

  const sessionIdRef = useRef<string>('');
  const pollHandleRef = useRef<PollHandle | null>(null);
  const lastSeenTsRef = useRef<number>(0);
  const openedAtRef = useRef<number>(0);
  const visitorMessageCountRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Timestamp of the last handleOpen() call. Used to suppress the iOS
  // "tap ghost" — a click event that sometimes fires on the freshly
  // mounted panel DOM node from the same physical tap that triggered
  // the FAB. We ignore any pointer event hitting the panel within the
  // first 350 ms of it opening.
  const openedAtMsRef = useRef<number>(0);
  // True once the visitor has sent at least one message in this widget
  // lifetime. Before that, there is no session on the server, so the
  // poll endpoint would return 410 Gone → the client would interpret
  // it as "dyno restarted" and show the maintenance message. So we
  // intentionally do NOT poll until this flag flips to true.
  const hasConversationRef = useRef<boolean>(false);

  // SSR safety: only render the portal after mount
  useEffect(() => {
    setMounted(true);
    sessionIdRef.current = getOrCreateSessionId();
    const leadCardShown = window.sessionStorage.getItem(LEAD_CARD_STORAGE_KEY);
    if (leadCardShown === '1') setLeadCardDismissed(true);
  }, []);

  const stopPolling = useCallback(() => {
    pollHandleRef.current?.stop();
    pollHandleRef.current = null;
  }, []);

  const startLivePoll = useCallback(() => {
    stopPolling();
    if (!sessionIdRef.current) return;
    pollHandleRef.current = startPolling(
      sessionIdRef.current,
      lastSeenTsRef.current,
      {
        onMessages: (batch: OutMessage[]) => {
          setMessages((prev) => [
            ...prev,
            ...batch.map((m) => ({
              id: m.id,
              ts: m.ts,
              direction: 'out' as const,
              text: m.text,
            })),
          ]);
          lastSeenTsRef.current = batch[batch.length - 1].ts;
          trackEvent(EVENTS.RECEIVE_CHAT_REPLY, { count: batch.length });
          setShowIdleHint(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        },
        onRestart: () => {
          setRestarted(true);
          stopPolling();
          trackEvent(EVENTS.CHAT_SESSION_RESTARTED);
        },
        onReconnecting: (rc) => setReconnecting(rc),
      }
    );
  }, [stopPolling]);

  // Visibility API: pause polling when tab is hidden. Skip entirely if
  // there is no active conversation yet (nothing to poll for).
  useEffect(() => {
    if (!open || restarted || !hasConversationRef.current) return;
    const onVisibility = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startLivePoll();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [open, restarted, startLivePoll, stopPolling]);

  // Start / stop polling as `open` toggles. CRITICAL: we only start the
  // poll loop if the visitor has already sent at least one message this
  // lifetime (hasConversationRef.current === true). Before that, there
  // is no session on the server and /api/chat/poll would respond 410
  // Gone, which the client interprets as "session restarted" — i.e. the
  // maintenance modal would appear on every first open. Instead, the
  // polling is kicked off inside handleSend() after the first successful
  // send (see below).
  useEffect(() => {
    if (!open) {
      stopPolling();
      return;
    }
    if (restarted) return;
    if (!hasConversationRef.current) return;
    startLivePoll();
    return () => stopPolling();
  }, [open, restarted, startLivePoll, stopPolling]);

  // Focus input when opening — DESKTOP ONLY. On mobile, auto-focus opens
  // the soft keyboard which resizes the viewport and can cause iOS Safari
  // to reflow the fixed panel, sometimes racing with the tap-ghost event
  // flow and closing the widget. The user can tap the textarea manually
  // on mobile without any UX cost.
  useEffect(() => {
    if (!open || !inputRef.current) return;
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return; // touch device → skip auto-focus
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [open]);

  // NOTE: No global Escape listener. Some mobile browsers (Android back
  // button, virtual-keyboard dismiss gestures) dispatch synthetic
  // `keydown` events with `key === 'Escape'`, which was causing the
  // widget to close the moment it opened. The only way to close is now
  // the explicit X button in the header.

  const handleOpen = useCallback(() => {
    const now = Date.now();
    setOpen(true);
    openedAtRef.current = now;
    openedAtMsRef.current = now;
    trackEvent(EVENTS.OPEN_CHAT_WIDGET, { pathname });
  }, [pathname]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setShowIdleHint(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    trackEvent(EVENTS.CLOSE_CHAT_WIDGET, { pathname });
  }, [pathname]);

  const resetAfterRestart = useCallback(() => {
    // Generate a brand new session id and wipe the local history
    if (typeof window !== 'undefined') {
      const fresh = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
      sessionIdRef.current = fresh;
    }
    lastSeenTsRef.current = 0;
    visitorMessageCountRef.current = 0;
    hasConversationRef.current = false;
    setMessages([]);
    setRestarted(false);
    setLeadCardVisible(false);
    // Do NOT start polling here — it will start when the visitor sends
    // their first message in the new session (same rule as on initial open).
    const isCoarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches;
    if (!isCoarse) inputRef.current?.focus();
  }, []);

  const scheduleIdleHint = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setShowIdleHint(true);
    }, IDLE_HINT_MS);
  }, []);

  const maybeShowLeadCard = useCallback(() => {
    if (leadCardVisible || leadCardDismissed) return;
    const elapsedOk = Date.now() - openedAtRef.current >= LEAD_CARD_MIN_ELAPSED_MS;
    const countOk = visitorMessageCountRef.current >= LEAD_CARD_MIN_MESSAGES;
    if (countOk || elapsedOk) {
      setLeadCardVisible(true);
      trackEvent(EVENTS.CHAT_LEAD_CARD_SHOWN, { pathname });
    }
  }, [leadCardVisible, leadCardDismissed, pathname]);

  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (sending || !draft.trim()) return;
      setError(null);
      setRateLimitedSeconds(null);

      const text = draft.trim();
      const optimisticId = `local_${Date.now().toString(36)}`;
      const now = Date.now();

      setMessages((prev) => [
        ...prev,
        { id: optimisticId, ts: now, direction: 'in', text, pending: true },
      ]);
      setDraft('');
      setSending(true);
      trackEvent(EVENTS.SEND_CHAT_MESSAGE, { pathname });

      const result = await sendChatMessage(sessionIdRef.current, text, pathname);
      setSending(false);

      if (!result.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, pending: false, error: true } : m
          )
        );
        if (result.error === 'ip_min' || result.error === 'session_min') {
          const secs = Math.ceil((result.retryAfterMs ?? 60_000) / 1000);
          setRateLimitedSeconds(secs);
          trackEvent(EVENTS.CHAT_RATE_LIMITED, { reason: result.error });
        } else if (result.error === 'validation') {
          setError(chatCopy.errorValidation);
        } else {
          setError(chatCopy.errorGeneric);
        }
        return;
      }

      // Confirm optimistic with server id/ts
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticId
            ? {
                id: result.messageId ?? optimisticId,
                ts: result.ts,
                direction: 'in',
                text,
                pending: false,
              }
            : m
        )
      );
      visitorMessageCountRef.current += 1;

      // First successful send creates the server-side session. Only now
      // does it make sense to start polling for admin replies — before
      // this point, the poll endpoint would 410 and trigger the
      // "restarted" modal on every fresh widget open.
      if (!hasConversationRef.current) {
        hasConversationRef.current = true;
        startLivePoll();
      }

      scheduleIdleHint();
      maybeShowLeadCard();
    },
    [
      sending,
      draft,
      pathname,
      startLivePoll,
      scheduleIdleHint,
      maybeShowLeadCard,
    ]
  );

  // When rate-limited countdown elapses, clear the banner so user can retry
  useEffect(() => {
    if (rateLimitedSeconds == null) return;
    const t = setTimeout(() => setRateLimitedSeconds(null), rateLimitedSeconds * 1000);
    return () => clearTimeout(t);
  }, [rateLimitedSeconds]);

  const whatsappHref = useMemo(() => {
    const { phone } = getWhatsAppConfig();
    if (!phone) return null;
    return buildWhatsAppUrl(phone, buildContextualWhatsAppMessage(pathname));
  }, [pathname]);

  if (!mounted) return null;

  const portalTarget = document.body;

  // Tap-ghost suppression: any pointer/click on the panel within the
  // first 350 ms of opening is the same physical tap that opened the
  // FAB. iOS Safari batches touch events and sometimes delivers a
  // trailing click to whatever DOM node sits at the tap coordinates
  // after the FAB disappears — which is our panel. Swallow those.
  const tapGuard = (e: React.SyntheticEvent) => {
    if (Date.now() - openedAtMsRef.current < 350) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const fab = (
    <button
      type="button"
      onClick={handleOpen}
      aria-label={chatCopy.fabAriaLabel}
      aria-hidden={open ? 'true' : 'false'}
      tabIndex={open ? -1 : 0}
      style={{
        visibility: open ? 'hidden' : 'visible',
        pointerEvents: open ? 'none' : 'auto',
      }}
      className="
        fixed bottom-5 right-5 z-40
        inline-flex items-center gap-2
        rounded-full bg-gradient-cta text-white
        px-5 py-4 shadow-signature
        animate-pulse-soft
        transition-all duration-200
        hover:scale-105 hover:shadow-elevated
        active:scale-95
        sm:bottom-6 sm:right-6
      "
    >
      <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold">{chatCopy.fabLabel}</span>
    </button>
  );

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={chatCopy.headerTitle}
      aria-hidden={open ? 'false' : 'true'}
      onClickCapture={tapGuard}
      onTouchStartCapture={tapGuard}
      onPointerDownCapture={tapGuard}
      style={{
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
      }}
      className="
        fixed z-50
        bottom-0 right-0 left-0
        sm:bottom-6 sm:right-6 sm:left-auto
        sm:w-[380px] sm:max-w-[calc(100vw-3rem)]
        h-[85dvh] sm:h-[560px] sm:max-h-[calc(100vh-3rem)]
        flex flex-col
        bg-white shadow-elevated
        sm:rounded-brand-lg
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-hero text-white">
        <div>
          <div className="text-sm font-semibold leading-tight">{chatCopy.headerTitle}</div>
          <div className="text-[11px] opacity-90">{chatCopy.headerSubtitle}</div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label={chatCopy.closeAria}
          className="p-1.5 rounded-full hover:bg-white/15"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Restarted overlay */}
      {restarted ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-brand-bg">
          <div className="text-sm font-semibold text-brand-text">
            {chatCopy.restartedTitle}
          </div>
          <p className="mt-2 text-xs text-brand-muted leading-snug">
            {chatCopy.restartedBody}
          </p>
          <button
            type="button"
            onClick={resetAfterRestart}
            className="mt-4 text-xs font-semibold bg-primary text-white rounded-brand-md px-4 py-2 hover:bg-primary-dark"
          >
            {chatCopy.restartedCta}
          </button>
        </div>
      ) : (
        <>
          <ChatMessageList
            messages={messages}
            showGreeting={messages.length === 0}
          />

          {leadCardVisible && !leadCardDismissed && (
            <ChatLeadCard
              sessionId={sessionIdRef.current}
              pathname={pathname}
              onDismiss={() => {
                setLeadCardVisible(false);
                setLeadCardDismissed(true);
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem(LEAD_CARD_STORAGE_KEY, '1');
                }
              }}
              onSubmitted={() => {
                setLeadCardVisible(false);
                setLeadCardDismissed(true);
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem(LEAD_CARD_STORAGE_KEY, '1');
                }
              }}
            />
          )}

          {showIdleHint && whatsappHref && (
            <div className="mx-4 my-2 rounded-brand-lg bg-accent/10 border border-accent/30 px-3 py-2.5 text-xs">
              <div className="font-semibold text-brand-text">
                {chatCopy.idleHintTitle}
              </div>
              <p className="mt-0.5 text-brand-muted leading-snug">
                {chatCopy.idleHintBody}
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold text-secondary hover:text-secondary-dark"
              >
                {chatCopy.idleHintCta} →
              </a>
            </div>
          )}

          {reconnecting && (
            <div className="px-4 py-1.5 text-[11px] text-center bg-warning/10 text-warning border-t border-warning/20">
              {chatCopy.errorReconnecting}
            </div>
          )}

          {rateLimitedSeconds != null && (
            <div className="px-4 py-1.5 text-[11px] text-center bg-danger/10 text-danger border-t border-danger/20">
              {chatCopy.errorRateLimited(rateLimitedSeconds)}
            </div>
          )}

          {error && !rateLimitedSeconds && (
            <div className="px-4 py-1.5 text-[11px] text-center bg-danger/10 text-danger border-t border-danger/20">
              {error}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="border-t border-brand-border bg-white px-3 py-2.5"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e as unknown as React.FormEvent);
                  }
                }}
                placeholder={chatCopy.inputPlaceholder}
                rows={1}
                maxLength={1000}
                disabled={sending || rateLimitedSeconds != null}
                className="flex-1 resize-none text-sm leading-snug px-3 py-2 rounded-brand-md border border-brand-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 max-h-24"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim() || rateLimitedSeconds != null}
                aria-label={chatCopy.sendLabel}
                className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-brand-md bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} strokeWidth={2.2} />
              </button>
            </div>
            <div className="mt-1.5 text-[10px] text-brand-muted leading-tight">
              {chatCopy.privacyLine}{' '}
              <a
                href="/privacidad"
                className="underline hover:text-brand-text"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chatCopy.privacyLinkLabel}
              </a>
              .
            </div>
          </form>
        </>
      )}
    </div>
  );

  return createPortal(
    <>
      {fab}
      {panel}
    </>,
    portalTarget
  );
}
