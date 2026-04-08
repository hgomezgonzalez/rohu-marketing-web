'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { CopyToClipboardButton } from '@/components/ui/CopyToClipboardButton';
import { trackEvent, EVENTS } from '@/lib/analytics';

type Props = {
  demo: {
    url: string;
    user: string;
    password: string;
    notice: string;
  };
  applicationId?: string;
};

export function DemoAccessBlock({ demo, applicationId }: Props) {
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
          <p className="text-sm font-semibold text-white">Acceso demo público</p>
          <p className="text-xs text-white/80 mt-0.5 leading-relaxed">{demo.notice}</p>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-brand-md bg-white/90 px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <dt className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">
              Usuario
            </dt>
            <dd className="text-sm font-mono font-semibold text-brand-text truncate">
              {demo.user}
            </dd>
          </div>
          <CopyToClipboardButton
            value={demo.user}
            label="Copiar usuario"
            trackField="user"
          />
        </div>
        <div className="rounded-brand-md bg-white/90 px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <dt className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">
              Contraseña
            </dt>
            <dd className="text-sm font-mono font-semibold text-brand-text truncate">
              {demo.password}
            </dd>
          </div>
          <CopyToClipboardButton
            value={demo.password}
            label="Copiar contraseña"
            trackField="password"
          />
        </div>
      </dl>

      <a
        href={demo.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent(EVENTS.CLICK_DEMO, {
            cta_location: 'hero_demo_block',
            application_id: applicationId ?? null,
          })
        }
        className="btn-cta w-full py-3 text-base"
      >
        Entrar al Demo
        <ExternalLink size={16} strokeWidth={2} />
      </a>
    </div>
  );
}
