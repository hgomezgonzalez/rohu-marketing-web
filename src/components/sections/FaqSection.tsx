import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { faqs, faqsSection } from '@/lib/faqs';

export function FaqSection() {
  return (
    <section id="faqs" className="section bg-white">
      <Container>
        <SectionHeading
          eyebrow={faqsSection.eyebrow}
          title={faqsSection.section_title}
          subtitle={faqsSection.section_subtitle}
        />

        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion items={faqs} />
        </div>
      </Container>
    </section>
  );
}
