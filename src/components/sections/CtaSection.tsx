import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadForm } from '@/components/forms/LeadForm';
import { content } from '@/lib/content';

export function CtaSection() {
  return (
    <section id="contact" className="section bg-gradient-to-b from-brand-bg to-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <SectionHeading
              eyebrow={content.cta_final.eyebrow}
              title={content.cta_final.section_title}
              align="left"
            />
            <p className="mt-6 text-brand-muted leading-relaxed">{content.cta_final.body}</p>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-brand-xl border border-brand-border bg-white p-6 sm:p-8 shadow-elevated">
              <LeadForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
