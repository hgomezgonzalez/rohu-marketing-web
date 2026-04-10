import { applications } from '@/lib/applications';

/**
 * Context-aware WhatsApp pre-filled message.
 *
 * The exact wording of every message in this file was reviewed and APPROVED
 * by the rohu-legal-compliance-co agent. Each message:
 *  - Does not promise a response time (no "respondemos en X horas").
 *  - Does not assert any feature, price or coverage.
 *  - Ends with an open question to invite reply, never with a closing assertion.
 *  - Is short enough to be readable inside the WhatsApp preview.
 *
 * Adding a new live application to the registry automatically gives it a
 * generic per-app message via the fallback in buildContextualWhatsAppMessage.
 * For per-app custom wording, add a case to APP_MESSAGES below.
 */

/** Used on the corporate home and any non-product route. */
const CORPORATE_MESSAGE =
  'Hola, vi ROHU Solutions y quiero saber cómo puede ayudar a mi empresa. ¿Me cuentan más?';

/** Per-app custom messages, keyed by application slug. */
const APP_MESSAGES: Record<string, string> = {
  'rohu-contable':
    'Hola, estoy viendo ROHU Contable. ¿Cómo funciona para mi negocio y cuáles son los planes?',
  'rohu-connect':
    'Hola, me interesa ROHU Connect para mi entidad. ¿Tienen cobertura en mi territorio y cómo arrancamos?',
};

export function buildContextualWhatsAppMessage(pathname: string | null | undefined): string {
  if (!pathname) return CORPORATE_MESSAGE;

  // Match /productos/<slug> (ignores trailing slash, query or hash)
  const productosMatch = pathname.match(/^\/productos\/([^/?#]+)/);
  if (productosMatch) {
    const slug = productosMatch[1];
    if (slug && APP_MESSAGES[slug]) return APP_MESSAGES[slug];

    // Fallback for live apps without a custom message
    const app = applications.find((a) => a.slug === slug);
    if (app) {
      return `Hola, vi ${app.name} y me gustaría conocer más. ¿Por dónde podemos empezar?`;
    }
  }

  return CORPORATE_MESSAGE;
}
