import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Props = {
  eyebrow: string;
  title: string;
  chips: readonly string[];
  closingLine?: string;
};

export function AudienceSection({ eyebrow, title, chips, closingLine }: Props) {
  return (
    <section id="audience" className="section">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-text shadow-card transition-all hover:border-primary hover:-translate-y-0.5"
            >
              {chip}
            </li>
          ))}
        </ul>

        {closingLine && (
          <p className="mt-8 text-center text-brand-muted max-w-2xl mx-auto">{closingLine}</p>
        )}
      </Container>
    </section>
  );
}
