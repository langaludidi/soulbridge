'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [memorial, setMemorial] = useState<any>(null);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      fetchAnalytics(p.id);
      fetchMemorial(p.id);
    });
  }, [params]);

  const fetchMemorial = async (memorialId: string) => {
    try {
      const response = await fetch(`/api/memorials/${memorialId}`);
      const data = await response.json();

      if (response.ok) {
        setMemorial(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching memorial:', err);
    }
  };

  const fetchAnalytics = async (memorialId: string) => {
    try {
      const response = await fetch(`/api/analytics?memorial_id=${memorialId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setStats(data.data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <Link
            href={`/memorials/${id}`}
            className="mt-4 inline-block text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D]"
          >
            ← Back to Memorial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/memorials/${id}`}
            className="text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D] text-sm mb-4 inline-flex items-center"
          >
            ← Back to Memorial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Memorial Analytics
          </h1>
          {memorial && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {memorial.full_name}
            </p>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Views
            </div>
            <div className="text-3xl font-bold text-[#2B3E50] dark:text-[#9FB89D]">
              {stats?.total_views || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Tributes
            </div>
            <div className="text-3xl font-bold text-[#9FB89D] dark:text-[#bac9b7]">
              {stats?.total_tributes || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Candles
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats?.total_candles || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Shares
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.total_shares || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Photos
            </div>
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {stats?.total_photos || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Guestbook
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.total_guestbook || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              QR Scans
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
              {stats?.total_qr_scans || 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Interactions
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {(stats?.total_views || 0) +
               (stats?.total_tributes || 0) +
               (stats?.total_candles || 0) +
               (stats?.total_shares || 0) +
               (stats?.total_photos || 0) +
               (stats?.total_guestbook || 0) +
               (stats?.total_qr_scans || 0)}
            </div>
          </div>
        </div>

        {/* Activity by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Activity Breakdown
          </h2>
          <div className="space-y-4">
            {stats?.by_type && Object.entries(stats.by_type).map(([type, count]: [string, any]) => {
              const percentage = stats.total_views > 0
                ? Math.round((count / (stats.total_views || 1)) * 100)
                : 0;

              const typeLabels: Record<string, string> = {
                view: 'Views',
                tribute: 'Tributes',
                candle: 'Candles',
                share: 'Shares',
                photo: 'Photos',
                guestbook: 'Guestbook Entries',
                qr_scan: 'QR Code Scans',
              };

              const typeColors: Record<string, string> = {
                view: 'bg-[#2B3E50]',
                tribute: 'bg-[#9FB89D]',
                candle: 'bg-amber-600',
                share: 'bg-green-600',
                photo: 'bg-pink-600',
                guestbook: 'bg-blue-600',
                qr_scan: 'bg-cyan-600',
              };

              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {typeLabels[type] || type}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${typeColors[type] || 'bg-gray-600'} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity by Date */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          {stats?.by_date && Object.keys(stats.by_date).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Interactions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(stats.by_date)
                    .slice(0, 30)
                    .map(([date, events]: [string, any]) => {
                      const totalInteractions = Object.values(events).reduce(
                        (sum: number, count: any) => sum + (count || 0),
                        0
                      ) as number;

                      return (
                        <tr key={date}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {events.view || 0}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {totalInteractions}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No activity data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
