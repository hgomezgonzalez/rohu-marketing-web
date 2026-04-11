/**
 * Browser-side chat client helpers. No React dependencies — pure
 * functions so they're easy to test and reuse.
 *
 * Pattern: ChatWidget.tsx calls startPolling(...) when the widget opens
 * and stopPolling() when it closes or the tab goes hidden. Each call to
 * sendChatMessage(...) issues an optimistic POST and resolves with the
 * server-confirmed message id + ts.
 */

export interface OutMessage {
  id: string;
  ts: number;
  direction: 'in' | 'out';
  text: string;
}

export interface SendResult {
  ok: boolean;
  messageId: string | null;
  ts: number;
  anchorCreated?: boolean;
  error?: string;
  retryAfterMs?: number;
}

const SEND_ENDPOINT = '/api/chat/send';
const POLL_ENDPOINT = '/api/chat/poll';

export async function sendChatMessage(
  sessionId: string,
  text: string,
  pathname: string
): Promise<SendResult> {
  try {
    const res = await fetch(SEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, text, pathname }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        messageId: null,
        ts: Date.now(),
        error: body?.error ?? `http_${res.status}`,
        retryAfterMs: body?.retryAfterMs,
      };
    }
    return {
      ok: true,
      messageId: body?.messageId ?? null,
      ts: body?.ts ?? Date.now(),
      anchorCreated: body?.anchorCreated,
    };
  } catch (err) {
    return {
      ok: false,
      messageId: null,
      ts: Date.now(),
      error: err instanceof Error ? err.message : 'network_error',
    };
  }
}

export interface PollHandle {
  stop: () => void;
}

export interface PollCallbacks {
  onMessages: (messages: OutMessage[]) => void;
  onRestart: () => void; // called when server returns 410 (session_not_found)
  onReconnecting: (reconnecting: boolean) => void;
}

/**
 * Start a long-poll loop. Cancels cleanly via the returned `stop()`.
 * On network errors or 5xx responses, backs off linearly up to 20 s.
 * On 410, calls onRestart and stops.
 */
export function startPolling(
  sessionId: string,
  initialSinceTs: number,
  callbacks: PollCallbacks
): PollHandle {
  let stopped = false;
  let sinceTs = initialSinceTs;
  let failureCount = 0;
  let currentController: AbortController | null = null;

  async function loop() {
    while (!stopped) {
      const controller = new AbortController();
      currentController = controller;
      try {
        const res = await fetch(
          `${POLL_ENDPOINT}?sessionId=${encodeURIComponent(sessionId)}&since=${sinceTs}`,
          { signal: controller.signal }
        );
        if (res.status === 410) {
          if (!stopped) callbacks.onRestart();
          return;
        }
        if (!res.ok) {
          failureCount++;
          callbacks.onReconnecting(true);
          const backoff = Math.min(20_000, 1_000 * failureCount);
          await sleep(backoff);
          continue;
        }
        const body = (await res.json()) as { messages: OutMessage[]; serverTs: number };
        if (failureCount > 0) {
          callbacks.onReconnecting(false);
          failureCount = 0;
        }
        if (body.messages && body.messages.length > 0) {
          callbacks.onMessages(body.messages);
          sinceTs = body.messages[body.messages.length - 1].ts;
        }
        // If empty → hold timed out, loop immediately to open a fresh hold.
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
        failureCount++;
        callbacks.onReconnecting(true);
        const backoff = Math.min(20_000, 1_000 * failureCount);
        await sleep(backoff);
      }
    }
  }

  void loop();

  return {
    stop: () => {
      stopped = true;
      if (currentController) {
        try {
          currentController.abort();
        } catch {
          // ignore
        }
      }
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
