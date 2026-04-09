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
import { saveQuickQuoteHandoff } from '@/lib/quickQuoteHandoff';
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
 * Quick-lead dialog (labeled "Propuesta personalizada" per legal-compliance
 * agent — the original "Cotización" wording was rejected for creating
 * implicit price commitments under Art. 23 Ley 1480/2011).
 *
 * Implements:
 * - React portal to escape any parent stacking context.
 * - Body scroll lock with scrollbar-width compensation (avoids layout shift).
 * - Escape key, backdrop click and X button to close.
 * - Focus trap (Tab / Shift+Tab cycle inside the dialog).
 * - Auto-focus on the first input when opened.
 * - Return focus to the previously focused element on close.
 * - Single-modal state machine: idle → loading → success | error.
 * - Personal fields (firstName/whatsapp/email) persist across reopen so
 *   switching from Basic to Pro doesn't wipe what the visitor already typed
 *   (funnel-designer recommendation). Only planInterest resets per-open.
 * - On "open full form" fallback, hands off the typed values via
 *   sessionStorage so the long lead form pre-fills them (no data loss).
 *
 * Hand-rolled (no @radix-ui/react-dialog) to keep the bundle minimal.
 */
export function QuickQuoteModal({ open, onClose, tier, applicationId }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [mounted, setMounted] = useState(false);
  const [successFirstName, setSuccessFirstName] = useState('');
  const { phone } = getWhatsAppConfig();

  // Mount portal on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

  // When the modal opens, update planInterest to match the clicked tier but
  // KEEP the personal fields intact so the visitor doesn't lose what they
  // already typed in a previous attempt. Reset only when we land on success.
  useEffect(() => {
    if (open && tier) {
      setValue('planInterest', tier.id);
      setValue('application', applicationId);
      // Clear error state on reopen; keep idle unless we were in success (which
      // should only happen after a full close cycle, handled elsewhere).
      if (submitState === 'error') setSubmitState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tier, applicationId]);

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

  const handleClose = useCallback(
    (reason: 'escape' | 'backdrop' | 'close_button' | 'success' | 'open_full_form') => {
      if (tier) {
        trackEvent(EVENTS.CLOSE_QUICK_QUOTE_MODAL, {
          reason,
          application_id: applicationId,
          plan_id: tier.id,
          plan_name: tier.name,
          submit_state: submitState,
        });
      }
      // If we're closing after success, reset the form so the next open starts fresh
      if (reason === 'success') {
        reset({
          firstName: '',
          whatsapp: '',
          email: '',
          application: applicationId,
          planInterest: '',
          habeasData: false as unknown as true,
          website: '',
        });
        setSubmitState('idle');
      }
      onClose(reason);
    },
    [applicationId, tier, submitState, onClose, reset]
  );

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
  }, [open, handleClose]);

  const handleOpenFullForm = useCallback(() => {
    if (!tier) return;
    // Persist whatever the visitor already typed so the long form can hydrate
    // (funnel-designer: "El esfuerzo del usuario es sagrado").
    const current = getValues();
    saveQuickQuoteHandoff({
      firstName: current.firstName,
      whatsapp: current.whatsapp,
      email: current.email,
      planInterest: tier.id,
    });
    handleClose('open_full_form');
    // Real query + hash — this is the canonical way to navigate to the
    // contact section with a preselected plan (the LeadForm reads searchParams).
    router.push(`?plan=${tier.id}#contact`);
  }, [router, tier, getValues, handleClose]);

  const onSubmit: SubmitHandler<QuickQuoteValues> = async (data) => {
    if (!tier) return;
    setSubmitState('loading');
    trackEvent(EVENTS.SUBMIT_QUICK_QUOTE, {
      application_id: applicationId,
      plan_id: tier.id,
      plan_name: tier.name,
      has_email: Boolean(data.email && data.email.length > 0),
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
        has_email: Boolean(data.email && data.email.length > 0),
      });
      setSuccessFirstName(data.firstName);
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

  const waMessage = `Hola, me interesa conocer más del plan ${tier.name} de ROHU Contable.`;
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
        aria-label="Cerrar"
        onClick={() => handleClose('backdrop')}
        className="absolute inset-0 bg-brand-text/60 backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none"
        tabIndex={-1}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full sm:max-w-md bg-white shadow-signature overflow-hidden',
          'rounded-t-brand-xl sm:rounded-brand-xl',
          'max-h-[92vh] flex flex-col',
          'transition-all duration-200 ease-out motion-reduce:transition-none',
          'animate-fade-in-up'
        )}
      >
        {/* Header with plan name — uses gradient-hero (brand-designer spec) */}
        <div className="relative bg-gradient-hero text-white p-5 sm:p-6 flex-shrink-0">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => handleClose('close_button')}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <p className="text-[11px] uppercase tracking-wider font-semibold opacity-85">
            Propuesta personalizada
          </p>
          <h2 id="quick-quote-title" className="mt-1 text-xl sm:text-2xl font-extrabold pr-10">
            Plan {tier.name}
          </h2>
          <p className="mt-1 text-sm text-white/90">
            Cuéntanos cómo contactarte y nuestro equipo te responde pronto.
          </p>
        </div>

        {/* Body — switches between idle/loading/success/error */}
        <div className="flex-1 overflow-y-auto">
          {submitState === 'success' ? (
            <SuccessState
              firstName={successFirstName}
              onClose={() => handleClose('success')}
            />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="p-5 sm:p-6 flex flex-col gap-4"
            >
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
                    <p className="text-sm font-semibold text-danger">Algo salió mal</p>
                    <p className="text-xs text-danger/80 mt-0.5">
                      No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos
                      directamente por WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              <Field
                label="Nombre completo"
                placeholder="¿Cómo te llamamos?"
                autoComplete="given-name"
                error={errors.firstName?.message}
                required
                {...register('firstName')}
              />

              <Field
                label="WhatsApp"
                type="tel"
                inputMode="tel"
                placeholder="Ej. 300 123 4567"
                helper="Número colombiano a 10 dígitos."
                autoComplete="tel"
                error={errors.whatsapp?.message}
                required
                {...register('whatsapp')}
              />

              <Field
                label="Correo electrónico (opcional)"
                type="email"
                placeholder="tucorreo@empresa.com"
                helper="Si prefieres recibir información también por correo."
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
                  Acepto la{' '}
                  <Link
                    href="/privacidad"
                    target="_blank"
                    className="text-primary underline underline-offset-2"
                  >
                    Política de Privacidad
                  </Link>{' '}
                  de ROHU Solutions y autorizo el tratamiento de mis datos conforme a la Ley
                  1581 de 2012.
                </span>
              </label>
              {errors.habeasData && (
                <p className="text-xs text-danger -mt-2">{errors.habeasData.message}</p>
              )}

              {/*
               * Primary submit button: solid bg-primary, NOT btn-cta
               * (brand-designer: "No usar gradient-cta en el botón submit —
               * duplica semántica del CTA principal del sitio").
               */}
              <button
                type="submit"
                disabled={isSubmitting || submitState === 'loading'}
                className={cn(
                  'inline-flex items-center justify-center gap-2 w-full py-3 rounded-brand-md',
                  'bg-primary text-white font-semibold text-base shadow-signature',
                  'transition-all duration-150',
                  'hover:bg-primary-dark hover:shadow-elevated',
                  'active:scale-[0.99]',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none'
                )}
              >
                {isSubmitting || submitState === 'loading' ? (
                  <>
                    <Loader2 size={18} strokeWidth={2} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2} />
                    Enviar solicitud
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-brand-muted">
                Sin compromiso. Solo te contactamos si tú lo autorizas.
              </p>
            </form>
          )}
        </div>

        {/*
         * Footer with secondary CTAs (only in idle/error/loading states).
         * Funnel-designer spec: a visual separator with the microcopy
         * "¿Prefieres otro canal?" reframes these as alternatives, not
         * competitors with the primary submit.
         */}
        {submitState !== 'success' && (
          <div className="flex-shrink-0 border-t border-brand-border bg-brand-bg/40">
            <div className="relative px-6 pt-4 pb-1">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-brand-border" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-muted">
                  ¿Prefieres otro canal?
                </span>
                <span className="h-px flex-1 bg-brand-border" aria-hidden="true" />
              </div>
            </div>

            <div className="px-5 sm:px-6 pb-5 pt-3 flex flex-col gap-3 items-center">
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-secondary-dark hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-sm"
                >
                  <MessageCircle size={16} strokeWidth={2} />
                  Chatear por WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={handleOpenFullForm}
                className="text-xs text-brand-muted hover:text-primary underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                ¿Quieres darnos más contexto antes de la propuesta?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

function SuccessState({
  firstName,
  onClose,
}: {
  firstName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 py-10">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={36} strokeWidth={2} />
      </span>
      <h3 className="mt-4 text-xl font-extrabold text-brand-text">
        {firstName ? `¡Listo, ${firstName}!` : '¡Solicitud recibida!'}
      </h3>
      {/*
       * Legal-compliance agent exact wording: "habitualmente" converts the
       * time promise into an expected value instead of a contractual guarantee
       * (Art. 845 Cód. Comercio + Art. 30 Ley 1480/2011).
       */}
      <p className="mt-2 text-sm text-brand-muted leading-relaxed max-w-sm">
        Recibido. Nuestro equipo revisará tu solicitud y te contactará por WhatsApp,
        habitualmente en menos de 24 horas hábiles.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-brand-md bg-primary text-white font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Cerrar
      </button>
    </div>
  );
}
