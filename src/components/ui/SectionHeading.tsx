import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  children,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        className
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="max-w-3xl">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-brand-muted leading-relaxed">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
