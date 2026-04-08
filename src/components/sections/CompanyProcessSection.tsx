import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { companyContent } from '@/lib/content';

export function CompanyProcessSection() {
  return (
    <section id="process" className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow={companyContent.process.eyebrow}
          title={companyContent.process.section_title}
          subtitle={companyContent.process.section_subtitle}
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {companyContent.process.steps.map((step) => (
            <li key={step.number} className="card p-6 flex flex-col gap-3 relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-brand-md bg-gradient-cta text-white font-display font-bold shadow-signature">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-brand-text">{step.title}</h3>
              <p className="text-brand-muted leading-relaxed">{step.description}</p>
              {step.hint && (
                <p className="text-xs text-secondary-dark font-medium mt-1">💡 {step.hint}</p>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
