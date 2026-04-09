'use client';

import { forwardRef } from 'react';
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

/**
 * Shared form primitives used by both LeadForm (full lead form) and
 * QuickQuoteModal (quick-quote form).
 *
 * IMPORTANT: each of these components MUST use React.forwardRef.
 * `register()` from react-hook-form returns a `ref` callback that must land
 * on the actual DOM element — React does not propagate `ref` as a normal prop
 * in function components. Without forwardRef, the ref never reaches the input
 * and react-hook-form never captures values, causing every field to fire
 * required_error on submit even with valid input.
 */

export type FieldBaseProps = {
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
};

// --- Input Field -------------------------------------------------------------

export type InputFieldProps = FieldBaseProps & InputHTMLAttributes<HTMLInputElement>;

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(function Field(
  { label, error, helper, required, className, ...rest },
  ref
) {
  const id = rest.id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-brand-text">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={cn(
          'rounded-brand-md border border-brand-border bg-white px-4 py-3 text-brand-text',
          'placeholder:text-brand-muted/70',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
          error && 'border-danger focus:border-danger focus:ring-danger/30',
          className
        )}
        {...rest}
      />
      {helper && !error && (
        <p id={`${id}-helper`} className="text-xs text-brand-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

// --- Select Field ------------------------------------------------------------

export type SelectFieldProps = FieldBaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: readonly string[] | ReadonlyArray<{ value: string; label: string }>;
  };

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, error, helper, required, options, className, ...rest },
    ref
  ) {
    const id = rest.id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-brand-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          className={cn(
            'rounded-brand-md border border-brand-border bg-white px-4 py-3 text-brand-text',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
            error && 'border-danger focus:border-danger focus:ring-danger/30',
            className
          )}
          {...rest}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        {helper && !error && (
          <p id={`${id}-helper`} className="text-xs text-brand-muted">
            {helper}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

// --- Textarea Field ----------------------------------------------------------

export type TextareaFieldProps = FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, error, helper, className, ...rest }, ref) {
    const id = rest.id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold text-brand-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={!!error}
          className={cn(
            'rounded-brand-md border border-brand-border bg-white px-4 py-3 text-brand-text',
            'placeholder:text-brand-muted/70 resize-y min-h-[100px]',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/40',
            error && 'border-danger focus:border-danger focus:ring-danger/30',
            className
          )}
          {...rest}
        />
        {helper && !error && <p className="text-xs text-brand-muted">{helper}</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
