'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import {
  businessTypeOptions,
  leadFormSchema,
  numUsersOptions,
  type LeadFormValues,
} from './leadFormSchema';
import { Field, SelectField, TextareaField } from './FormPrimitives';
import { commonContent } from '@/lib/content';
import { buildApplicationOptions, GENERAL_ADVISORY_OPTION } from '@/lib/applications';
import { trackEvent, EVENTS } from '@/lib/analytics';
import { buildWhatsAppUrl, getWhatsAppConfig } from '@/lib/contactChannels';
import { consumeQuickQuoteHandoff } from '@/lib/quickQuoteHandoff';
import { cn } from '@/lib/cn';

type SubmitState = 'idle' | 'loading' | 'error';

type Props = {
  /** Slug of the application to pre-select in the "Aplicación de interés" field */
  preselectedApp?: string;
};

export function LeadForm({ preselectedApp }: Props = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const { phone, defaultMessage } = getWhatsAppConfig();
  const waHref = phone ? buildWhatsAppUrl(phone, defaultMessage) : null;
  const applicationOptions = buildApplicationOptions();
  const defaultApplication = preselectedApp ?? GENERAL_ADVISORY_OPTION;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: 'onBlur',
    defaultValues: {
      application: defaultApplication,
      firstName: '',
      companyName: '',
      nit: '',
      city: '',
      email: '',
      whatsapp: '',
      businessType: undefined,
      numUsers: undefined,
      message: '',
      planInterest: '',
      habeasData: false as unknown as true,
      website: '',
    },
  });

  // Pre-select plan from URL query string (e.g. ?plan=pro#contact).
  // This is set by the QuickQuoteModal "open full form" fallback via
  // router.push, and works as a real Next.js search param.
  useEffect(() => {
    const plan = searchParams?.get('plan');
    if (plan) {
      setValue('planInterest', plan);
    }
  }, [searchParams, setValue]);

  // Consume the handoff from the QuickQuoteModal (if present) so the visitor
  // doesn't have to retype Nombre / WhatsApp / Email when they click
  // "¿Quieres darnos más contexto antes de la propuesta?". The handoff is
  // one-shot: reading it also removes it from sessionStorage.
  useEffect(() => {
    const handoff = consumeQuickQuoteHandoff();
    if (!handoff) return;
    if (handoff.firstName) setValue('firstName', handoff.firstName);
    if (handoff.whatsapp) setValue('whatsapp', handoff.whatsapp);
    if (handoff.email) setValue('email', handoff.email);
    if (handoff.planInterest) setValue('planInterest', handoff.planInterest);
  }, [setValue]);

  const onSubmit: SubmitHandler<LeadFormValues> = async (data) => {
    setSubmitState('loading');
    // Analytics agent spec: include form_type + has_email on every submit*
    // event for consistent segmentation between quick_quote and full_lead.
    const commonProps = {
      form_type: 'full_lead' as const,
      application_id: data.application,
      plan_interest: data.planInterest ?? null,
      has_email: Boolean(data.email && data.email.length > 0),
    };
    trackEvent(EVENTS.SUBMIT_LEAD, commonProps);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      trackEvent(EVENTS.SUBMIT_LEAD_SUCCESS, commonProps);
      router.push('/gracias');
    } catch (err) {
      trackEvent(EVENTS.SUBMIT_LEAD_ERROR, {
        ...commonProps,
        error_type: 'network',
        error_message: err instanceof Error ? err.message : 'unknown',
      });
      setSubmitState('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {submitState === 'error' && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-brand-md border border-danger/40 bg-danger/5 p-4 flex flex-col gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} strokeWidth={2} className="text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-danger">
                {commonContent.leadForm.error_banner.title}
              </p>
              <p className="text-sm text-danger/80 mt-1">{commonContent.leadForm.error_banner.body}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-secondary px-4 py-2 text-sm"
              onClick={() => setSubmitState('idle')}
            >
              {commonContent.leadForm.error_banner.retry_label}
            </button>
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-4 py-2 text-sm"
              >
                <MessageCircle size={16} strokeWidth={2} />
                {commonContent.leadForm.error_banner.whatsapp_label}
              </a>
            )}
          </div>
        </div>
      )}

      <SelectField
        label={commonContent.leadForm.application_label}
        helper={commonContent.leadForm.application_helper}
        error={errors.application?.message}
        required
        options={applicationOptions}
        {...register('application')}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nombre completo"
          placeholder="Juan Pérez"
          error={errors.firstName?.message}
          required
          {...register('firstName')}
        />
        <Field
          label="Nombre del negocio"
          placeholder="Distribuidora XYZ S.A.S."
          error={errors.companyName?.message}
          required
          {...register('companyName')}
        />
        <Field
          label="NIT de la empresa"
          placeholder="900.123.456-7"
          helper="Opcional. Si no lo tienes a mano, continúa sin problema."
          error={errors.nit?.message}
          {...register('nit')}
        />
        <Field
          label="Ciudad"
          placeholder="Bogotá"
          error={errors.city?.message}
          required
          {...register('city')}
        />
        <Field
          label="Correo electrónico"
          type="email"
          placeholder="juan@empresa.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <Field
          label="Número de WhatsApp"
          type="tel"
          placeholder="3001234567"
          helper="Solo dígitos. Ejemplo: 3001234567"
          inputMode="tel"
          error={errors.whatsapp?.message}
          required
          {...register('whatsapp')}
        />
        <SelectField
          label="Tipo de negocio"
          error={errors.businessType?.message}
          required
          options={businessTypeOptions}
          {...register('businessType')}
        />
        <SelectField
          label="Número de usuarios"
          error={errors.numUsers?.message}
          required
          options={numUsersOptions}
          {...register('numUsers')}
        />
      </div>

      <TextareaField
        label="Cuéntanos más sobre tu empresa"
        placeholder="Describe brevemente tu operación o cualquier duda que tengas."
        helper="Opcional. Cuanto más nos cuentes, mejor preparamos la propuesta."
        error={errors.message?.message}
        {...register('message')}
      />

      {/* Honeypot — invisible to humans */}
      <input
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register('website')}
      />

      <label className="flex items-start gap-3 text-sm text-brand-text">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-brand-border text-primary focus:ring-accent"
          {...register('habeasData')}
        />
        <span>
          {commonContent.legal.habeas_data_checkbox.split('Política de Privacidad')[0]}
          <Link href="/privacidad" className="text-primary underline underline-offset-2">
            Política de Privacidad
          </Link>
          {commonContent.legal.habeas_data_checkbox.split('Política de Privacidad')[1]}
        </span>
      </label>
      {errors.habeasData && (
        <p className="text-xs text-danger -mt-2">{errors.habeasData.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || submitState === 'loading'}
        className={cn('btn-cta px-6 py-4 text-base sm:text-lg mt-2 w-full sm:w-auto sm:self-start')}
      >
        {isSubmitting || submitState === 'loading' ? (
          <>
            <Loader2 size={18} strokeWidth={2} className="animate-spin" />
            {commonContent.leadForm.submit_loading}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} strokeWidth={2} />
            {commonContent.leadForm.submit_label}
          </>
        )}
      </button>
    </form>
  );
}
