import { NextResponse, type NextRequest } from 'next/server';
import { leadFormSchema } from '@/components/forms/leadFormSchema';
import { appendLead } from '@/lib/leadsStore';
import { notifyTelegram } from '@/lib/notifyTelegram';
import { sendLeadEmail } from '@/lib/sendLeadEmail';
import type { Lead } from '@/types/lead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * In-memory rate limit — trivial but enough for v1.
 * 5 submissions per IP per minute.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitHits: Map<string, number[]> = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateLimitHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitHits.set(ip, recent);
  return false;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function generateId(): string {
  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'validation', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Reject honeypot hits without leaking detection to the bot
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const lead: Lead = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    firstName: parsed.data.firstName,
    companyName: parsed.data.companyName,
    nit: parsed.data.nit,
    city: parsed.data.city,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
    businessType: parsed.data.businessType,
    numUsers: parsed.data.numUsers,
    message: parsed.data.message,
    planInterest: parsed.data.planInterest,
    application: parsed.data.application,
    habeasData: true,
    source: 'rohu-marketing-web',
    formType: 'full_lead',
  };

  // Structured log so every captured lead survives on Heroku Logs even if
  // Telegram/SMTP/CRM integrations are unconfigured or fail. Grep with:
  //   heroku logs -a rohu-marketing-web --tail | grep lead:captured
  // eslint-disable-next-line no-console
  console.info('[lead:captured]', JSON.stringify(lead));

  try {
    await appendLead(lead);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/leads] appendLead failed', err);
    // Don't fail the lead because of local storage issues on ephemeral dynos.
  }

  // Fire-and-forget: notify the owner on Telegram
  void notifyTelegram(lead);

  // Fire-and-forget: send email notification to the owner
  void sendLeadEmail(lead);

  // Optional: forward to an external CRM webhook
  const crmUrl = process.env.LEAD_API_URL;
  if (crmUrl && crmUrl.startsWith('http')) {
    void fetch(crmUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[api/leads] forward to LEAD_API_URL failed', err);
    });
  }

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
