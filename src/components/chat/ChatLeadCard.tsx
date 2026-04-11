'use client';

import { useState } from 'react';
import { chatCopy } from '@/lib/chatCopy';
import { trackEvent, EVENTS } from '@/lib/analytics';

interface Props {
  sessionId: string;
  pathname: string;
  onDismiss: () => void;
  onSubmitted: () => void;
}

/**
 * Inline soft-ask card rendered inside the chat widget after the visitor
 * has sent ~3 messages OR has been active ~2 minutes. Fully optional:
 * all three fields are non-required; the visitor can dismiss and keep
 * chatting.
 *
 * On submit, POSTs to /api/leads with `formType: 'chat_handoff'` so the
 * existing lead pipeline (email + Telegram notification) captures the
 * contact info even if the chat conversation is eventually lost.
 */
export function ChatLeadCard({ sessionId, pathname, onDismiss, onSubmitted }: Props) {
  const [firstName, setFirstName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!firstName && !whatsapp && !email) {
      // Nothing to save — treat as dismiss
      onDismiss();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName || 'Visitante',
          whatsapp: whatsapp || '0000000000',
          email: email || undefined,
          application: 'chat_live',
          habeasData: true,
          // Metadata so the admin can correlate manually in Telegram
          message: `Chat handoff (session ${sessionId}, page ${pathname})`,
          source: 'chat_handoff',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? 'No pudimos guardar tus datos.');
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      trackEvent(EVENTS.CHAT_LEAD_CARD_SUBMITTED, { pathname });
      setTimeout(() => {
        onSubmitted();
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'network_error');
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-4 my-2 rounded-brand-lg bg-success/10 border border-success/30 px-4 py-3 text-xs text-brand-text animate-fade-in-up">
        ✓ {chatCopy.leadCardSuccess}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 my-2 rounded-brand-lg bg-white border border-brand-border p-3 shadow-card animate-fade-in-up"
    >
      <div className="text-sm font-semibold text-brand-text">{chatCopy.leadCardTitle}</div>
      <p className="mt-1 text-xs text-brand-muted leading-snug">{chatCopy.leadCardBody}</p>

      <div className="mt-3 space-y-2">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={chatCopy.leadCardFirstNamePlaceholder}
          aria-label={chatCopy.leadCardFirstNameLabel}
          className="w-full rounded-brand-md border border-brand-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder={chatCopy.leadCardWhatsappPlaceholder}
          aria-label={chatCopy.leadCardWhatsappLabel}
          className="w-full rounded-brand-md border border-brand-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={chatCopy.leadCardEmailPlaceholder}
          aria-label={chatCopy.leadCardEmailLabel}
          className="w-full rounded-brand-md border border-brand-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {error && <div className="mt-2 text-xs text-danger">{error}</div>}

      <div className="mt-3 flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => {
            trackEvent(EVENTS.CHAT_LEAD_CARD_DISMISSED, { pathname });
            onDismiss();
          }}
          className="text-xs text-brand-muted hover:text-brand-text px-2 py-1"
        >
          {chatCopy.leadCardDismissLabel}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="text-xs font-semibold bg-primary text-white rounded-brand-md px-3 py-1.5 hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? '…' : chatCopy.leadCardSubmitLabel}
        </button>
      </div>
    </form>
  );
}
