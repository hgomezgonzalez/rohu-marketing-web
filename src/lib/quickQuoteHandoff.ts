/**
 * Handoff mechanism between the QuickQuoteModal and the long LeadForm.
 *
 * When the visitor clicks "¿Quieres darnos más contexto?" inside the modal,
 * the modal:
 *   1. Serializes whatever the visitor already typed (firstName, whatsapp,
 *      email) + the selected plan into sessionStorage under a fixed key.
 *   2. Navigates to `?plan=<id>#contact`.
 *
 * The LeadForm reads and consumes this handoff on mount so the visitor never
 * has to retype what they already filled in the modal. Consuming clears the
 * key so a subsequent visit to the form doesn't re-hydrate stale data.
 *
 * Recommendation from the web-funnel-designer agent: "El esfuerzo del usuario
 * es sagrado. Perderlo rompe la confianza."
 */

const HANDOFF_KEY = 'rohu_quick_quote_handoff';

export type QuickQuoteHandoff = {
  firstName?: string;
  whatsapp?: string;
  email?: string;
  planInterest?: string;
};

export function saveQuickQuoteHandoff(data: QuickQuoteHandoff): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(data));
  } catch {
    // SessionStorage may be unavailable in private mode — fail silently.
  }
}

export function consumeQuickQuoteHandoff(): QuickQuoteHandoff | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(HANDOFF_KEY);
    const parsed = JSON.parse(raw) as QuickQuoteHandoff;
    return parsed;
  } catch {
    return null;
  }
}
