import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { commonContent } from '@/lib/content';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';

export const metadata: Metadata = {
  title: 'Gracias por tu solicitud',
  description: 'Hemos recibido tu solicitud. Un asesor de ROHU te contactará pronto.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const { phone, defaultMessage } = getWhatsAppConfig();
  const waHref = phone ? buildWhatsAppUrl(phone, defaultMessage) : null;

  return (
    <section className="bg-gradient-to-b from-primary/5 to-brand-bg py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-cta text-white shadow-signature mb-6">
            <CheckCircle2 size={40} strokeWidth={2} />
          </div>

          <h1 className="text-brand-text">{commonContent.thank_you.h1}</h1>
          <p className="mt-4 text-lg text-brand-muted">{commonContent.thank_you.subtitle}</p>

          <p className="mt-8 text-base text-brand-text leading-relaxed">{commonContent.thank_you.body}</p>

          <ul className="mt-10 text-left space-y-4 max-w-xl mx-auto">
            {commonContent.thank_you.next_steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-brand-lg border border-brand-border bg-white p-4 shadow-card"
              >
                <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  {idx + 1}
                </span>
                <p className="text-sm text-brand-text leading-relaxed">{step}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-secondary px-6 py-3">
              <ArrowLeft size={18} strokeWidth={2} />
              {commonContent.thank_you.cta_home}
            </Link>
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta px-6 py-3"
              >
                <MessageCircle size={18} strokeWidth={2} />
                {commonContent.thank_you.cta_whatsapp}
              </a>
            )}
          </div>

          <p className="mt-8 text-xs text-brand-muted">{commonContent.thank_you.micro_note}</p>
        </div>
      </Container>
    </section>
  );
}
