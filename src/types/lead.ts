/**
 * Shared lead type. Covers both full lead form submissions and quick-quote
 * modal submissions. The `formType` field distinguishes them downstream so
 * the owner can prioritize attention.
 */
export type Lead = {
  id: string;
  createdAt: string;
  /** Always present */
  firstName: string;
  /** Always present (WhatsApp is the main reply channel) */
  whatsapp: string;
  /** Always present (slug from the registry or 'general') */
  application: string;
  /** Always required by law (Art. 9 Ley 1581/2012) */
  habeasData: true;
  /** Fixed source identifier */
  source: 'rohu-marketing-web';
  /** Which form produced this lead */
  formType: 'full_lead' | 'quick_quote';

  // --- Full lead form fields (all optional so quick_quote can omit them) ---
  companyName?: string;
  nit?: string;
  city?: string;
  email?: string;
  businessType?: string;
  numUsers?: string;
  message?: string;
  planInterest?: string;
};
