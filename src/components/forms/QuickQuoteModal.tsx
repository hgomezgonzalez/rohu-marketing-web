'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  X,
} from 'lucide-react';
import { Field } from './FormPrimitives';
import {
  quickQuoteSchema,
  type QuickQuoteValues,
} from './quickQuoteSchema';
import type { PricingTier } from '@/types/pricingTier';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';
import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  onClose: (
    reason: 'escape' | 'backdrop' | 'close_button' | 'success' | 'open_full_form'
  ) => void;
  tier: PricingTier | null;
  applicationId: string;
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Quick-quote dialog. Implements:
 * - React portal to escape any parent stacking context.
 * - Body scroll lock with scrollbar-width compensation (avoids layout shift).
 * - Escape key, backdrop click and X button to close.
 * - Focus trap (Tab / Shift+Tab cycle inside the dialog).
 * - Auto-focus on the first input when opened.
 * - Return focus to the previously focused element on close.
 * - Single-modal state machine: idle → loading → success | error.
 *
 * Hand-rolled (no @radix-ui/react-dialog) to keep the bundle minimal.
 */
export function QuickQuoteModal({ open, onClose, tier, applicationId }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [mounted, setMounted] = useState(false);
  const { phone } = getWhatsAppConfig();

  // Mount portal on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickQuoteValues>({
    resolver: zodResolver(quickQuoteSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      whatsapp: '',
      email: '',
      application: applicationId,
      planInterest: tier?.id ?? '',
      habeasData: false as unknown as true,
      website: '',
    },
  });

  // Reset form whenever the modal opens with a new tier
  useEffect(() => {
    if (open && tier) {
      reset({
        firstName: '',
        whatsapp: '',
        email: '',
        application: applicationId,
        planInterest: tier.id,
        habeasData: false as unknown as true,
        website: '',
      });
      setSubmitState('idle');
    }
  }, [open, tier, applicationId, reset]);

  // Body scroll lock + scrollbar compensation
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  // Track view + focus management
  useEffect(() => {
    if (!open || !tier) return;

    // Save the element to return focus to
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Track modal open
    trackEvent(EVENTS.VIEW_QUICK_QUOTE_MODAL, {
      application_id: applicationId,
      plan_id: tier.id,
      plan_name: tier.name,
    });

    // Focus the first focusable inside the dialog after a tick (let portal mount)
    const t = setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>('input[name="firstName"]');
      firstInput?.focus();
    }, 50);

    return () => {
      clearTimeout(t);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, tier, applicationId]);

  // Escape + focus trap key handlers
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose('escape');
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute('aria-hidden'));
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = useCallback(
    (reason: Props['onClose'] extends (r: infer R) => void ? R : never) => {
      if (tier) {
        trackEvent(EVENTS.CLOSE_QUICK_QUOTE_MODAL, {
          reason,
          application_id: applicationId,
          plan_id: tier.id,
          plan_name: tier.name,
          submit_state: submitState,
        });
      }
      onClose(reason);
    },
    [applicationId, tier, submitState, onClose]
  );

  const handleOpenFullForm = useCallback(() => {
    if (!tier) return;
    handleClose('open_full_form');
    // Use the real query string + hash so the LeadForm preselects the plan
    router.push(`?plan=${tier.id}#contact`);
  }, [router, tier, handleClose]);

  const onSubmit: SubmitHandler<QuickQuoteValues> = async (data) => {
    if (!tier) return;
    setSubmitState('loading');
    trackEvent(EVENTS.SUBMIT_QUICK_QUOTE, {
      application_id: applicationId,
      plan_id: tier.id,
      plan_name: tier.name,
    });
    try {
      const res = await fetch('/api/quick-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      trackEvent(EVENTS.SUBMIT_QUICK_QUOTE_SUCCESS, {
        application_id: applicationId,
        plan_id: tier.id,
        plan_name: tier.name,
      });
      setSubmitState('success');
    } catch (err) {
      trackEvent(EVENTS.SUBMIT_QUICK_QUOTE_ERROR, {
        application_id: applicationId,
        plan_id: tier.id,
        plan_name: tier.name,
        error_type: 'network',
        error_message: err instanceof Error ? err.message : 'unknown',
      });
      setSubmitState('error');
    }
  };

  if (!mounted || !open || !tier) return null;

  const waMessage = `Hola, me interesa cotizar el plan ${tier.name} de ROHU Contable.`;
  const waHref = phone ? buildWhatsAppUrl(phone, waMessage) : null;

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-quote-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar cotización rápida"
        onClick={() => handleClose('backdrop')}
        className="absolute inset-0 bg-brand-text/60 backdrop-blur-sm animate-fade-in-up motion-reduce:animate-none"
        tabIndex={-1}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full sm:max-w-md bg-white shadow-elevated overflow-hidden',
          'rounded-t-brand-xl sm:rounded-brand-xl',
          'max-h-[92vh] flex flex-col',
          'animate-fade-in-up motion-reduce:animate-none'
        )}
      >
        {/* Header with plan badge */}
        <div className="relative bg-gradient-cta text-white p-5 sm:p-6">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => handleClose('close_button')}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <p className="text-[11px] uppercase tracking-wider font-semibold opacity-85">
            Cotización rápida
          </p>
          <h2 id="quick-quote-title" className="mt-1 text-xl sm:text-2xl font-extrabold pr-10">
            Plan {tier.name}
          </h2>
          <p className="mt-1 text-sm text-white/90">
            Te contactamos en menos de 24 horas hábiles.
          </p>
        </div>

        {/* Body — switches between idle/loading/success/error */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {submitState === 'success' ? (
            <SuccessState
              firstName={getCurrentFirstName(dialogRef)}
              onClose={() => handleClose('success')}
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              {submitState === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="rounded-brand-md border border-danger/40 bg-danger/5 p-3 flex items-start gap-2"
                >
                  <AlertCircle
                    size={18}
                    strokeWidth={2}
                    className="text-danger flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-danger">
                      No pudimos enviar tu solicitud
                    </p>
                    <p className="text-xs text-danger/80 mt-0.5">
                      Revisa tu conexión e inténtalo de nuevo, o escríbenos directamente por WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              <Field
                label="Nombre"
                placeholder="¿Cómo te llamas?"
                autoComplete="given-name"
                error={errors.firstName?.message}
                required
                {...register('firstName')}
              />

              <Field
                label="WhatsApp"
                type="tel"
                inputMode="tel"
                placeholder="3001234567"
                helper="Solo dígitos, sin indicativo de país."
                autoComplete="tel"
                error={errors.whatsapp?.message}
                required
                {...register('whatsapp')}
              />

              <Field
                label="Correo electrónico (opcional)"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Honeypot */}
              <input
                type="text"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                {...register('website')}
              />

              <label className="flex items-start gap-2 text-xs text-brand-text">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-brand-border text-primary focus:ring-accent"
                  {...register('habeasData')}
                />
                <span>
                  Acepto el tratamiento de mis datos según la{' '}
                  <Link
                    href="/privacidad"
                    target="_blank"
                    className="text-primary underline underline-offset-2"
                  >
                    Política de Privacidad
                  </Link>{' '}
                  de ROHU Solutions, conforme a la Ley 1581 de 2012.
                </span>
              </label>
              {errors.habeasData && (
                <p className="text-xs text-danger -mt-2">{errors.habeasData.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || submitState === 'loading'}
                className="btn-cta py-3 text-base mt-1 w-full"
              >
                {isSubmitting || submitState === 'loading' ? (
                  <>
                    <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2} />
                    Solicitar cotización
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-brand-muted">
                Sin compromiso. No vendemos ni compartimos tus datos con terceros.
              </p>
            </form>
          )}
        </div>

        {/* Footer with secondary CTAs (only when not in success state) */}
        {submitState !== 'success' && (
          <div className="border-t border-brand-border p-4 flex flex-col gap-2 text-center bg-brand-bg/40">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-secondary-dark hover:text-secondary"
              >
                <MessageCircle size={16} strokeWidth={2} />
                Prefiero chatear por WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={handleOpenFullForm}
              className="text-xs text-brand-muted hover:text-primary underline underline-offset-2"
            >
              ¿Quieres darnos más detalles? Ir al formulario completo
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

/**
 * Reads the current value of the firstName input directly from the DOM so the
 * success message can greet the visitor by name without re-rendering on every
 * keystroke. The form has already validated and submitted at this point.
 */
function getCurrentFirstName(ref: React.RefObject<HTMLDivElement>): string {
  const input = ref.current?.querySelector<HTMLInputElement>('input[name="firstName"]');
  return input?.value?.trim() || '';
}

function SuccessState({
  firstName,
  onClose,
}: {
  firstName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={36} strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-xl font-extrabold text-brand-text">
        {firstName ? `¡Gracias, ${firstName}!` : '¡Recibido!'}
      </h3>
      <p className="mt-2 text-sm text-brand-muted leading-relaxed max-w-sm">
        Recibimos tu solicitud. Un asesor de ROHU Solutions te escribirá por WhatsApp
        en menos de 24 horas hábiles con la cotización personalizada.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="btn-primary mt-6 px-6 py-3"
      >
        Cerrar
      </button>
    </div>
  );
}
