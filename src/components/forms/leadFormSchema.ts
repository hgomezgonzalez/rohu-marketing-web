import { z } from 'zod';

/**
 * Shared zod schema used by both the client form and the API route handler.
 * Keep in sync with `src/types/lead.ts`.
 *
 * Error messages produced by the funnel-designer and legal-compliance agents.
 */

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/;
const nitRegex = /^[0-9.\-]{6,20}$/;
const phoneRegex = /^[0-9\s+()-]{7,20}$/;

export const businessTypeOptions = [
  'Ferretería',
  'Tienda de barrio',
  'Papelería',
  'Tienda de ropa',
  'Minimercado',
  'Distribuidora',
  'Otro',
] as const;

export const numUsersOptions = [
  '1 (solo yo)',
  '2 a 5',
  '6 a 15',
  '16 a 50',
  'Más de 50',
] as const;

export const leadFormSchema = z.object({
  firstName: z
    .string({ required_error: 'Ingresa tu nombre completo' })
    .min(2, 'Ingresa tu nombre completo')
    .max(80, 'Máximo 80 caracteres')
    .regex(nameRegex, 'El nombre no puede contener números ni símbolos'),
  companyName: z
    .string({ required_error: 'Escribe el nombre de tu empresa' })
    .min(2, 'Escribe el nombre de tu empresa')
    .max(120, 'Máximo 120 caracteres'),
  nit: z
    .string()
    .optional()
    .refine((val) => !val || nitRegex.test(val), {
      message: 'El NIT debe tener formato válido (p. ej. 900.123.456-7)',
    }),
  city: z
    .string({ required_error: 'Indica tu ciudad' })
    .min(2, 'Indica tu ciudad')
    .max(80, 'Máximo 80 caracteres'),
  email: z
    .string({ required_error: 'Necesitamos tu correo para contactarte' })
    .email('Este correo no parece válido. Revísalo e inténtalo de nuevo'),
  whatsapp: z
    .string({ required_error: 'Déjanos tu WhatsApp para coordinar rápidamente' })
    .regex(phoneRegex, 'Debe tener al menos 7 dígitos (p. ej. 3001234567)'),
  businessType: z.enum(businessTypeOptions, {
    required_error: 'Selecciona el tipo que mejor describe tu negocio',
  }),
  numUsers: z.enum(numUsersOptions, {
    required_error: 'Selecciona el número aproximado de usuarios',
  }),
  message: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  planInterest: z.string().max(40).optional(),
  habeasData: z.literal(true, {
    errorMap: () => ({
      message: 'Debes aceptar el tratamiento de datos para continuar',
    }),
  }),
  // Honeypot — must remain empty
  website: z.string().max(0).optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
