import type { ChatSession } from './chatStore';
import { escapeHtml } from './htmlEscape';

/**
 * Server-only helper that forwards a chat message from a website visitor
 * to the operator's Telegram account, threading the conversation under an
 * "anchor" message so the whole session appears as a reply chain. The
 * operator replies from their Telegram client using the native
 * reply-to-message feature, which is captured by /api/chat/webhook.
 *
 * Separate from notifyTelegram.ts (which is for lead form notifications)
 * to keep the threading logic isolated — lead notifications are standalone
 * and chat notifications are threaded.
 *
 * If TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are missing, the call is a
 * silent no-op with a console.warn, matching the resilience pattern used
 * by notifyTelegram.ts and sendLeadEmail.ts.
 */

export interface TelegramSendResult {
  telegramMessageId: number | null;
  ok: boolean;
  errorDescription?: string;
}

const TELEGRAM_API_BASE = 'https://api.telegram.org';

interface SendMessageOptions {
  parse_mode?: 'HTML';
  reply_to_message_id?: number;
  disable_web_page_preview?: boolean;
}

async function callSendMessage(
  token: string,
  chatId: string,
  text: string,
  options: SendMessageOptions = {}
): Promise<TelegramSendResult> {
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options,
      }),
    });
    const body = (await res.json()) as
      | { ok: true; result: { message_id: number } }
      | { ok: false; description?: string };
    if (!body.ok) {
      // eslint-disable-next-line no-console
      console.error('[chatTelegram] non-ok response', res.status, body.description);
      return { ok: false, telegramMessageId: null, errorDescription: body.description };
    }
    return { ok: true, telegramMessageId: body.result.message_id };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      '[chatTelegram] fetch failed',
      err instanceof Error ? err.message : String(err)
    );
    return {
      ok: false,
      telegramMessageId: null,
      errorDescription: err instanceof Error ? err.message : 'unknown',
    };
  }
}

/**
 * Send the first message of a brand-new session. Produces the anchor
 * message that subsequent messages will reply-to. The header carries
 * the session id as plaintext so the admin can search for it, AND the
 * store also indexes the returned message_id for the O(1) lookup path.
 */
export async function sendAnchorMessage(
  session: ChatSession,
  firstText: string
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.warn(
      '[chatTelegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — anchor skipped'
    );
    return { ok: false, telegramMessageId: null, errorDescription: 'missing_env' };
  }

  const lines = [
    '💬 <b>Chat en vivo · ROHU Solutions</b>',
    '',
    `🆔 <code>${escapeHtml(session.id)}</code>`,
    `📄 Página: <code>${escapeHtml(session.context.pathname)}</code>`,
    `🌐 IP: <code>${escapeHtml(session.context.maskedIp)}</code>`,
    session.context.userAgentFamily
      ? `🖥 ${escapeHtml(session.context.userAgentFamily)}`
      : '',
    '',
    `💭 ${escapeHtml(firstText)}`,
    '',
    '<i>Responde con la acción «Reply» sobre este mensaje para enviar tu respuesta al visitante.</i>',
  ].filter(Boolean);

  return callSendMessage(token, chatId, lines.join('\n'));
}

/**
 * Send a subsequent visitor message, threaded as a reply to the session's
 * anchor message so the admin sees the whole session as one collapsed
 * thread in Telegram.
 */
export async function sendThreadedMessage(
  session: ChatSession,
  text: string
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // eslint-disable-next-line no-console
    console.warn(
      '[chatTelegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — threaded skipped'
    );
    return { ok: false, telegramMessageId: null, errorDescription: 'missing_env' };
  }

  const body = `💭 <code>${escapeHtml(session.id)}</code>\n\n${escapeHtml(text)}`;
  const options: SendMessageOptions = {};
  if (session.telegramAnchorMessageId) {
    options.reply_to_message_id = session.telegramAnchorMessageId;
  }
  return callSendMessage(token, chatId, body, options);
}

/**
 * Send an admin-facing system note (e.g. when the fallback routing was
 * ambiguous and we need the admin to reply-to explicitly).
 */
export async function sendAdminNotice(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await callSendMessage(token, chatId, `⚠️ <i>${escapeHtml(text)}</i>`);
}
