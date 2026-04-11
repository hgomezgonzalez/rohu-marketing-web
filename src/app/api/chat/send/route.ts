import { NextResponse, type NextRequest } from 'next/server';
import { chatMessageSchema } from '@/components/forms/chatMessageSchema';
import {
  ensureSession,
  appendMessage,
  setAnchorMessageId,
  getSession,
} from '@/lib/chatStore';
import { checkChatSendLimit, checkNewSessionLimit } from '@/lib/chatRateLimit';
import { sendAnchorMessage, sendThreadedMessage } from '@/lib/chatTelegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/chat/send
 *
 * Accepts an anonymous visitor message from the live chat widget, applies
 * rate limiting, creates or reuses a session, forwards the message to the
 * operator's Telegram (threaded as a reply to the session anchor), and
 * also mirrors the message to stdout as a structured log line so it is
 * retained by Heroku Logs even if the in-memory store is later wiped.
 *
 * Response:
 *   201 { ok: true, messageId, ts, anchorCreated }
 *   400 { ok: false, error: 'invalid_json' }
 *   422 { ok: false, error: 'validation', issues }
 *   429 { ok: false, error, retryAfterMs }
 */

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function maskIp(ip: string): string {
  if (!ip || ip === 'unknown') return 'unknown';
  // IPv4: mask last octet; IPv6: mask last 4 hextets
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.XXX`;
    return 'unknown';
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) return `${parts.slice(0, 4).join(':')}::XXXX`;
    return 'unknown';
  }
  return 'unknown';
}

function parseUserAgentFamily(ua: string | null): string {
  if (!ua) return '';
  // Coarse-grained: just extract first recognizable browser family token.
  const m =
    /\b(Chrome|Firefox|Safari|Edge|Opera|OPR|Samsung|DuckDuckGo|UCBrowser)\/([\d.]+)/.exec(ua);
  if (m) return `${m[1]} ${m[2].split('.')[0]}`;
  if (/bot|crawler|spider/i.test(ua)) return 'bot';
  return 'other';
}

/**
 * Log-safe representation of a captured message: redact anything that
 * looks like an email, phone, or long digit sequence. The original text
 * remains in memory for real-time delivery; this is only for the stdout
 * mirror that Heroku Logs persists.
 */
function redactPii(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/\+?\d[\d\s\-().]{9,}/g, '[phone]');
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const maskedIp = maskIp(ip);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = chatMessageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { sessionId, text, pathname } = parsed.data;
  const existingSession = getSession(sessionId);

  // New session gate
  if (!existingSession) {
    const newSessionDecision = checkNewSessionLimit(ip);
    if (!newSessionDecision.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: newSessionDecision.reason,
          retryAfterMs: newSessionDecision.retryAfterMs,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil((newSessionDecision.retryAfterMs ?? 60000) / 1000)
            ),
          },
        }
      );
    }
  }

  // Per-message rate limits (atomic check-and-record)
  const sendDecision = checkChatSendLimit(ip, sessionId);
  if (!sendDecision.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: sendDecision.reason,
        retryAfterMs: sendDecision.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((sendDecision.retryAfterMs ?? 60000) / 1000)),
        },
      }
    );
  }

  const session = ensureSession(sessionId, {
    pathname,
    maskedIp,
    userAgentFamily: parseUserAgentFamily(req.headers.get('user-agent')),
  });

  // Append visitor message to store
  const now = Date.now();
  const visitorMsg = appendMessage(sessionId, {
    ts: now,
    direction: 'in',
    text,
  });

  // Structured log line (PII-redacted) — persistent via Heroku Logs
  // eslint-disable-next-line no-console
  console.info(
    '[chat:msg]',
    JSON.stringify({
      sessionId,
      ts: now,
      direction: 'in',
      page: pathname,
      ip: maskedIp,
      textRedacted: redactPii(text),
    })
  );

  // Fire-and-forget Telegram delivery — but await the anchor creation
  // because we MUST capture the returned message_id for reverse routing.
  let anchorCreated = false;
  if (!session.telegramAnchorMessageId) {
    const anchor = await sendAnchorMessage(session, text);
    if (anchor.ok && anchor.telegramMessageId) {
      setAnchorMessageId(sessionId, anchor.telegramMessageId);
      anchorCreated = true;
    }
  } else {
    // Subsequent message — threaded under the anchor
    void sendThreadedMessage(session, text);
  }

  return NextResponse.json(
    {
      ok: true,
      messageId: visitorMsg?.id ?? null,
      ts: now,
      anchorCreated,
    },
    { status: 201 }
  );
}
