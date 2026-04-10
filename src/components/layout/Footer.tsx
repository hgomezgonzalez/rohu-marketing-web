'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { companyContent, commonContent } from '@/lib/content';
import { getLiveApplications } from '@/lib/applications';
import {
  buildTelegramUrl,
  buildWhatsAppUrl,
  getTelegramUsername,
  getWhatsAppConfig,
} from '@/lib/contactChannels';
import { buildContextualWhatsAppMessage } from '@/lib/whatsappMessage';
import { trackEvent, EVENTS } from '@/lib/analytics';

export function Footer() {
  const { phone } = getWhatsAppConfig();
  const pathname = usePathname();
  const telegramUsername = getTelegramUsername();
  const waMessage = buildContextualWhatsAppMessage(pathname);
  const waHref = phone ? buildWhatsAppUrl(phone, waMessage) : null;
  const tgHref = telegramUsername ? buildTelegramUrl(telegramUsername) : null;
  const liveApps = getLiveApplications();

  return (
    <footer className="bg-primary-dark text-white mt-16">
      <div className="container-brand py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="text-white">
            <BrandLogo size={40} />
          </div>
          <p className="text-white/80 max-w-md leading-relaxed">
            {companyContent.footer.description}
          </p>
          <p className="text-sm text-white/60 max-w-md">{companyContent.footer.tagline}</p>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-white text-base font-semibold mb-4">
            {companyContent.footer.applications_title}
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {liveApps.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/productos/${app.slug}`}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {app.name}
                </Link>
              </li>
            ))}
            {liveApps.length === 0 && (
              <li className="text-white/60">Próximamente</li>
            )}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-white text-base font-semibold mb-4">
            {companyContent.footer.contact_title}
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            {waHref && (
              <li>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(EVENTS.CLICK_WHATSAPP_FAB, { cta_location: 'footer' })
                  }
                  title={commonContent.legal.external_link_tooltip}
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
                  onClick={() => trackEvent(EVENTS.CLICK_TELEGRAM, { cta_location: 'footer' })}
                  title={commonContent.legal.external_link_tooltip}
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Send size={18} strokeWidth={1.75} />
                  Telegram
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-white text-base font-semibold mb-4">
            {companyContent.footer.legal_title}
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link
                href="/privacidad"
                className="text-white/80 hover:text-white transition-colors"
              >
                {companyContent.footer.links.privacy}
              </Link>
            </li>
            <li>
              <Link
                href="/terminos"
                className="text-white/80 hover:text-white transition-colors"
              >
                {companyContent.footer.links.terms}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-12 border-t border-white/15 pt-6 flex flex-col gap-4">
          <p className="text-xs text-white/70 leading-relaxed max-w-4xl">
            <strong className="text-white">Aviso importante:</strong>{' '}
            {companyContent.footer.disclaimer_dian}
          </p>
          <p className="text-xs text-white/50">{companyContent.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
