import nodemailer, { type Transporter } from 'nodemailer';
import type { Lead } from '@/types/lead';
import { buildWhatsAppUrl } from './contactChannels';
import { escapeHtml } from './htmlEscape';

/**
 * Server-only helper that sends a new-lead email notification to the owner(s).
 *
 * Configuration is driven by env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
 * `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO`). If any required var is
 * missing, the call is a silent no-op with a `console.warn`, so the lead
 * pipeline keeps working even without SMTP configured.
 *
 * IMPORTANT: the password value must NEVER be logged. We only log the absence
 * of env vars, never their contents.
 */

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? '587');
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.warn(
      '[sendLeadEmail] SMTP env vars missing (SMTP_HOST/SMTP_USER/SMTP_PASS) — email skipped'
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return cachedTransporter;
}

function buildSubject(lead: Lead): string {
  const isQuick = lead.formType === 'quick_quote';
  const emoji = isQuick ? '💨' : '🟢';
  const tag = isQuick ? 'Cotización rápida' : 'Nuevo lead';
  const planSegment = lead.planInterest ? ` · ${lead.planInterest}` : '';
  return `${emoji} ${tag} · ROHU Solutions · ${lead.application}${planSegment} · ${lead.firstName}`;
}

function buildTextBody(lead: Lead): string {
  const isQuick = lead.formType === 'quick_quote';
  const lines = [
    isQuick
      ? 'Cotización rápida recibida desde ROHU Solutions'
      : 'Nuevo lead recibido desde ROHU Solutions',
    '',
    `Aplicación: ${lead.application}`,
  ];
  if (lead.planInterest) lines.push(`Plan:       ${lead.planInterest}`);
  lines.push('');

  lines.push(`Nombre:   ${lead.firstName}`);
  lines.push(`WhatsApp: ${lead.whatsapp}`);
  if (lead.email) lines.push(`Email:    ${lead.email}`);
  if (lead.companyName) {
    lines.push(`Empresa:  ${lead.companyName}${lead.nit ? ` (NIT ${lead.nit})` : ''}`);
  }
  if (lead.city) lines.push(`Ciudad:   ${lead.city}`);
  if (lead.businessType) lines.push(`Tipo:     ${lead.businessType}`);
  if (lead.numUsers) lines.push(`Usuarios: ${lead.numUsers}`);

  if (lead.message && lead.message.trim().length > 0) {
    lines.push('', 'Mensaje:', lead.message);
  }
  lines.push('', `Recibido: ${lead.createdAt}`, `ID: ${lead.id}`);
  return lines.join('\n');
}

