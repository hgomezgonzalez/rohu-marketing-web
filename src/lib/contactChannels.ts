/**
 * Pure builders for direct-contact channel URLs (WhatsApp, Telegram).
 * These are used both on the landing and inside the Telegram bot inline buttons.
 */

/**
 * @param phone E.164 number WITHOUT the leading "+" (e.g. "57300XXXXXXX").
 * @param message Pre-filled message. Will be URL-encoded.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * @param username Telegram username without the "@".
 */
export function buildTelegramUrl(username: string): string {
  const clean = username.replace(/^@/, '').trim();
  return `https://t.me/${clean}`;
}

export function getWhatsAppConfig() {
  return {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '',
    defaultMessage:
      process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ??
      'Hola, me interesa ROHU Contable y quiero más información.',
  };
}

export function getTelegramUsername(): string | null {
  const value = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME;
  return value && value.trim().length > 0 ? value.trim() : null;
}
