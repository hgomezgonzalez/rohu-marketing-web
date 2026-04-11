/**
 * In-memory rate limiter for the chat endpoints. Same `Map<key, number[]>`
 * idiom used by /api/leads/route.ts and /api/quick-quote/route.ts, but with
 * three independent buckets (per IP, per session, global) and a 24 h rolling
 * window for the daily IP cap.
 *
 * Single eco dyno only — state is process-local. When scaling to ≥2 dynos,
 * replace with Redis or bring back a sticky-session front door.
 */

const PER_IP_PER_MIN_MAX = 10;
const PER_IP_PER_DAY_MAX = 200;
const PER_SESSION_PER_MIN_MAX = 20;
const NEW_SESSIONS_PER_IP_PER_HOUR_MAX = 3;
const GLOBAL_PER_MIN_MAX = 250;

const MIN_MS = 60_000;
const HOUR_MS = 60 * MIN_MS;
const DAY_MS = 24 * HOUR_MS;

const ipMin = new Map<string, number[]>();
const ipDay = new Map<string, number[]>();
const sessionMin = new Map<string, number[]>();
const ipNewSessionHour = new Map<string, number[]>();
const globalMin: number[] = [];

function pruneAndCount(arr: number[], now: number, windowMs: number): number {
  let first = 0;
  while (first < arr.length && now - arr[first] > windowMs) first++;
  if (first > 0) arr.splice(0, first);
  return arr.length;
}

function getOrCreate(map: Map<string, number[]>, key: string): number[] {
  let list = map.get(key);
  if (!list) {
    list = [];
    map.set(key, list);
  }
  return list;
}

export interface RateLimitDecision {
  ok: boolean;
  reason?: 'ip_min' | 'ip_day' | 'session_min' | 'new_session' | 'global';
  retryAfterMs?: number;
}

/**
 * Check and record a message attempt. Must be called EXACTLY ONCE per
 * incoming POST /api/chat/send — it mutates the counters on success.
 * When a limit is hit, nothing is recorded for that bucket (so retries
 * are not self-penalizing).
 */
export function checkChatSendLimit(ip: string, sessionId: string): RateLimitDecision {
  const now = Date.now();

  // Global circuit breaker (prune only — do not record until all other
  // buckets pass, so a hit returns the same size next try).
  const globalCount = pruneAndCount(globalMin, now, MIN_MS);
  if (globalCount >= GLOBAL_PER_MIN_MAX) {
    return { ok: false, reason: 'global', retryAfterMs: MIN_MS };
  }

  const ipMinList = getOrCreate(ipMin, ip);
  const ipMinCount = pruneAndCount(ipMinList, now, MIN_MS);
  if (ipMinCount >= PER_IP_PER_MIN_MAX) {
    return { ok: false, reason: 'ip_min', retryAfterMs: MIN_MS };
  }

  const ipDayList = getOrCreate(ipDay, ip);
  const ipDayCount = pruneAndCount(ipDayList, now, DAY_MS);
  if (ipDayCount >= PER_IP_PER_DAY_MAX) {
    return { ok: false, reason: 'ip_day', retryAfterMs: HOUR_MS };
  }

  const sessionList = getOrCreate(sessionMin, sessionId);
  const sessionCount = pruneAndCount(sessionList, now, MIN_MS);
  if (sessionCount >= PER_SESSION_PER_MIN_MAX) {
    return { ok: false, reason: 'session_min', retryAfterMs: MIN_MS };
  }

  // All buckets passed — record atomically
  ipMinList.push(now);
  ipDayList.push(now);
  sessionList.push(now);
  globalMin.push(now);

  return { ok: true };
}

/**
 * Check limit on creating a BRAND NEW session from this IP.
 * Separate from per-message limits because session creation is the bigger
 * abuse vector (one new session = one new anchor message in the admin's
 * Telegram, which is noisy).
 */
export function checkNewSessionLimit(ip: string): RateLimitDecision {
  const now = Date.now();
  const list = getOrCreate(ipNewSessionHour, ip);
  const count = pruneAndCount(list, now, HOUR_MS);
  if (count >= NEW_SESSIONS_PER_IP_PER_HOUR_MAX) {
    return { ok: false, reason: 'new_session', retryAfterMs: HOUR_MS };
  }
  list.push(now);
  return { ok: true };
}

export const __testing = {
  ipMin,
  ipDay,
  sessionMin,
  ipNewSessionHour,
  globalMin,
  PER_IP_PER_MIN_MAX,
  PER_SESSION_PER_MIN_MAX,
};
