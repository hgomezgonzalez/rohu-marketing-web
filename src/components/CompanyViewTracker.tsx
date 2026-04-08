'use client';

import { useEffect } from 'react';
import { trackEvent, EVENTS } from '@/lib/analytics';

/**
 * Fires the view_company_home event once per session.
 * Mounted at the top of the corporate home page only.
 */
export function CompanyViewTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackEvent(EVENTS.VIEW_COMPANY_HOME, {
      referrer: document.referrer || null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    });
  }, []);

  return null;
}
