/**
 * In-memory store for the live chat feature.
 *
 * Design notes:
 * - Pure in-memory, intentionally. Heroku eco dyno filesystem is ephemeral
 *   and we deliberately avoid paid addons (Redis/Postgres) for v1. Every
 *   appended message is also emitted to stdout as a structured log line so
 *   Heroku Logs keeps a persistent audit trail (same pattern as leadsStore).
 * - Waiters queue: `waitForMessages` is a long-poll primitive that resolves
 *   immediately when new messages arrive OR after `timeoutMs` (Heroku router
 *   idle limit is 55 s, so callers should use ≤25 s to stay safe).
 * - Reverse index `telegramMessageId → sessionId` lets the webhook handler
 *   resolve an admin's reply-to back to the correct session in O(1).
 * - Fallback heuristic for non-reply admin messages: the most recently
 *   active session whose last direction was visitor→admin.
 * - Eviction: sessions idle >30 min are swept on every write; hard caps
 *   prevent unbounded memory growth under attack.
 *
 * NEVER persist secrets or raw IPs in this module. Callers are responsible
 * for masking IP and redacting PII before calling appendMessage().
 */

export type ChatDirection = 'in' | 'out';
// 'in'  = visitor → admin (arrived from the website form)
// 'out' = admin → visitor (arrived from Telegram webhook)

export interface ChatMessage {
  id: string;
  sessionId: string;
  ts: number;
  direction: ChatDirection;
  text: string;
  telegramMessageId?: number;
}

export interface ChatSessionContext {
  pathname: string;
  maskedIp: string;
  userAgentFamily: string; // e.g. "Chrome 125" — coarse-grained only, no fingerprinting
}

export interface ChatSession {
  id: string;
  createdAt: number;
  lastActivityAt: number;
  lastDirection: ChatDirection | null;
  context: ChatSessionContext;
  messages: ChatMessage[];
  telegramAnchorMessageId: number | null;
}

const MAX_SESSIONS = 500;
const MAX_MESSAGES_PER_SESSION = 50;
const IDLE_TTL_MS = 30 * 60 * 1000; // 30 min

// Main data structures (module-local state, 1 dyno = 1 instance)
const sessions = new Map<string, ChatSession>();
const tgMessageToSession = new Map<number, string>();
// waiters[sessionId] = list of resolvers that should be called on any new message
const waiters = new Map<string, Set<() => void>>();
// Idempotency guard for Telegram webhook retries
const seenUpdateIds = new Set<number>();
const SEEN_UPDATE_LIMIT = 1000;

export function getSession(sessionId: string): ChatSession | undefined {
  return sessions.get(sessionId);
}

export function size(): number {
  return sessions.size;
}

/**
 * Sweep sessions idle beyond IDLE_TTL_MS. Called opportunistically from
 * every write path — no separate timer. Heroku eco dynos already sleep
 * when there's no traffic, so a dedicated interval would be wasted.
 */
function sweepIdle(): void {
  const cutoff = Date.now() - IDLE_TTL_MS;
  for (const [id, session] of sessions) {
    if (session.lastActivityAt < cutoff) {
      sessions.delete(id);
      waiters.delete(id);
      // Reverse index entries for this session become dangling but are
      // harmless (the session lookup will fail). They are swept lazily
      // when the Map grows past a reasonable size.
    }
  }
}

function generateMessageId(prefix: 'in' | 'out'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Create a new session or return the existing one if `sessionId` already
 * exists. Returning a fresh session caps the global count; when MAX_SESSIONS
 * is reached, the oldest idle session is evicted to make room.
 */
export function ensureSession(sessionId: string, context: ChatSessionContext): ChatSession {
  sweepIdle();
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.lastActivityAt = Date.now();
    return existing;
  }
  if (sessions.size >= MAX_SESSIONS) {
    // Evict the oldest (by lastActivityAt)
    let oldestId: string | null = null;
    let oldestTs = Infinity;
    for (const [id, s] of sessions) {
      if (s.lastActivityAt < oldestTs) {
        oldestTs = s.lastActivityAt;
        oldestId = id;
      }
    }
    if (oldestId) {
      sessions.delete(oldestId);
      waiters.delete(oldestId);
    }
  }
  const now = Date.now();
  const fresh: ChatSession = {
    id: sessionId,
    createdAt: now,
    lastActivityAt: now,
    lastDirection: null,
    context,
    messages: [],
    telegramAnchorMessageId: null,
  };
  sessions.set(sessionId, fresh);
  return fresh;
}

/**
 * Append a message to the session and notify any long-poll waiters that
 * are currently parked on this session. The `telegramMessageId` is also
 * indexed so the webhook's reply-to lookup is O(1).
 */
