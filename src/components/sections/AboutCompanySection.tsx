import { ShieldCheck, Cpu, Handshake } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { companyContent } from '@/lib/content';

const VALUE_ICONS: Record<string, typeof ShieldCheck> = {
  rigor: ShieldCheck,
  tech: Cpu,
  support: Handshake,
};

export function AboutCompanySection() {
  return (
    <section id="about" className="section">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow={companyContent.about.eyebrow}
              title={companyContent.about.section_title}
              align="left"
            />
            <p className="mt-6 text-brand-text leading-relaxed">
              {companyContent.about.paragraph}
            </p>
            <p className="mt-4 text-brand-muted leading-relaxed font-medium">
              {companyContent.about.closing}
            </p>
          </div>

          <ul className="lg:col-span-3 grid gap-4 sm:grid-cols-3">
            {companyContent.about.values.map((value) => {
              const Icon = VALUE_ICONS[value.id] ?? ShieldCheck;
              return (
                <li
                  key={value.id}
                  className="card flex flex-col gap-4 p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-brand-lg bg-primary/10 text-primary">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="text-base font-bold text-brand-text">{value.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{value.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
