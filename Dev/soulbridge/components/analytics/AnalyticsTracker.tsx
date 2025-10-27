'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface AnalyticsTrackerProps {
  memorialId: string;
  /**
   * Track view event on mount
   * @default true
   */
  trackView?: boolean;
}

/**
 * Client component that tracks analytics events
 * Use this component in Server Components to track page views
 */
export default function AnalyticsTracker({
  memorialId,
  trackView = true,
}: AnalyticsTrackerProps) {
  const { trackView: trackViewEvent } = useAnalytics();

  useEffect(() => {
    if (trackView && memorialId) {
      // Track view event once when component mounts
      trackViewEvent(memorialId);
    }
  }, [memorialId, trackView, trackViewEvent]);

  // This component renders nothing
  return null;
}
