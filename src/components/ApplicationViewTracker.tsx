'use client';

import { useEffect } from 'react';
import { trackEvent, EVENTS } from '@/lib/analytics';

type Props = {
  applicationId: string;
};

/**
 * Fires the view_application_page event once per session per application.
 * Mounted at the top of the product page only.
 */
export function ApplicationViewTracker({ applicationId }: Props) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackEvent(EVENTS.VIEW_APPLICATION_PAGE, {
      application_id: applicationId,
      referrer: document.referrer || null,
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    });
  }, [applicationId]);

  return null;
}
