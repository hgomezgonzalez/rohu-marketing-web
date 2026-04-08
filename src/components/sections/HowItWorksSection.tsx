import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { content } from '@/lib/content';

export function HowItWorksSection() {
  return (
    <section id="how" className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow={content.how_it_works.eyebrow}
          title={content.how_it_works.section_title}
          subtitle={content.how_it_works.section_subtitle}
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.how_it_works.steps.map((step) => (
            <li
              key={step.number}
              className="card p-6 flex flex-col gap-3 relative"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-brand-md bg-primary text-white font-display font-bold">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-brand-text">{step.title}</h3>
              <p className="text-brand-muted leading-relaxed">{step.description}</p>
              <p className="text-xs text-secondary-dark font-medium mt-1">💡 {step.hint}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
