import { getSupabaseAdmin } from '@/lib/supabase/client';
import { Eye, Heart, Flame, Share2, Image, BookOpen, QrCode } from 'lucide-react';

export const metadata = {
  title: 'Analytics Dashboard - SoulBridge Admin',
  description: 'Platform-wide analytics and insights',
};

export default async function AdminAnalyticsPage() {
  const supabase = getSupabaseAdmin();

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get total analytics by event type
  const { data: totalAnalytics } = await supabase
    .from('memorial_analytics')
    .select('event_type, count')
    .gte('event_date', thirtyDaysAgo);

  // Aggregate analytics by event type
  const analyticsMap: Record<string, number> = {
    view: 0,
    tribute: 0,
    candle: 0,
    share: 0,
    photo: 0,
    guestbook: 0,
    qr_scan: 0,
  };

  totalAnalytics?.forEach((record: any) => {
    if (analyticsMap.hasOwnProperty(record.event_type)) {
      analyticsMap[record.event_type] += record.count;
    }
  });

  // Get daily analytics for last 30 days
  const { data: dailyAnalytics } = await supabase
    .from('memorial_analytics')
    .select('event_date, event_type, count')
    .gte('event_date', thirtyDaysAgo)
    .order('event_date', { ascending: true });

  // Get top memorials by views
  const { data: topMemorials } = await supabase
    .from('memorials')
    .select('id, full_name, slug, view_count, share_count')
    .order('view_count', { ascending: false })
    .limit(10);

  // Get most active users (by number of memorials)
  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('clerk_user_id, email, full_name, memorials(count)')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Platform-wide analytics for the last 30 days
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Views"
          value={analyticsMap.view}
          icon={Eye}
          color="blue"
          description="Memorial page views"
        />
        <AnalyticsCard
          title="Tributes Posted"
          value={analyticsMap.tribute}
          icon={Heart}
          color="rose"
          description="Total tribute messages"
        />
        <AnalyticsCard
          title="Candles Lit"
          value={analyticsMap.candle}
          icon={Flame}
          color="amber"
          description="Virtual candles lit"
        />
        <AnalyticsCard
          title="Shares"
          value={analyticsMap.share}
          icon={Share2}
          color="green"
          description="Memorial shares"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Photos Uploaded"
          value={analyticsMap.photo}
          icon={Image}
          color="purple"
        />
        <MetricCard
          title="Guestbook Entries"
          value={analyticsMap.guestbook}
          icon={BookOpen}
          color="indigo"
        />
        <MetricCard
          title="QR Scans"
          value={analyticsMap.qr_scan}
          icon={QrCode}
          color="cyan"
        />
      </div>

      {/* Top Memorials & Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Memorials */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Memorials by Views
          </h2>
          <div className="space-y-3">
            {topMemorials && topMemorials.length > 0 ? (
              topMemorials.map((memorial, index) => (
                <div
                  key={memorial.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {memorial.full_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        /{memorial.slug}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {memorial.view_count?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
            )}
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Active Users
          </h2>
          <div className="space-y-3">
            {activeUsers && activeUsers.length > 0 ? (
              activeUsers
                .sort((a, b) => {
                  const countA = a.memorials?.[0]?.count || 0;
                  const countB = b.memorials?.[0]?.count || 0;
                  return countB - countA;
                })
                .slice(0, 10)
                .map((user, index) => {
                  const memorialCount = user.memorials?.[0]?.count || 0;
                  return (
                    <div
                      key={user.clerk_user_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {memorialCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">memorials</p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Engagement Summary (Last 30 Days)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryItem label="Total Interactions" value={Object.values(analyticsMap).reduce((a, b) => a + b, 0)} />
          <SummaryItem
            label="Avg. Views/Memorial"
            value={topMemorials && topMemorials.length > 0
              ? Math.round(topMemorials.reduce((sum, m) => sum + (m.view_count || 0), 0) / topMemorials.length)
              : 0}
          />
          <SummaryItem
            label="Total Shares"
            value={topMemorials
              ? topMemorials.reduce((sum, m) => sum + (m.share_count || 0), 0)
              : 0}
          />
          <SummaryItem
            label="Engagement Rate"
            value={`${analyticsMap.view > 0
              ? Math.round(((analyticsMap.tribute + analyticsMap.candle) / analyticsMap.view) * 100)
              : 0}%`}
          />
        </div>
      </div>
    </div>
  );
}

// AnalyticsCard Component
interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'rose' | 'amber' | 'green';
  description: string;
}

function AnalyticsCard({ title, value, icon: Icon, color, description }: AnalyticsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    rose: 'bg-rose-500 dark:bg-rose-600',
    amber: 'bg-amber-500 dark:bg-amber-600',
    green: 'bg-green-500 dark:bg-green-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// MetricCard Component
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'purple' | 'indigo' | 'cyan';
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    purple: 'bg-purple-500 dark:bg-purple-600',
    indigo: 'bg-indigo-500 dark:bg-indigo-600',
    cyan: 'bg-cyan-500 dark:bg-cyan-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// SummaryItem Component
interface SummaryItemProps {
  label: string;
  value: number | string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}
