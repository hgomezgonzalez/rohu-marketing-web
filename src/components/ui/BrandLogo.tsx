import Image from 'next/image';
import { cn } from '@/lib/cn';

type Props = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  size = 40,
  showWordmark = true,
  className,
  priority = false,
}: Props) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/rohu_logo.png"
        alt="Logo ROHU Contable"
        width={size}
        height={size}
        priority={priority}
        className="rounded-brand-md"
      />
      {showWordmark && (
        <span className="font-display font-extrabold text-lg sm:text-xl text-brand-text tracking-tight">
          ROHU <span className="text-primary">Contable</span>
        </span>
      )}
    </span>
  );
}
