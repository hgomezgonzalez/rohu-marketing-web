'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, FlaskConical } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Badge } from '@/components/ui/Badge';
import type { Application } from '@/lib/applications';
import { companyContent } from '@/lib/content';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Props = {
  app: Application;
};

export function ApplicationCard({ app }: Props) {
  const isLive = app.status === 'live';
  const isBeta = app.status === 'beta';

  const badgeLabel = isLive
    ? companyContent.applicationsSection.badge_live
    : isBeta
      ? companyContent.applicationsSection.badge_beta
      : companyContent.applicationsSection.badge_coming_soon;

  const badgeTone = isLive ? 'success' : isBeta ? 'warning' : 'muted';
  const BadgeIcon = isLive ? CheckCircle2 : isBeta ? FlaskConical : Clock;

  const ctaLabel = isLive
    ? companyContent.applicationsSection.cta_live
    : isBeta
      ? companyContent.applicationsSection.cta_beta
      : companyContent.applicationsSection.cta_coming_soon;

  const accentClass =
    app.accentColor === 'secondary'
      ? 'from-secondary to-accent'
      : app.accentColor === 'accent'
        ? 'from-accent to-primary'
        : 'from-primary to-accent';

  const handleClick = () => {
    trackEvent(EVENTS.CLICK_APPLICATION_CARD, {
      application_id: app.id,
      status: app.status,
    });
  };

  const cardBody = (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-brand-xl bg-white p-6 sm:p-7 transition-all',
        isLive
          ? 'border-2 border-secondary/40 shadow-card hover:-translate-y-1 hover:border-secondary hover:shadow-elevated'
          : isBeta
            ? 'border-2 border-warning/40 shadow-card hover:-translate-y-0.5 hover:border-warning hover:shadow-elevated'
            : 'border border-brand-border/70 shadow-card opacity-80 hover:opacity-100'
      )}
    >
      {/* Badge always at full opacity, even when coming_soon dims the rest */}
      <div className="absolute top-4 right-4 z-10 opacity-100">
        <Badge tone={badgeTone} className="gap-1.5">
          <BadgeIcon size={11} strokeWidth={2.5} />
          {badgeLabel}
        </Badge>
      </div>

      <div className="mb-5">
        <span
          className={cn(
            'inline-flex h-14 w-14 items-center justify-center rounded-brand-lg bg-gradient-to-br text-white shadow-signature',
            accentClass
          )}
        >
          <DynamicIcon name={app.iconName} size={26} strokeWidth={1.75} />
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-brand-text">{app.name}</h3>
      <p className="mt-2 text-sm text-brand-muted leading-relaxed">{app.tagline}</p>

      <p className="mt-4 text-sm text-brand-text/75 leading-relaxed flex-1">{app.description}</p>

      {app.targetAudience.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {app.targetAudience.slice(0, 4).map((audience) => (
            <li
              key={audience}
              className="rounded-full bg-brand-bg border border-brand-border px-2.5 py-1 text-[11px] font-medium text-brand-muted"
            >
              {audience}
            </li>
          ))}
        </ul>
      )}

      <div
        className={cn(
          'mt-6 inline-flex items-center gap-2 font-semibold transition-all',
          isLive
            ? 'text-primary group-hover:gap-3'
            : 'text-brand-muted cursor-not-allowed'
        )}
      >
        {ctaLabel}
        {isLive && <ArrowRight size={16} strokeWidth={2} />}
      </div>
    </article>
  );

  if (isLive) {
    return (
      <li>
        <Link
          href={`/productos/${app.slug}`}
          onClick={handleClick}
          aria-label={`Ver detalles de ${app.name}`}
          className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg rounded-brand-xl"
        >
          {cardBody}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${app.name} — ${badgeLabel}`}
        className="block w-full h-full text-left cursor-not-allowed"
        disabled
      >
        {cardBody}
      </button>
    </li>
  );
}
