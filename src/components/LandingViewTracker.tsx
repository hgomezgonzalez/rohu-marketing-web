'use client';

import { useEffect } from 'react';
import { trackEvent, EVENTS } from '@/lib/analytics';

/**
 * Fires the view_landing event exactly once per session (handled by analytics).
 * Mounted inside the landing page only.
 */
export function LandingViewTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackEvent(EVENTS.VIEW_LANDING, {
      referrer: document.referrer || null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    });
  }, []);

  return null;
}
