'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDownCircle,
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
  const listRef = useRef<HTMLUListElement | null>(null);

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
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Activation band: roughly the middle third of the viewport
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

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
      });
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
      className="sticky top-16 sm:top-18 z-20 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border"
    >
      {/* Mobile scroll hint: subtle right-edge fade */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-brand-bg/90 to-transparent md:hidden"
        />
        <ul
          ref={listRef}
          role="tablist"
          className="flex flex-row items-center gap-1 overflow-x-auto overflow-y-hidden scroll-smooth px-4 sm:px-6 h-14 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:justify-center md:gap-2 snap-x snap-mandatory md:snap-none"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="snap-start flex-shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-current={isActive ? 'true' : undefined}
                  aria-selected={isActive}
                  data-nav-item={item.id}
                  onClick={() => handleClick(item)}
                  className={cn(
                    'group inline-flex items-center gap-2 whitespace-nowrap rounded-brand-md px-3 py-2 text-sm font-semibold transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-brand-muted hover:bg-primary/5 hover:text-primary'
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
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Exported for the "scroll to first section" button fallback, unused by default. */
export { ArrowDownCircle };
