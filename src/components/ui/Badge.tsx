import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'primary' | 'success' | 'accent' | 'warning' | 'muted';

const tones: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success',
  accent: 'bg-accent/15 text-accent-dark',
  warning: 'bg-warning/15 text-warning',
  muted: 'bg-brand-border/60 text-brand-muted',
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Badge({ children, tone = 'primary', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
