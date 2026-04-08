/**
 * Shared lead types. Keep in sync with the zod schema in
 * `src/components/forms/leadFormSchema.ts`.
 */
export type Lead = {
  id: string;
  createdAt: string;
  firstName: string;
  companyName: string;
  nit?: string;
  city: string;
  email: string;
  whatsapp: string;
  businessType?: string;
  numUsers?: string;
  message?: string;
  planInterest?: string;
  /** Application of interest (slug from the registry) or 'general' */
  application: string;
  habeasData: true;
  source: 'rohu-marketing-web';
};
