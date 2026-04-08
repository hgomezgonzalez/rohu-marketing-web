'use client';

import { MessageCircle } from 'lucide-react';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';
import { commonContent } from '@/lib/content';

/**
 * Floating WhatsApp action button — always visible on the bottom-right
 * of every page. Opens a pre-filled wa.me conversation. Accessible label
 * and tracks the click_whatsapp_fab event.
 */
export function WhatsAppFab() {
  const { phone, defaultMessage } = getWhatsAppConfig();
  if (!phone) return null;
  const href = buildWhatsAppUrl(phone, defaultMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear con nosotros por WhatsApp"
      title={commonContent.legal.external_link_tooltip}
      onClick={() => trackEvent(EVENTS.CLICK_WHATSAPP_FAB, { cta_location: 'fab' })}
      className="
        fixed bottom-5 right-5 z-40
        inline-flex items-center gap-2
        rounded-full bg-secondary text-white
        px-5 py-4 shadow-signature
        animate-pulse-soft
        transition-all duration-200
        hover:bg-secondary-dark hover:scale-105 hover:shadow-elevated
        active:scale-95
        sm:bottom-6 sm:right-6
      "
    >
      <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold">Chatea con nosotros</span>
    </a>
  );
}
