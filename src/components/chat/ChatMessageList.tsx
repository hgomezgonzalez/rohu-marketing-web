'use client';

import { useEffect, useRef } from 'react';
import { chatCopy } from '@/lib/chatCopy';

export interface ChatViewMessage {
  id: string;
  ts: number;
  direction: 'in' | 'out' | 'system';
  text: string;
  pending?: boolean;
  error?: boolean;
}

interface Props {
  messages: ChatViewMessage[];
  showGreeting: boolean;
}

/**
 * Pure presentational list of chat bubbles. Visitor messages ('in') sit
 * right-aligned in primary blue; admin messages ('out') sit left-aligned
 * in white with a subtle border; 'system' notices are a centered pill.
 *
 * Auto-scrolls to bottom whenever the message list grows. Never uses
 * dangerouslySetInnerHTML — all text is rendered as plain React children.
 */
export function ChatMessageList({ messages, showGreeting }: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div
      ref={listRef}
      role="log"
      aria-live="polite"
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-brand-bg"
    >
      {showGreeting && (
        <Bubble direction="out" pending={false} error={false}>
          {chatCopy.greeting}
        </Bubble>
      )}
      {messages.map((m) => {
        if (m.direction === 'system') {
          return (
            <div key={m.id} className="flex justify-center">
              <span className="text-[11px] uppercase tracking-wide text-brand-muted bg-white rounded-full px-3 py-1 border border-brand-border">
                {m.text}
              </span>
            </div>
          );
        }
        return (
          <Bubble
            key={m.id}
            direction={m.direction}
            pending={m.pending}
            error={m.error}
          >
            {m.text}
          </Bubble>
        );
      })}
    </div>
  );
}

interface BubbleProps {
  direction: 'in' | 'out';
  pending?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

function Bubble({ direction, pending, error, children }: BubbleProps) {
  const isVisitor = direction === 'in';
  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[80%] rounded-brand-lg px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-card',
          isVisitor
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-white text-brand-text border border-brand-border rounded-bl-md',
          pending ? 'opacity-70' : '',
          error ? 'ring-2 ring-red-400' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
