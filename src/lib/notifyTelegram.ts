import type { Lead } from '@/types/lead';
import { buildWhatsAppUrl } from './contactChannels';
import { escapeHtml } from './htmlEscape';

/**
 * Server-only helper that pushes a formatted lead notification to the owner
 * via the Telegram Bot API. If either TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is
 * missing, the call is silently skipped so the lead pipeline still works.
 *
 * This is the "always online" channel: as soon as a lead is captured, the bot
 * sends a private message to the owner's phone with inline buttons to reply
 * immediately by WhatsApp or email.
 */
export async function notifyTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.warn('[notifyTelegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — skipped');
    return;
  }

  const text = buildMessageText(lead);
  const replyMarkup = buildInlineKeyboard(lead);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: replyMarkup,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      // eslint-disable-next-line no-console
      console.error('[notifyTelegram] non-ok response', res.status, body);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[notifyTelegram] fetch failed', err);
  }
}

function buildMessageText(lead: Lead): string {
  const isQuick = lead.formType === 'quick_quote';
  const header = isQuick
    ? '💨 <b>Cotización rápida · ROHU Solutions</b>'
    : '🟢 <b>Nuevo lead · ROHU Solutions</b>';

  const lines: string[] = [header, ''];
  lines.push(`🧩 Aplicación: <b>${escapeHtml(lead.application)}</b>`);
  if (lead.planInterest) {
    lines.push(`💎 Plan: <b>${escapeHtml(lead.planInterest)}</b>`);
  }
  lines.push('');

  lines.push(`👤 <b>${escapeHtml(lead.firstName)}</b>`);
  lines.push(`📱 ${escapeHtml(lead.whatsapp)}`);

  if (lead.email) {
    lines.push(`✉️ ${escapeHtml(lead.email)}`);
  }
  if (lead.companyName) {
    const nit = lead.nit ? ` · NIT ${escapeHtml(lead.nit)}` : '';
    lines.push(`🏢 ${escapeHtml(lead.companyName)}${nit}`);
  }
  if (lead.city) {
    lines.push(`📍 ${escapeHtml(lead.city)}`);
  }
  if (lead.businessType || lead.numUsers) {
    const businessType = lead.businessType ? escapeHtml(lead.businessType) : '—';
    const numUsers = lead.numUsers ? escapeHtml(lead.numUsers) : '—';
    lines.push(`💼 ${businessType} · ${numUsers} usuarios`);
  }
  if (lead.message && lead.message.trim().length > 0) {
    lines.push('', `💬 ${escapeHtml(lead.message)}`);
  }

  lines.push('', `⏱ ${escapeHtml(lead.createdAt)}`);
  return lines.join('\n');
}

type TelegramInlineKeyboard = {
  inline_keyboard: Array<Array<{ text: string; url: string }>>;
};

function buildInlineKeyboard(lead: Lead): TelegramInlineKeyboard {
  // The Telegram Bot API only accepts http(s):// and tg:// URLs for inline
  // keyboard buttons. `mailto:` is explicitly rejected with
  // BUTTON_URL_INVALID, which drops the entire message — not just the
  // button. So we only expose the WhatsApp CTA here; the lead email is
  // already rendered inside the message body where Telegram auto-linkifies
  // it on mobile (tapping it opens the native mail client anyway).
  const row: Array<{ text: string; url: string }> = [];
  const cleanedWhatsapp = lead.whatsapp.replace(/\D/g, '');
  if (cleanedWhatsapp.length >= 10) {
    // Colombia default country code when the user omitted it
    const e164 = cleanedWhatsapp.length === 10 ? `57${cleanedWhatsapp}` : cleanedWhatsapp;
    const greeting = `Hola ${lead.firstName}, vi tu solicitud en ROHU Contable. ¿Cuándo tienes 15 minutos para coordinar una demo?`;
    row.push({
      text: '📲 Responder por WhatsApp',
      url: buildWhatsAppUrl(e164, greeting),
    });
  }
  return { inline_keyboard: row.length > 0 ? [row] : [] };
}
