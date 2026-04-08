import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'cta' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  cta: 'btn-cta',
  ghost: 'btn-ghost',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-4 text-base sm:text-lg',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps & { as?: 'button' };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & CommonProps & { as: 'a' };

export type ButtonOrAnchorProps = ButtonProps | AnchorProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonOrAnchorProps>(
  function Button(props, ref) {
    const { variant = 'primary', size = 'md', fullWidth, className, children, ...rest } = props;
    const classes = cn(variants[variant], sizes[size], fullWidth && 'w-full', className);

    if (props.as === 'a') {
      const { as: _as, ...anchorProps } = rest as AnchorProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    const { as: _as, ...buttonProps } = rest as ButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);
