import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { content } from '@/lib/content';

export function AudienceSection() {
  return (
    <section id="audience" className="section">
      <Container>
        <SectionHeading eyebrow={content.audience.eyebrow} title={content.audience.section_title} />

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {content.audience.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-text shadow-card transition-all hover:border-primary hover:-translate-y-0.5"
            >
              {chip}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-brand-muted max-w-2xl mx-auto">
          {content.audience.closing_line}
        </p>
      </Container>
    </section>
  );
}
