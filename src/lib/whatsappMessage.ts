import { applications } from '@/lib/applications';

/**
 * Context-aware WhatsApp pre-filled message.
 *
 * Different site pages pre-fill the WhatsApp button with different messages
 * so that when the owner receives the incoming chat, they already know which
 * page (and which application, if any) triggered the conversation.
 *
 * The message is rebuilt on every click based on the current pathname, so
 * switching between /productos/rohu-contable and /productos/rohu-connect
 * updates the message automatically without any prop drilling.
 *
 * Legal-safe: none of these messages promises response time, price or
 * guaranteed outcomes. Each ends with an open question to invite reply.
 */

/** Fallback used on the corporate home and on any non-product route. */
const CORPORATE_MESSAGE =
  'Hola, me interesa ROHU Solutions y quisiera más información, ¿en qué pueden ayudarme?';

export function buildContextualWhatsAppMessage(pathname: string | null | undefined): string {
  if (!pathname) return CORPORATE_MESSAGE;

  // Match /productos/<slug> (ignores trailing slash, query or hash)
  const productosMatch = pathname.match(/^\/productos\/([^/?#]+)/);
  if (productosMatch) {
    const slug = productosMatch[1];
    const app = applications.find((a) => a.slug === slug);
    if (app) {
      return `Hola, me interesa ${app.name} y quisiera más información, ¿en qué pueden ayudarme?`;
    }
  }

  return CORPORATE_MESSAGE;
}
