import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ApplicationCard } from './ApplicationCard';
import { applications } from '@/lib/applications';
import { companyContent } from '@/lib/content';

export function ApplicationsGridSection() {
  return (
    <section id="applications" className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow={companyContent.applicationsSection.eyebrow}
          title={companyContent.applicationsSection.section_title}
          subtitle={companyContent.applicationsSection.section_subtitle}
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
