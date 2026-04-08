import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: readonly FaqItem[];
};

export function FaqSection({ eyebrow, title, subtitle, items }: Props) {
  return (
    <section id="faqs" className="section bg-white">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion items={items as FaqItem[]} />
        </div>
      </Container>
    </section>
  );
}
