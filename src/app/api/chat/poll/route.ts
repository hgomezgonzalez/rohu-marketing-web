import { NextResponse, type NextRequest } from 'next/server';
import { getSession, waitForMessages } from '@/lib/chatStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/chat/poll?sessionId=sess_...&since=<msEpoch>
 *
 * Long-poll endpoint. The widget calls this while open; the server
 * holds the request for up to POLL_HOLD_MS (default 25 s) waiting for
 * new admin → visitor messages. On hit, returns immediately. On timeout,
 * returns an empty array so the widget can reopen a fresh hold.
 *
 * Response contract:
 *   200 { messages: ChatMessage[], serverTs: number }
 *   400 { ok: false, error: 'missing_params' | 'invalid_params' }
 *   410 { ok: false, error: 'session_not_found' }   ← e.g. after dyno restart
 *
 * The client should treat 410 as "Conversación reiniciada por mantenimiento"
 * and start a brand new session.
 */

const DEFAULT_HOLD_MS = 25_000;
const MAX_HOLD_MS = 30_000;
const SESSION_ID_RE = /^sess_[a-z0-9_]+$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const sinceStr = searchParams.get('since');

  if (!sessionId || sinceStr === null) {
    return NextResponse.json(
      { ok: false, error: 'missing_params' },
      { status: 400 }
    );
  }
  if (!SESSION_ID_RE.test(sessionId)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_params' },
      { status: 400 }
    );
  }
  const since = Number(sinceStr);
  if (!Number.isFinite(since) || since < 0) {
    return NextResponse.json(
      { ok: false, error: 'invalid_params' },
      { status: 400 }
    );
  }

  if (!getSession(sessionId)) {
    return NextResponse.json(
      { ok: false, error: 'session_not_found' },
      { status: 410 }
    );
  }

  // Honor an explicit hold parameter for smoke-tests; clamp to MAX_HOLD_MS.
  const holdMsRaw = Number(searchParams.get('holdMs') ?? DEFAULT_HOLD_MS);
  const holdMs = Math.min(
    MAX_HOLD_MS,
    Math.max(0, Number.isFinite(holdMsRaw) ? holdMsRaw : DEFAULT_HOLD_MS)
  );

  const messages = await waitForMessages(sessionId, since, holdMs);
  return NextResponse.json({ messages, serverTs: Date.now() }, { status: 200 });
}
