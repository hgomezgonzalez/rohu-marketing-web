import { MessageSquareText, Quote } from 'lucide-react';
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
 * collected and authorized. No CTA (the funnel-designer flagged that a second
 * "habla con un asesor" here would compete with the form one section below),
 * no fake avatars, no skeleton loaders — minimal visual surface.
 */
function PendingTestimonialsBlock() {
  return (
    <section id="testimonials" className="section">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-brand-lg bg-accent/10 text-accent">
            <MessageSquareText size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>

          <span className="eyebrow mt-4 inline-flex">{pendingTestimonialsCopy.eyebrow}</span>

          <h2 className="mt-3 text-xl sm:text-2xl font-bold text-brand-text">
            {pendingTestimonialsCopy.title}
          </h2>

          <p className="mt-3 text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
            {pendingTestimonialsCopy.body}
          </p>
        </div>
      </Container>
    </section>
  );
}
