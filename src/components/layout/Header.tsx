'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { content } from '@/lib/content';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { cn } from '@/lib/cn';

const DEMO_URL =
  process.env.NEXT_PUBLIC_DEMO_URL ?? 'https://rohu-contable-prod-3fba93dd2eb4.herokuapp.com/';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border">
      <div className="container-brand flex items-center justify-between gap-4 h-16 sm:h-18">
        <Link href="/" aria-label="Inicio ROHU Contable">
          <BrandLogo size={36} priority />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-7">
          {content.nav.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-brand-muted hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            as="a"
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            onClick={() => trackEvent(EVENTS.CLICK_DEMO, { cta_location: 'navbar' })}
          >
            {content.nav.cta_primary}
            <ExternalLink size={14} strokeWidth={2} />
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-brand-md p-2 text-brand-text"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>
      </div>

      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-brand-border transition-[max-height]',
          mobileOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="container-brand flex flex-col gap-3 py-4">
          {content.nav.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-base font-medium text-brand-text hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <Button
            as="a"
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              trackEvent(EVENTS.CLICK_DEMO, { cta_location: 'navbar_mobile' });
              setMobileOpen(false);
            }}
          >
            {content.nav.cta_primary}
          </Button>
        </div>
      </div>
    </header>
  );
}
