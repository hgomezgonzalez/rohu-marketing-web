import Link from 'next/link';
import { MessageSquareText, Quote, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pendingTestimonialsCopy } from '@/lib/content';

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  business: string;
};

type Metric = {
  id: string;
  label: string;
  description: string;
};

type Props = {
  eyebrow: string;
  title: string;
  disclaimer?: string;
  testimonials: readonly Testimonial[];
  metrics?: readonly Metric[];
  /**
   * When true, the section renders a "recopilando testimonios reales"
   * placeholder instead of the mock cards. Controlled centrally via
   * FEATURE_FLAGS.TESTIMONIALS_PUBLISHED in src/lib/content.ts.
   */
  pending?: boolean;
};

export function SocialProofSection({
  eyebrow,
  title,
  disclaimer,
  testimonials,
  metrics,
  pending = false,
}: Props) {
  if (pending) {
    return <PendingTestimonialsBlock />;
  }

  return (
    <section id="testimonials" className="section">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        {disclaimer && (
          <p className="mt-2 text-center text-xs text-brand-muted italic">{disclaimer}</p>
        )}

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id} className="card flex flex-col gap-4 p-6">
              <Quote size={22} strokeWidth={2} className="text-accent" aria-hidden="true" />
              <p className="text-brand-text leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto pt-4 border-t border-brand-border">
                <p className="text-sm font-semibold text-brand-text">{t.name}</p>
                <p className="text-xs text-brand-muted">
                  {t.role} · {t.business}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {metrics && metrics.length > 0 && (
          <ul className="mt-12 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            {metrics.map((m) => (
              <li
                key={m.id}
                className="rounded-brand-lg bg-gradient-cta p-5 text-center text-white shadow-signature"
              >
                <p className="text-lg font-bold">{m.label}</p>
                <p className="text-sm text-white/90 mt-1">{m.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

/**
 * Renders a sober, legal-safe placeholder while real testimonials are being
 * collected and authorized. No fake content, no fake avatars.
 */
function PendingTestimonialsBlock() {
  return (
    <section id="testimonials" className="section">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="card relative overflow-hidden p-8 sm:p-12 text-center">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-cta"
            />

            <span className="inline-flex h-16 w-16 items-center justify-center rounded-brand-xl bg-accent/10 text-accent">
              <MessageSquareText size={32} strokeWidth={1.75} aria-hidden="true" />
            </span>

            <span className="eyebrow mt-5 inline-flex">{pendingTestimonialsCopy.eyebrow}</span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-brand-text">
              {pendingTestimonialsCopy.title}
            </h2>

            <p className="mt-4 text-brand-muted leading-relaxed max-w-lg mx-auto">
              {pendingTestimonialsCopy.body}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={pendingTestimonialsCopy.cta_href}
                className="btn-secondary px-6 py-3"
              >
                {pendingTestimonialsCopy.cta_label}
              </Link>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-xs text-brand-muted">
              <ShieldCheck size={14} strokeWidth={2} className="text-secondary" />
              <span>{pendingTestimonialsCopy.note}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
