'use client';

import { ArrowRight, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { DemoAccessBlock } from './DemoAccessBlock';
import type { Application } from '@/lib/applications';
import { commonContent } from '@/lib/content';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';

type Props = {
  app: Application;
};

export function ApplicationHeroSection({ app }: Props) {
  const { phone, defaultMessage } = getWhatsAppConfig();
  const waHref = phone ? buildWhatsAppUrl(phone, defaultMessage) : null;

  return (
    <section
      id="app-hero"
      data-inpage-nav-sentinel="hero"
      className="relative overflow-hidden bg-gradient-hero text-white"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.5),transparent_45%)]" />

      <Container as="div" className="relative py-16 sm:py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles size={14} strokeWidth={2.5} />
              {app.hero.eyebrow}
            </span>

            <h1 className="text-white leading-[1.1] text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              {app.hero.h1}
            </h1>

            <p className="text-lg sm:text-xl text-white/85 max-w-xl leading-relaxed">
              {app.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {app.demo && (
                <a
                  href={app.demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(EVENTS.CLICK_DEMO, {
                      cta_location: 'hero',
                      application_id: app.id,
                    })
                  }
                  className="btn-cta px-7 py-4 text-base sm:text-lg"
                >
                  Probar Demo
                  <ExternalLink size={18} strokeWidth={2} />
                </a>
              )}
              <a
                href="#contact"
                className="btn-base bg-white/15 border border-white/40 text-white hover:bg-white/25 px-7 py-4 text-base sm:text-lg"
              >
                Solicitar Implementación
                <ArrowRight size={18} strokeWidth={2} />
              </a>
            </div>

            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent(EVENTS.CLICK_WHATSAPP_HERO, {
                    cta_location: 'hero',
                    application_id: app.id,
                  })
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors self-start"
                title={commonContent.legal.external_link_tooltip}
              >
                <MessageCircle size={16} strokeWidth={2} />
                Chatear por WhatsApp
              </a>
            )}
          </div>

          {app.demo && (
            <div className="lg:pl-6">
              <DemoAccessBlock demo={app.demo} applicationId={app.id} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
