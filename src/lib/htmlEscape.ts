/**
 * Escapes the five HTML special characters so user-supplied text is safe to
 * embed in Telegram HTML messages and nodemailer HTML bodies.
 *
 * Shared by src/lib/notifyTelegram.ts, src/lib/sendLeadEmail.ts and
 * src/lib/chatTelegram.ts. Keeping a single implementation avoids drift
 * between channels.
 */
export function escapeHtml(raw: string): string {
  return raw.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}
