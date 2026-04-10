'use client';

import { ArrowRight, Eye, ExternalLink, MessageCircle, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { DemoAccessBlock } from './DemoAccessBlock';
import type { Application } from '@/lib/applications';
import { commonContent } from '@/lib/content';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';
import { cn } from '@/lib/cn';

type Props = {
  app: Application;
};

/**
 * Hero variants by application configuration:
 *
 *  - app.demo present       → split layout (text left + DemoAccessBlock right)
 *                              with "Probar Demo" primary CTA.
 *  - app.previewUrl present → centered layout with "Ver plataforma en vivo"
 *                              secondary CTA opening the public preview URL
 *                              in a new tab. No credentials block.
 *  - neither                → centered layout with only "Solicitar
 *                              Implementación" + WhatsApp.
 *
 * Tracking:
 *  - Demo credentials click  → click_demo with demo_type='credentials'
 *  - Public preview click    → click_demo with demo_type='public_preview'
 */
export function ApplicationHeroSection({ app }: Props) {
  const { phone, defaultMessage } = getWhatsAppConfig();
  const waHref = phone ? buildWhatsAppUrl(phone, defaultMessage) : null;
  const hasDemo = !!app.demo;
  const hasPreview = !hasDemo && !!app.previewUrl;
  const isSplit = hasDemo;

  return (
    <section
      id="app-hero"
      data-inpage-nav-sentinel="hero"
      className="relative overflow-hidden bg-gradient-hero text-white"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.5),transparent_45%)]" />

      <Container as="div" className="relative py-16 sm:py-20 md:py-24">
        <div
          className={cn(
            'gap-10 items-center',
            isSplit ? 'grid lg:grid-cols-2 lg:gap-16' : 'flex flex-col max-w-3xl mx-auto text-center'
          )}
        >
          <div
            className={cn(
              'flex flex-col gap-6 animate-fade-in-up',
              !isSplit && 'items-center'
            )}
          >
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Sparkles size={14} strokeWidth={2.5} />
              {app.hero.eyebrow}
            </span>

            <h1
              className={cn(
                'text-white leading-[1.1] text-4xl sm:text-5xl font-extrabold',
                isSplit ? 'lg:text-6xl' : 'lg:text-5xl'
              )}
            >
              {app.hero.h1}
            </h1>

            <p
              className={cn(
                'text-lg sm:text-xl text-white/85 leading-relaxed',
                isSplit ? 'max-w-xl' : 'max-w-2xl'
              )}
            >
              {app.hero.subheadline}
            </p>

            <div
              className={cn(
                'flex flex-col sm:flex-row gap-3 pt-2',
                !isSplit && 'sm:justify-center'
              )}
            >
              {hasDemo && app.demo && (
                <a
                  href={app.demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(EVENTS.CLICK_DEMO, {
                      cta_location: 'hero',
                      application_id: app.id,
                      demo_type: 'credentials',
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
                className="btn-cta px-7 py-4 text-base sm:text-lg"
              >
                {hasPreview ? 'Pedir propuesta' : 'Solicitar Implementación'}
                <ArrowRight size={18} strokeWidth={2} />
              </a>
              {hasPreview && app.previewUrl && (
                <a
                  href={app.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(EVENTS.CLICK_DEMO, {
                      cta_location: 'hero',
                      application_id: app.id,
                      demo_type: 'public_preview',
                    })
                  }
                  className="btn-base bg-white/15 border border-white/40 text-white hover:bg-white/25 px-7 py-4 text-base sm:text-lg"
                >
                  <Eye size={18} strokeWidth={2} />
                  Ver plataforma en vivo
                </a>
              )}
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
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors',
                  isSplit ? 'self-start' : ''
                )}
                title={commonContent.legal.external_link_tooltip}
              >
                <MessageCircle size={16} strokeWidth={2} />
                Chatear por WhatsApp
              </a>
            )}
          </div>

          {hasDemo && app.demo && (
            <div className="lg:pl-6">
              <DemoAccessBlock demo={app.demo} applicationId={app.id} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
