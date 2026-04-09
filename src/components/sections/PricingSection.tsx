'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { QuickQuoteModal } from '@/components/forms/QuickQuoteModal';
import type { PricingTier } from '@/types/pricingTier';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tiers: readonly PricingTier[];
  applicationId?: string;
};

export function PricingSection({ eyebrow, title, subtitle, tiers, applicationId }: Props) {
  // The selected tier drives the QuickQuoteModal: open when not null, closed otherwise.
  const [openTier, setOpenTier] = useState<PricingTier | null>(null);

  const handleOpenQuote = (tier: PricingTier) => {
    trackEvent(EVENTS.CLICK_PRICING, {
      plan_id: tier.id,
      plan_name: tier.name,
      application_id: applicationId ?? null,
    });
    setOpenTier(tier);
  };

  return (
    <section id="pricing" className="section bg-white">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <ul className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} onQuote={handleOpenQuote} />
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-brand-muted">
          Los precios se ajustan al tamaño y necesidades de tu empresa. Cotiza sin compromiso.
        </p>
      </Container>

      <QuickQuoteModal
        open={openTier !== null}
        onClose={() => setOpenTier(null)}
        tier={openTier}
        applicationId={applicationId ?? 'general'}
      />
    </section>
  );
}

type PricingCardProps = {
  tier: PricingTier;
  onQuote: (tier: PricingTier) => void;
};

function PricingCard({ tier, onQuote }: PricingCardProps) {
  return (
    <li
      className={cn(
        'relative flex flex-col rounded-brand-xl border p-7 transition-all',
        tier.isPopular
          ? 'border-primary bg-gradient-to-b from-primary/5 to-white shadow-elevated lg:-translate-y-2'
          : 'border-brand-border bg-white shadow-card hover:-translate-y-0.5 hover:shadow-elevated'
      )}
    >
      {tier.isPopular && tier.popularLabel && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge tone="primary" className="bg-primary text-white shadow-elevated">
            <Sparkles size={12} strokeWidth={2.5} />
            {tier.popularLabel}
          </Badge>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold text-brand-text">{tier.name}</h3>
        <p className="text-sm text-brand-muted">{tier.tagline}</p>
      </div>

      <p className="mt-5 text-sm text-brand-text/80 leading-relaxed">{tier.targetAudience}</p>

      <ul className="mt-6 space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-brand-text">
            <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-secondary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/*
       * Real <button> instead of <a href="#contact?plan=...">.
       * The previous implementation was broken because '?plan=...' inside a
       * fragment URL is not a query string — the browser looked for an
       * element with id="contact?plan=basic" that doesn't exist, so the
       * scroll silently failed. Now the click opens the QuickQuoteModal via
       * React state — no URL navigation involved.
       */}
      <button
        type="button"
        onClick={() => onQuote(tier)}
        aria-label={`Cotizar el plan ${tier.name}`}
        className={cn(
          'mt-8 text-center py-3 rounded-brand-lg font-semibold transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          tier.isPopular
            ? 'bg-gradient-cta text-white shadow-signature hover:shadow-elevated hover:scale-[1.01]'
            : 'bg-primary text-white hover:bg-primary-dark'
        )}
      >
        {tier.ctaLabel}
      </button>

      <p className="mt-3 text-center text-xs text-brand-muted">{tier.billingNote}</p>
    </li>
  );
}
