'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackEvent, EVENTS } from '@/lib/analytics';

type Props = {
  value: string;
  label: string;
  trackField: 'user' | 'password';
  className?: string;
};

export function CopyToClipboardButton({ value, label, trackField, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      trackEvent(EVENTS.COPY_DEMO_CREDENTIALS, { field: trackField });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail in some mobile browsers — silent fallback.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-2 rounded-brand-md border border-brand-border',
        'bg-white px-3 py-2 text-xs font-semibold text-primary',
        'transition-all hover:border-primary hover:bg-primary/5',
        className
      )}
    >
      {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={1.75} />}
      <span>{copied ? '¡Copiado!' : label}</span>
    </button>
  );
}
