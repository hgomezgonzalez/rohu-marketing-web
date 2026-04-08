import { Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

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
};

export function SocialProofSection({ eyebrow, title, disclaimer, testimonials, metrics }: Props) {
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
