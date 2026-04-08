import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  as?: 'div' | 'article' | 'li';
};

export function Card({ children, className, hoverable = true, as: Tag = 'div' }: Props) {
  return (
    <Tag className={cn(hoverable ? 'card-hoverable' : 'card', 'p-6 sm:p-7', className)}>
      {children}
    </Tag>
  );
}
