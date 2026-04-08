import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { LeadForm } from '@/components/forms/LeadForm';

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  preselectedApp?: string;
};

export function CtaSection({ eyebrow, title, body, preselectedApp }: Props) {
  return (
    <section id="contact" className="section bg-gradient-to-b from-brand-bg to-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <SectionHeading eyebrow={eyebrow} title={title} align="left" />
            <p className="mt-6 text-brand-muted leading-relaxed">{body}</p>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-brand-xl border border-brand-border bg-white p-6 sm:p-8 shadow-elevated">
              <LeadForm preselectedApp={preselectedApp} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
