import { z } from 'zod';

/**
 * Validation schema for incoming chat messages posted to /api/chat/send.
 * Kept intentionally strict to minimize abuse surface:
 *  - sessionId must match the analytics session format
 *  - text bounded to 1..1000 chars, stripped of control chars except \n
 *  - no more than 5 consecutive newlines (anti-spam)
 *  - pathname must start with '/'
 */

const SESSION_ID_RE = /^sess_[a-z0-9_]+$/i;
const PATHNAME_RE = /^\/[^\s]*$/;

export const chatMessageSchema = z.object({
  sessionId: z
    .string()
    .min(6, 'sessionId too short')
    .max(64, 'sessionId too long')
    .regex(SESSION_ID_RE, 'sessionId has invalid format'),
  text: z
    .string()
    .min(1, 'text is required')
    .max(1000, 'text exceeds 1000 characters')
    .refine((v) => !/[\u0000-\u0008\u000B-\u001F\u007F]/.test(v), {
      message: 'text contains control characters',
    })
    .refine((v) => !/\n{6,}/.test(v), {
      message: 'text has too many consecutive newlines',
    }),
  pathname: z.string().regex(PATHNAME_RE, 'invalid pathname').max(200),
});

export type ChatMessagePayload = z.infer<typeof chatMessageSchema>;
