import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
};

export function Container({ children, className, as: Tag = 'div' }: Props) {
  return <Tag className={cn('container-brand', className)}>{children}</Tag>;
}
