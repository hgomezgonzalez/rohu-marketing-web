'use client';

import { Check, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { pricingSection, pricingTiers, type PricingTier } from '@/lib/pricingTiers';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { cn } from '@/lib/cn';

export function PricingSection() {
  return (
    <section id="pricing" className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow={pricingSection.eyebrow}
          title={pricingSection.section_title}
          subtitle={pricingSection.section_subtitle}
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-brand-muted">
          Los precios se ajustan al tamaño y necesidades de tu empresa. Cotiza sin compromiso.
        </p>
      </Container>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
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
            <Check
              size={16}
              strokeWidth={2.5}
              className="mt-0.5 flex-shrink-0 text-secondary"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={tier.ctaHref}
        onClick={() =>
          trackEvent(EVENTS.CLICK_PRICING, {
            plan_id: tier.id,
            plan_name: tier.name,
          })
        }
        className={cn(
          'mt-8 text-center py-3 rounded-brand-lg font-semibold transition-all',
          tier.isPopular
            ? 'bg-gradient-cta text-white shadow-signature hover:shadow-elevated hover:scale-[1.01]'
            : 'bg-primary text-white hover:bg-primary-dark'
        )}
      >
        {tier.ctaLabel}
      </a>

      <p className="mt-3 text-center text-xs text-brand-muted">{tier.billingNote}</p>
    </li>
  );
}
