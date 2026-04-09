'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  HelpCircle,
  Layers,
  LayoutGrid,
  ListChecks,
  Tag,
  Users,
} from 'lucide-react';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { cn } from '@/lib/cn';

export type InPageNavItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

/**
 * Default nav items in the recommended order for product pages.
 * Icons mapped per section; product pages can override via props.
 */
export const DEFAULT_APP_NAV_ITEMS: InPageNavItem[] = [
  { id: 'benefits', label: 'Beneficios', icon: ListChecks },
  { id: 'audience', label: 'Para quién', icon: Users },
  { id: 'how', label: 'Cómo funciona', icon: Layers },
  { id: 'modules', label: 'Módulos', icon: LayoutGrid },
  { id: 'pricing', label: 'Planes', icon: Tag },
  { id: 'faqs', label: 'Preguntas', icon: HelpCircle },
  { id: 'contact', label: 'Contacto', icon: ClipboardList },
];

type Props = {
  items: InPageNavItem[];
  /** Application slug — used for analytics segmentation */
  applicationId?: string;
};

/**
 * Sticky in-page navigation bar for product pages.
 *
 * - Sits right under the main header (z-20, below the header's z-30).
 * - Desktop: centered flex row.
 * - Mobile: horizontal scroll with snap; the active item auto-scrolls into view.
 * - Scroll spy with IntersectionObserver using a stable activation band.
 * - Smooth scroll on click, with scroll-margin-top handled globally in CSS.
 * - Accessible: <nav>, role="tablist", aria-current, keyboard navigable.
 */
export function InPageNavigation({ items, applicationId }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [isVisible, setIsVisible] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  // Debounce scroll-triggered analytics so we don't spam the dataLayer on every
  // intersection callback. Only fire once per 300ms and only when the active
  // section actually changes. Recommendation from the analytics-tracking agent.
  const lastTrackedIdRef = useRef<string | null>(null);
  const scrollDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal: the nav appears only once the user has scrolled past the hero
  // section (UX call from the funnel-designer agent). Once visible, it stays
  // visible — we never hide it again to avoid flicker when the user scrolls
  // back up.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hero = document.querySelector<HTMLElement>(
      '[data-inpage-nav-sentinel="hero"]'
    );
    if (!hero) {
      // No hero sentinel found → fall back to always visible.
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        // When the hero has scrolled out of view, reveal the nav.
        if (!entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Scroll spy: detect the section closest to the top of the viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aRatio = a.intersectionRatio;
            const bRatio = b.intersectionRatio;
            if (aRatio !== bRatio) return bRatio - aRatio;
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        const next = visible[0]?.target.id;
        if (next && next !== activeId) {
          setActiveId(next);

          // Debounced scroll tracking: only fire once the user actually settles
          // on a new section. Avoids spamming the dataLayer during fast scrolls.
          if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
          scrollDebounceRef.current = setTimeout(() => {
            if (next === lastTrackedIdRef.current) return;
            const label = items.find((i) => i.id === next)?.label ?? next;
            trackEvent(EVENTS.CLICK_INPAGE_NAV, {
              section_id: next,
              section_label: label,
              application_id: applicationId ?? null,
              trigger: 'scroll',
              from_section_id: lastTrackedIdRef.current ?? null,
            });
            lastTrackedIdRef.current = next;
          }, 300);
        }
      },
      {
        // Activation band: roughly the middle third of the viewport
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
    };
  }, [items, activeId, applicationId]);

  // When the active item changes on mobile, scroll it into view in the nav bar
  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-nav-item="${activeId}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeId]);

  const handleClick = useCallback(
    (item: InPageNavItem) => {
      trackEvent(EVENTS.CLICK_INPAGE_NAV, {
        section_id: item.id,
        section_label: item.label,
        application_id: applicationId ?? null,
        trigger: 'click',
        from_section_id: lastTrackedIdRef.current ?? null,
      });
      lastTrackedIdRef.current = item.id;
      const target = document.getElementById(item.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [applicationId]
  );

  return (
    <nav
      aria-label="Navegación interna de la página"
      aria-hidden={!isVisible}
      className={cn(
        'sticky top-16 sm:top-18 z-20 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border',
        'transition-all duration-200 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'
      )}
    >
      {/* Wrapper: relative to host the mobile scroll hint pseudo-element */}
      <div
        className={cn(
          'relative',
          // Mobile-only right-edge fade hint ("hay más →")
          'after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10',
          'after:bg-gradient-to-l after:from-brand-bg after:to-transparent md:after:hidden'
        )}
      >
        <ul
          ref={listRef}
          role="tablist"
          className={cn(
            'flex flex-row items-center gap-1 h-12',
            'overflow-x-auto overflow-y-hidden scroll-smooth',
            'snap-x snap-mandatory md:snap-none',
            'px-4 sm:px-6 md:justify-center md:gap-2 md:max-w-5xl md:mx-auto',
            // Hide native scrollbar across browsers
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="snap-start flex-shrink-0 h-full flex items-stretch">
                <button
                  type="button"
                  role="tab"
                  aria-current={isActive ? 'true' : undefined}
                  aria-selected={isActive}
                  data-nav-item={item.id}
                  onClick={() => handleClick(item)}
                  className={cn(
                    'inline-flex items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold transition-colors duration-150',
                    // Active state: underline + tinted bg (brand-designer spec)
                    'border-b-2',
                    'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg',
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent text-brand-muted hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {Icon && (
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.25 : 1.75}
                      aria-hidden="true"
                      className="flex-shrink-0"
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

