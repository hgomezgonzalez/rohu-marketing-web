'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { CopyToClipboardButton } from '@/components/ui/CopyToClipboardButton';
import { content } from '@/lib/content';
import { trackEvent, EVENTS } from '@/lib/analytics';

const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/';
const DEMO_USER = process.env.NEXT_PUBLIC_DEMO_USER ?? 'rohu-contable';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'rohu-contable';

export function DemoAccessBlock() {
  const t = content.hero.demo_block;

  return (
    <div className="rounded-brand-xl border border-white/30 bg-white/10 backdrop-blur-md p-5 sm:p-6 shadow-elevated">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle
          size={18}
          strokeWidth={2}
          className="flex-shrink-0 mt-0.5 text-warning"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-white">{t.title}</p>
          <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{t.notice}</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-brand-md bg-white/90 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">
              {t.user_label}
            </dt>
            <dd className="text-sm font-mono font-semibold text-brand-text">{DEMO_USER}</dd>
          </div>
          <CopyToClipboardButton value={DEMO_USER} label={t.copy_user} trackField="user" />
        </div>
        <div className="rounded-brand-md bg-white/90 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <dt className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">
              {t.password_label}
            </dt>
            <dd className="text-sm font-mono font-semibold text-brand-text">{DEMO_PASSWORD}</dd>
          </div>
          <CopyToClipboardButton
            value={DEMO_PASSWORD}
            label={t.copy_password}
            trackField="password"
          />
        </div>
      </dl>

      <a
        href={DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(EVENTS.CLICK_DEMO, { cta_location: 'hero_demo_block' })}
        className="btn-cta w-full py-3 text-base"
      >
        {t.open_demo}
        <ExternalLink size={16} strokeWidth={2} />
      </a>
    </div>
  );
}
