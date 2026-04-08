'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { companyContent } from '@/lib/content';
import { cn } from '@/lib/cn';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border">
      <div className="container-brand flex items-center justify-between gap-4 h-16 sm:h-18">
        <Link href="/" aria-label="Inicio ROHU Solutions">
          <BrandLogo size={36} priority />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-7">
          {companyContent.nav.items.map((item) => (
            <Link
              key={item.id}
              href={item.href.startsWith('#') ? `/${item.href}` : item.href}
              className="text-sm font-medium text-brand-muted hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button as="a" href="/#contact" variant="primary" size="sm">
            {companyContent.nav.cta_primary}
            <ArrowRight size={14} strokeWidth={2} />
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
          {companyContent.nav.items.map((item) => (
            <Link
              key={item.id}
              href={item.href.startsWith('#') ? `/${item.href}` : item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-base font-medium text-brand-text hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button
            as="a"
            href="/#contact"
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setMobileOpen(false)}
          >
            {companyContent.nav.cta_primary}
          </Button>
        </div>
      </div>
    </header>
  );
}
