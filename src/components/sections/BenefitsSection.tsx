import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

type BenefitCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  cards: readonly BenefitCard[];
};

export function BenefitsSection({ eyebrow, title, subtitle, cards }: Props) {
  return (
    <section id="benefits" className="section bg-white">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} as="li">
              <div className="flex flex-col gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-brand-lg bg-gradient-cta text-white shadow-signature">
                  <DynamicIcon name={card.icon} size={22} strokeWidth={2} />
                </span>
                <h3 className="text-lg font-bold text-brand-text">{card.title}</h3>
                <p className="text-brand-muted leading-relaxed">{card.description}</p>
              </div>
            </Card>
          ))}
        </ul>
      </Container>
    </section>
  );
}
