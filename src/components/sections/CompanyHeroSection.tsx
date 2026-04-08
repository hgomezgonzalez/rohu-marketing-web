'use client';

import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { companyContent } from '@/lib/content';

export function CompanyHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 pointer-events-none opacity-25 [background-image:radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.5),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(6,182,212,0.6),transparent_45%),radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.35),transparent_45%)]" />

      <Container as="div" className="relative py-20 sm:py-24 md:py-28">
        <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <Sparkles size={14} strokeWidth={2.5} />
            {companyContent.hero.eyebrow}
          </span>

          <h1 className="text-white leading-[1.08] text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            {companyContent.hero.h1}
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
            {companyContent.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a href="#applications" className="btn-cta px-7 py-4 text-base sm:text-lg">
              {companyContent.hero.cta_primary_label}
              <ArrowDown size={18} strokeWidth={2} />
            </a>
            <a
              href="#contact"
              className="btn-base bg-white/15 border border-white/40 text-white hover:bg-white/25 px-7 py-4 text-base sm:text-lg"
            >
              {companyContent.hero.cta_secondary_label}
              <ArrowRight size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
