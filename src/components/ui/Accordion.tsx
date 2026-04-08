'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackEvent, EVENTS } from '@/lib/analytics';

type Item = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: Item[];
};

export function Accordion({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string, question: string) {
    const willOpen = openId !== id;
    setOpenId(willOpen ? id : null);
    if (willOpen) {
      trackEvent(EVENTS.CLICK_FAQ, { question_id: id, question_text: question });
    }
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;
        return (
          <li
            key={item.id}
            className={cn(
              'rounded-brand-lg border border-brand-border bg-white overflow-hidden',
              'transition-all duration-200',
              isOpen && 'shadow-elevated border-primary/30'
            )}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id, item.question)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="font-semibold text-brand-text">{item.question}</span>
              <ChevronDown
                size={20}
                strokeWidth={2}
                className={cn(
                  'flex-shrink-0 text-primary transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-all duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pt-0 text-brand-muted leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
