import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { modules, modulesSection } from '@/lib/modules';

export function ModulesGridSection() {
  return (
    <section id="modules" className="section">
      <Container>
        <SectionHeading
          eyebrow={modulesSection.eyebrow}
          title={modulesSection.section_title}
          subtitle={modulesSection.section_subtitle}
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {modules.map((mod) => (
            <li
              key={mod.id}
              className="rounded-brand-lg border border-brand-border bg-white p-5 flex items-start gap-4 shadow-card transition-all hover:border-primary/40 hover:-translate-y-0.5"
            >
              <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-brand-md bg-primary/10 text-primary">
                <DynamicIcon name={mod.icon} size={20} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-base font-bold text-brand-text">{mod.label}</h3>
                <p className="text-sm text-brand-muted mt-1 leading-relaxed">{mod.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