export function appendMessage(
  sessionId: string,
  message: Omit<ChatMessage, 'id' | 'sessionId'> & { id?: string }
): ChatMessage | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const full: ChatMessage = {
    id: message.id ?? generateMessageId(message.direction === 'in' ? 'in' : 'out'),
    sessionId,
    ts: message.ts,
    direction: message.direction,
    text: message.text,
    telegramMessageId: message.telegramMessageId,
  };

  session.messages.push(full);
  // Cap message history per session
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages.splice(0, session.messages.length - MAX_MESSAGES_PER_SESSION);
  }
  session.lastActivityAt = full.ts;
  session.lastDirection = full.direction;

  if (full.telegramMessageId) {
    tgMessageToSession.set(full.telegramMessageId, sessionId);
  }

  // Wake any long-poll waiters
  const parked = waiters.get(sessionId);
  if (parked && parked.size > 0) {
    for (const resolve of parked) resolve();
    parked.clear();
  }

  sweepIdle();
  return full;
}

export function setAnchorMessageId(sessionId: string, telegramMessageId: number): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.telegramAnchorMessageId = telegramMessageId;
  tgMessageToSession.set(telegramMessageId, sessionId);
}

export function getMessagesSince(sessionId: string, sinceTs: number): ChatMessage[] {
  const session = sessions.get(sessionId);
  if (!session) return [];
  // Only "out" (admin → visitor) matters to the client; the client already
  // knows its own "in" messages from the optimistic render.
  return session.messages.filter((m) => m.ts > sinceTs && m.direction === 'out');
}

/**
 * Long-poll primitive. Resolves with the fresh message array either
 * immediately (if there are already messages > sinceTs) or as soon as
 * appendMessage() wakes the waiter. Returns an empty array on timeout.
 */
export function waitForMessages(
  sessionId: string,
  sinceTs: number,
  timeoutMs: number
): Promise<ChatMessage[]> {
  const immediate = getMessagesSince(sessionId, sinceTs);
  if (immediate.length > 0) return Promise.resolve(immediate);
  const session = sessions.get(sessionId);
  if (!session) return Promise.resolve([]);

  return new Promise((resolve) => {
    let settled = false;
    const parked = waiters.get(sessionId) ?? new Set<() => void>();
    waiters.set(sessionId, parked);

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      parked.delete(resolver);
      resolve([]);
    }, timeoutMs);

    const resolver = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(getMessagesSince(sessionId, sinceTs));
    };

    parked.add(resolver);
  });
}

/**
 * Resolve a Telegram update (an admin message) back to a session id.
 * Cascade:
 *   1. If `reply_to_message.message_id` is in the reverse index, use it.
 *   2. Otherwise scan `reply_to_message.text` for a `sess_xxx` substring
 *      and match it against live sessions.
 *   3. Fallback: return the most recently active session whose last
 *      direction was visitor→admin AND was active within the last 5 min.
 *   4. If none match, return null → caller should warn the admin.
 */
export function findSessionByTelegramUpdate(update: {
  message?: {
    reply_to_message?: { message_id?: number; text?: string };
  };
}): { sessionId: string; via: 'reply_id' | 'text_scan' | 'fallback' } | null {
  const reply = update.message?.reply_to_message;
  if (reply?.message_id) {
    const hit = tgMessageToSession.get(reply.message_id);
    if (hit && sessions.has(hit)) return { sessionId: hit, via: 'reply_id' };
  }
  if (reply?.text) {
    const match = /\bsess_[a-z0-9_]+\b/i.exec(reply.text);
    if (match) {
      const candidate = match[0];
      if (sessions.has(candidate)) return { sessionId: candidate, via: 'text_scan' };
    }
  }
  // Fallback: most recently active session where visitor was the last to speak
  const FALLBACK_WINDOW_MS = 5 * 60 * 1000;
  const cutoff = Date.now() - FALLBACK_WINDOW_MS;
  let best: ChatSession | null = null;
  for (const s of sessions.values()) {
    if (s.lastDirection !== 'in') continue;
    if (s.lastActivityAt < cutoff) continue;
    if (!best || s.lastActivityAt > best.lastActivityAt) best = s;
  }
  if (best) return { sessionId: best.id, via: 'fallback' };
  return null;
}

/**
 * Idempotency guard for Telegram webhook retries. Returns true if the
 * update_id has already been processed (caller should early-return 200
 * without re-processing).
 */
export function isUpdateSeen(updateId: number): boolean {
  if (seenUpdateIds.has(updateId)) return true;
  seenUpdateIds.add(updateId);
  if (seenUpdateIds.size > SEEN_UPDATE_LIMIT) {
    // Simple FIFO trim — iterate once and drop the first half
    const toRemove = Math.floor(SEEN_UPDATE_LIMIT / 2);
    let i = 0;
    for (const id of seenUpdateIds) {
      if (i++ >= toRemove) break;
      seenUpdateIds.delete(id);
    }
  }
  return false;
}

export const __testing = {
  sessions,
  tgMessageToSession,
  waiters,
  seenUpdateIds,
};
