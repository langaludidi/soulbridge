/**
 * Recent Activity Feed
 * Shows recent candles, memories, RSVPs in time-sorted feed
 */

'use client';

import { useEffect, useState } from 'react';
import { Flame, MessageSquare, UserCheck, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'candle' | 'memory' | 'rsvp';
  userName: string;
  message?: string;
  serviceName?: string;
  timestamp: string;
}

interface RecentActivityProps {
  memorialId: string;
}

export function RecentActivity({ memorialId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, [memorialId]);

  const loadRecentActivity = async () => {
    try {
      const response = await fetch(`/api/memorial/${memorialId}/activity`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'candle':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'memory':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'rsvp':
        return <UserCheck className="w-5 h-5 text-delft-blue" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'candle':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> lit a candle
            {activity.message && (
              <span className="text-gray-600 text-sm block mt-1">"{activity.message}"</span>
            )}
          </>
        );
      case 'memory':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> shared a memory
            {activity.message && (
              <span className="text-gray-600 text-sm block mt-1 line-clamp-2">"{activity.message}"</span>
            )}
          </>
        );
      case 'rsvp':
        return (
          <>
            <span className="font-semibold">{activity.userName}</span> will attend
            {activity.serviceName && (
              <span className="text-gray-600 text-sm block mt-1">{activity.serviceName}</span>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>No recent activity yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-gray-900">
                  {getActivityText(activity)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length > 5 && (
        <button className="w-full mt-4 text-sm text-delft-blue hover:text-delft-blue-600 font-medium transition-colors">
          View All Activity
        </button>
      )}
    </div>
  );
}
