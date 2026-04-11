import { NextResponse } from 'next/server';
import { size as chatStoreSize } from '@/lib/chatStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lightweight health check. Reports the presence (not the value) of each
 * integration secret, so the owner can verify the production environment
 * without logging into the Heroku dashboard. Safe to expose publicly:
 * no secret values are ever returned, only booleans.
 *
 * Example:
 *   curl -s https://rohu-solutions.com/api/health | python3 -m json.tool
 */
export async function GET() {
  const has = (name: string) =>
    Boolean(process.env[name] && process.env[name]!.length > 0);

  return NextResponse.json(
    {
      ok: true,
      service: 'rohu-marketing-web',
      timestamp: new Date().toISOString(),
      site_url: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      integrations: {
        telegram: has('TELEGRAM_BOT_TOKEN') && has('TELEGRAM_CHAT_ID'),
        smtp:
          has('SMTP_HOST') &&
          has('SMTP_USER') &&
          has('SMTP_PASS') &&
          has('SMTP_FROM') &&
          has('SMTP_TO'),
        lead_webhook: has('LEAD_API_URL'),
      },
      chat: {
        enabled:
          has('TELEGRAM_BOT_TOKEN') &&
          has('TELEGRAM_CHAT_ID') &&
          has('TELEGRAM_WEBHOOK_SECRET'),
        sessionCount: chatStoreSize(),
      },
    },
    { status: 200 }
  );
}