function buildHtmlBody(lead: Lead): string {
  const isQuick = lead.formType === 'quick_quote';
  const headerEmoji = isQuick ? '💨' : '🟢';
  const headerLabel = isQuick ? 'Cotización rápida · ROHU Solutions' : 'Nuevo lead · ROHU Solutions';
  // Quick quotes use the cta gradient (more urgent/fresh), full leads keep the hero gradient
  const headerGradient = isQuick
    ? 'linear-gradient(90deg,#10B981 0%,#06B6D4 100%)'
    : 'linear-gradient(135deg,#1E3A8A 0%,#06B6D4 100%)';

  const safe = {
    firstName: escapeHtml(lead.firstName),
    companyName: lead.companyName ? escapeHtml(lead.companyName) : null,
    nit: lead.nit ? escapeHtml(lead.nit) : null,
    city: lead.city ? escapeHtml(lead.city) : null,
    email: lead.email ? escapeHtml(lead.email) : null,
    whatsapp: escapeHtml(lead.whatsapp),
    businessType: lead.businessType ? escapeHtml(lead.businessType) : null,
    numUsers: lead.numUsers ? escapeHtml(lead.numUsers) : null,
    application: escapeHtml(lead.application),
    planInterest: lead.planInterest ? escapeHtml(lead.planInterest) : null,
    message: lead.message ? escapeHtml(lead.message).replace(/\n/g, '<br>') : null,
    createdAt: escapeHtml(lead.createdAt),
    id: escapeHtml(lead.id),
  };

  // Build "Reply by WhatsApp" button using the lead's phone
  const cleanedWhatsapp = lead.whatsapp.replace(/\D/g, '');
  const e164 =
    cleanedWhatsapp.length === 10 ? `57${cleanedWhatsapp}` : cleanedWhatsapp;
  const waReplyMessage = isQuick
    ? `Hola ${lead.firstName}, recibimos tu solicitud de cotización en ROHU Solutions. ¿Cuándo te marco para conversar?`
    : `Hola ${lead.firstName}, vi tu solicitud en ROHU Solutions. ¿Cuándo tienes 15 minutos para hablar?`;
  const waReplyUrl = buildWhatsAppUrl(e164, waReplyMessage);
  const mailtoUrl = lead.email ? `mailto:${lead.email}` : null;

  // Build the data rows dynamically: only show fields that are present
  const headerName = safe.companyName ? `${safe.firstName} — ${safe.companyName}` : safe.firstName;
  const planLine = safe.planInterest
    ? `<div style="font-size:14px;opacity:0.9;margin-top:6px;">Plan de interés: <strong>${safe.planInterest}</strong></div>`
    : '';

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;width:120px;color:#64748B;">${label}</td><td style="padding:6px 0;">${value}</td></tr>`;

  const rows: string[] = [];
  rows.push(row('Nombre', `<strong>${safe.firstName}</strong>`));
  rows.push(row('WhatsApp', safe.whatsapp));
  if (safe.email && mailtoUrl) {
    rows.push(row('Email', `<a href="${mailtoUrl}" style="color:#1E3A8A;">${safe.email}</a>`));
  }
  if (safe.companyName) {
    const company = safe.nit ? `${safe.companyName} · NIT ${safe.nit}` : safe.companyName;
    rows.push(row('Empresa', company));
  }
  if (safe.city) rows.push(row('Ciudad', safe.city));
  if (safe.businessType) rows.push(row('Tipo', safe.businessType));
  if (safe.numUsers) rows.push(row('Usuarios', safe.numUsers));
  if (safe.planInterest) rows.push(row('Plan', safe.planInterest));

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${headerLabel}</title></head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:Arial,Helvetica,sans-serif;color:#0F172A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px -15px rgba(30,58,138,0.35);">
        <tr>
          <td style="background:${headerGradient};padding:28px 32px;color:#ffffff;">
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">${headerLabel}</div>
            <div style="font-size:22px;font-weight:700;">${headerEmoji} ${headerName}</div>
            <div style="font-size:14px;opacity:0.9;margin-top:6px;">Aplicación de interés: <strong>${safe.application}</strong></div>
            ${planLine}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
              ${rows.join('\n              ')}
            </table>
            ${safe.message ? `
            <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-left:3px solid #06B6D4;border-radius:8px;">
              <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#64748B;margin-bottom:6px;">Mensaje</div>
              <div style="font-size:14px;color:#0F172A;line-height:1.6;">${safe.message}</div>
            </div>` : ''}

            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="${waReplyUrl}" style="display:inline-block;padding:12px 20px;background:linear-gradient(90deg,#10B981 0%,#06B6D4 100%);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">📲 Responder por WhatsApp</a>
                </td>
                ${mailtoUrl ? `<td>
                  <a href="${mailtoUrl}" style="display:inline-block;padding:12px 20px;background:#ffffff;color:#1E3A8A;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;border:1px solid #E2E8F0;">✉️ Abrir email</a>
                </td>` : ''}
              </tr>
            </table>

            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:11px;color:#64748B;">
              Recibido: ${safe.createdAt}<br>
              ID: ${safe.id}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#F8FAFC;padding:16px 32px;font-size:11px;color:#64748B;text-align:center;">
            Este correo fue generado automáticamente por ROHU Solutions Marketing Web.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return;

  const to = process.env.SMTP_TO;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  if (!to || !from) {
    // eslint-disable-next-line no-console
    console.warn('[sendLeadEmail] SMTP_TO or SMTP_FROM missing — email skipped');
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject: buildSubject(lead),
      text: buildTextBody(lead),
      html: buildHtmlBody(lead),
      replyTo: lead.email,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[sendLeadEmail] sendMail failed', err instanceof Error ? err.message : err);
  }
}
