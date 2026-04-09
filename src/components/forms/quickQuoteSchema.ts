import { z } from 'zod';

/**
 * Minimal schema for the quick-quote modal. Only the essentials needed to
 * call the visitor back: name, WhatsApp, optional email, plus the application
 * and plan they're interested in (injected by the modal from the clicked
 * pricing tier).
 *
 * The full lead form schema lives in `./leadFormSchema.ts` and is used by
 * the long-form contact section. Both schemas converge into the same `Lead`
 * type and the same notification pipeline.
 */

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/;
const phoneRegex = /^[0-9\s+()-]{7,20}$/;

export const quickQuoteSchema = z.object({
  firstName: z
    .string({ required_error: 'Ingresa tu nombre' })
    .min(2, 'Ingresa tu nombre')
    .max(80, 'Máximo 80 caracteres')
    .regex(nameRegex, 'El nombre no puede contener números ni símbolos'),
  whatsapp: z
    .string({ required_error: 'Déjanos tu WhatsApp para coordinar' })
    .regex(phoneRegex, 'Debe tener al menos 7 dígitos (p. ej. 3001234567)'),
  email: z
    .string()
    .email('Este correo no parece válido')
    .optional()
    .or(z.literal('')),
  application: z
    .string({ required_error: 'Falta la aplicación de interés' })
    .min(1, 'Falta la aplicación de interés'),
  planInterest: z
    .string({ required_error: 'Falta el plan seleccionado' })
    .min(1, 'Falta el plan seleccionado'),
  habeasData: z.literal(true, {
    errorMap: () => ({
      message: 'Debes aceptar el tratamiento de datos para continuar',
    }),
  }),
  // Honeypot — must remain empty
  website: z.string().max(0).optional(),
});

export type QuickQuoteValues = z.infer<typeof quickQuoteSchema>;
