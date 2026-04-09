/**
 * Lightweight analytics layer that pushes events to a custom `window.dataLayer`.
 * v1 does NOT integrate GA4/PostHog. Once they are added, this layer will be
 * mirrored automatically without touching the call sites.
 *
 * Event taxonomy was defined by the analytics-tracking agent.
 */

export const EVENTS = {
  VIEW_COMPANY_HOME: 'view_company_home',
  VIEW_APPLICATION_PAGE: 'view_application_page',
  CLICK_APPLICATION_CARD: 'click_application_card',
  CLICK_INPAGE_NAV: 'click_inpage_nav',
  VIEW_LANDING: 'view_landing', // kept for backwards compatibility
  CLICK_DEMO: 'click_demo',
  COPY_DEMO_CREDENTIALS: 'copy_demo_credentials',
  CLICK_PRICING: 'click_pricing',
  SUBMIT_LEAD: 'submit_lead',
  SUBMIT_LEAD_SUCCESS: 'submit_lead_success',
  SUBMIT_LEAD_ERROR: 'submit_lead_error',
  CLICK_WHATSAPP_FAB: 'click_whatsapp_fab',
  CLICK_WHATSAPP_HERO: 'click_whatsapp_hero',
  CLICK_TELEGRAM: 'click_telegram',
  CLICK_FAQ: 'click_faq',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export type EventProps = Record<string, string | number | boolean | null | undefined>;

type TrackedEvent = EventProps & {
  event: EventName;
  ts: number;
  path: string;
  session_id: string;
};

declare global {
  interface Window {
    dataLayer?: TrackedEvent[];
  }
}

const SESSION_STORAGE_KEY = 'rohu_session_id';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const fresh = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
  return fresh;
}

export function trackEvent(event: EventName, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;
  const payload: TrackedEvent = {
    event,
    ts: Date.now(),
    path: window.location.pathname,
    session_id: getSessionId(),
    ...props,
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', payload);
  }
}
