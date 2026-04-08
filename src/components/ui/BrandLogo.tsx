import Image from 'next/image';
import { cn } from '@/lib/cn';

type Variant = 'company' | string;

type Props = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
  /**
   * The wordmark to display next to the isotype:
   * - 'company' (default) → "ROHU Solutions"
   * - any other string → "ROHU <string>" (e.g. pass "Contable" to show "ROHU Contable")
   */
  variant?: Variant;
};

export function BrandLogo({
  size = 40,
  showWordmark = true,
  className,
  priority = false,
  variant = 'company',
}: Props) {
  const secondWord = variant === 'company' ? 'Solutions' : variant;

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/rohu_logo.png"
        alt="Logo ROHU Solutions"
        width={size}
        height={size}
        priority={priority}
        className="rounded-brand-md"
      />
      {showWordmark && (
        <span className="font-display font-extrabold text-lg sm:text-xl text-brand-text tracking-tight">
          ROHU <span className="text-primary">{secondWord}</span>
        </span>
      )}
    </span>
  );
}
