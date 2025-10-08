/**
 * Visitor Statistics Panel
 * Displays memorial engagement metrics: views, candles, flowers, messages
 */

'use client';

import { useEffect, useState } from 'react';
import { Eye, Flame, Flower, MessageCircle } from 'lucide-react';

interface Statistics {
  views: number;
  candles: number;
  flowers: number;
  messages: number;
}

interface VisitorStatisticsProps {
  memorialId: string;
}

export function VisitorStatistics({ memorialId }: VisitorStatisticsProps) {
  const [stats, setStats] = useState<Statistics>({
    views: 0,
    candles: 0,
    flowers: 0,
    messages: 0,
  });

  useEffect(() => {
    loadStatistics();
    trackView();
  }, [memorialId]);

  const loadStatistics = async () => {
    try {
      const response = await fetch(`/api/memorial/${memorialId}/statistics`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const trackView = async () => {
    try {
      await fetch(`/api/memorial/${memorialId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const statItems = [
    {
      icon: Eye,
      label: 'Views',
      value: stats.views,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Flame,
      label: 'Candles',
      value: stats.candles,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Flower,
      label: 'Flowers',
      value: stats.flowers,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      value: stats.messages,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Memorial Activity</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`${item.bgColor} rounded-lg p-4 text-center transition-transform hover:scale-105`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-2`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
