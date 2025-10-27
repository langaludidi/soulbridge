'use client';

import { useCallback } from 'react';

export type AnalyticsEventType =
  | 'view'
  | 'tribute'
  | 'candle'
  | 'share'
  | 'photo'
  | 'guestbook'
  | 'qr_scan';

interface TrackEventParams {
  memorialId: string;
  eventType: AnalyticsEventType;
  referrer?: string;
  userAgent?: string;
  country?: string;
  city?: string;
}

/**
 * Hook for tracking analytics events
 * Records events to memorial_analytics table via POST /api/analytics
 */
export function useAnalytics() {
  const trackEvent = useCallback(async (params: TrackEventParams) => {
    try {
      const { memorialId, eventType, referrer, userAgent, country, city } = params;

      // Get referrer and user agent from browser if not provided
      const finalReferrer = referrer || document.referrer || 'direct';
      const finalUserAgent = userAgent || navigator.userAgent;

      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memorial_id: memorialId,
          event_type: eventType,
          referrer: finalReferrer,
          user_agent: finalUserAgent,
          country: country || null,
          city: city || null,
        }),
      });

      if (!response.ok) {
        console.error('Failed to track analytics event:', await response.text());
      }
    } catch (error) {
      // Silently fail - analytics tracking should not break user experience
      console.error('Analytics tracking error:', error);
    }
  }, []);

  /**
   * Track a memorial page view
   */
  const trackView = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'view' });
    },
    [trackEvent]
  );

  /**
   * Track a tribute post
   */
  const trackTribute = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'tribute' });
    },
    [trackEvent]
  );

  /**
   * Track a candle lighting
   */
  const trackCandle = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'candle' });
    },
    [trackEvent]
  );

  /**
   * Track a share action
   */
  const trackShare = useCallback(
    (memorialId: string, platform?: string) => {
      trackEvent({
        memorialId,
        eventType: 'share',
        referrer: platform ? `share:${platform}` : 'share:unknown'
      });
    },
    [trackEvent]
  );

  /**
   * Track a photo upload
   */
  const trackPhoto = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'photo' });
    },
    [trackEvent]
  );

  /**
   * Track a guestbook entry
   */
  const trackGuestbook = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'guestbook' });
    },
    [trackEvent]
  );

  /**
   * Track a QR code scan
   */
  const trackQRScan = useCallback(
    (memorialId: string) => {
      trackEvent({ memorialId, eventType: 'qr_scan' });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackView,
    trackTribute,
    trackCandle,
    trackShare,
    trackPhoto,
    trackGuestbook,
    trackQRScan,
  };
}
