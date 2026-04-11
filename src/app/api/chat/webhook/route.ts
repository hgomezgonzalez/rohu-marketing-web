import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import {
  appendMessage,
  findSessionByTelegramUpdate,
  isUpdateSeen,
} from '@/lib/chatStore';
import { sendAdminNotice } from '@/lib/chatTelegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/chat/webhook
 *
 * Telegram → server. Receives admin replies from the operator's Telegram
 * client and routes them back to the correct visitor session so the
 * /api/chat/poll long-poll resolves and delivers them to the browser
 * widget in near real-time.
 *
 * Security: every incoming request MUST carry the header
 *   X-Telegram-Bot-Api-Secret-Token
 * matching process.env.TELEGRAM_WEBHOOK_SECRET — this is the only defense
 * against someone impersonating Telegram and posting fake admin replies.
 * The comparison uses Node crypto.timingSafeEqual.
 *
 * Always returns 200 on well-formed requests (even when the update is
 * ignored or un-routable) to prevent Telegram from retrying indefinitely.
 * Only malformed/unauthorized requests get 401/400.
 */

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: { id: number; first_name?: string; username?: string };
    chat?: { id: number; type?: string };
    date: number;
    text?: string;
    reply_to_message?: {
      message_id?: number;
      text?: string;
    };
  };
  edited_message?: unknown;
  channel_post?: unknown;
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret) {
    // eslint-disable-next-line no-console
    console.error('[chat:webhook] TELEGRAM_WEBHOOK_SECRET not set — rejecting all');
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 401 });
  }

  const headerSecret = req.headers.get('x-telegram-bot-api-secret-token') ?? '';
  if (!constantTimeEquals(headerSecret, expectedSecret)) {
    // eslint-disable-next-line no-console
    console.warn('[chat:webhook] invalid secret header — rejecting');
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!update || typeof update.update_id !== 'number') {
    return NextResponse.json({ ok: false, error: 'invalid_update' }, { status: 400 });
  }

  // Idempotency — Telegram may retry on timeouts
  if (isUpdateSeen(update.update_id)) {
    return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
  }

  // Only process `message` events; ignore edited_message, channel_post, etc.
  const msg = update.message;
  if (!msg || !msg.text) {
    return NextResponse.json({ ok: true, ignored: 'non_message' }, { status: 200 });
  }

  // Security gate: only accept messages from the configured admin chat.
  // We never route messages from other chats because the whole trust
  // model assumes a single operator's private chat with the bot.
  const configuredChatId = process.env.TELEGRAM_CHAT_ID;
  if (configuredChatId && String(msg.chat?.id ?? '') !== configuredChatId) {
    // eslint-disable-next-line no-console
    console.warn(
      '[chat:webhook] message from unexpected chat — ignoring',
      msg.chat?.id
    );
    return NextResponse.json({ ok: true, ignored: 'chat_mismatch' }, { status: 200 });
  }

  const routing = findSessionByTelegramUpdate({ message: msg });
  if (!routing) {
    // Admin typed a message we cannot route. Nudge them.
    void sendAdminNotice(
      'No pude identificar a qué sesión corresponde tu mensaje. Por favor usa la acción «Reply» sobre el mensaje del visitante.'
    );
    return NextResponse.json({ ok: true, ignored: 'unroutable' }, { status: 200 });
  }

  const appended = appendMessage(routing.sessionId, {
    ts: msg.date * 1000,
    direction: 'out',
    text: msg.text,
    telegramMessageId: msg.message_id,
  });

  // eslint-disable-next-line no-console
  console.info(
    '[chat:msg]',
    JSON.stringify({
      sessionId: routing.sessionId,
      ts: msg.date * 1000,
      direction: 'out',
      via: routing.via,
    })
  );

  return NextResponse.json(
    {
      ok: true,
      sessionId: routing.sessionId,
      via: routing.via,
      appended: Boolean(appended),
    },
    { status: 200 }
  );
}
