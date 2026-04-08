'use client';

import Link from 'next/link';
import { MessageCircle, Send } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { content } from '@/lib/content';
import {
  buildTelegramUrl,
  buildWhatsAppUrl,
  getTelegramUsername,
  getWhatsAppConfig,
} from '@/lib/contactChannels';
import { trackEvent, EVENTS } from '@/lib/analytics';

export function Footer() {
  const { phone, defaultMessage } = getWhatsAppConfig();
  const telegramUsername = getTelegramUsername();
  const waHref = phone ? buildWhatsAppUrl(phone, defaultMessage) : null;
  const tgHref = telegramUsername ? buildTelegramUrl(telegramUsername) : null;

  return (
    <footer className="bg-primary-dark text-white mt-16">
      <div className="container-brand py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="text-white">
            <BrandLogo size={40} />
          </div>
          <p className="text-white/80 max-w-md leading-relaxed">{content.footer.description}</p>
          <p className="text-sm text-white/60 max-w-md">{content.footer.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-white text-base font-semibold mb-4">{content.footer.contact_title}</h3>
          <ul className="flex flex-col gap-3 text-sm">
            {waHref && (
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent(EVENTS.CLICK_WHATSAPP_FAB, { cta_location: 'footer' })}
                  title={content.legal.external_link_tooltip}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <MessageCircle size={18} strokeWidth={1.75} />
                  WhatsApp
                </a>
              </li>
            )}
            {tgHref && (
              <li>
                <a
                  href={tgHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(EVENTS.CLICK_TELEGRAM, { cta_location: 'footer' })
                  }
                  title={content.legal.external_link_tooltip}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Send size={18} strokeWidth={1.75} />
                  Telegram
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-white text-base font-semibold mb-4">{content.footer.legal_title}</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link
                href="/privacidad"
                className="text-white/80 hover:text-white transition-colors"
              >
                {content.footer.links.privacy}
              </Link>
            </li>
            <li>
              <Link
                href="/terminos"
                className="text-white/80 hover:text-white transition-colors"
              >
                {content.footer.links.terms}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-12 border-t border-white/15 pt-6 flex flex-col gap-4">
          <p className="text-xs text-white/70 leading-relaxed max-w-4xl">
            <strong className="text-white">Aviso importante:</strong> {content.footer.disclaimer_dian}
          </p>
          <p className="text-xs text-white/50">{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
