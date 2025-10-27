import { getSupabaseAdmin } from '@/lib/supabase/client';
import { Users, FileText, Heart, Eye, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Overview - SoulBridge',
  description: 'SoulBridge Admin Dashboard Overview',
};

export default async function AdminOverviewPage() {
  // Fetch dashboard statistics
  const supabase = getSupabaseAdmin();

  // Get stats from admin_dashboard_stats view
  const { data: stats } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single();

  // Get recent memorials
  const { data: recentMemorials } = await supabase
    .from('memorials')
    .select('id, full_name, created_at, visibility, slug')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('clerk_user_id, email, full_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get recent activity logs
  const { data: recentActivity } = await supabase
    .from('admin_activity_logs')
    .select('id, action, created_at, target_type, admin_clerk_id')
    .order('created_at', { ascending: false })
    .limit(10);

  const dashboardStats = stats || {
    total_users: 0,
    new_users_30d: 0,
    total_memorials: 0,
    new_memorials_30d: 0,
    total_tributes: 0,
    total_candles: 0,
    paid_subscriptions: 0,
    total_views_30d: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to the SoulBridge admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={dashboardStats.total_users}
          subtitle={`${dashboardStats.new_users_30d} new this month`}
          icon={Users}
          color="blue"
          href="/admin/users"
        />
        <StatCard
          title="Memorials"
          value={dashboardStats.total_memorials}
          subtitle={`${dashboardStats.new_memorials_30d} new this month`}
          icon={FileText}
          color="purple"
          href="/admin/memorials"
        />
        <StatCard
          title="Paid Plans"
          value={dashboardStats.paid_subscriptions}
          subtitle="Active subscriptions"
          icon={DollarSign}
          color="green"
          href="/admin/subscriptions"
        />
        <StatCard
          title="Total Views"
          value={dashboardStats.total_views_30d}
          subtitle="Last 30 days"
          icon={Eye}
          color="amber"
          href="/admin/analytics"
        />
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EngagementCard
          title="Tributes"
          value={dashboardStats.total_tributes}
          icon={Heart}
          color="rose"
        />
        <EngagementCard
          title="Candles Lit"
          value={dashboardStats.total_candles}
          icon={TrendingUp}
          color="yellow"
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Memorials */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Memorials
            </h2>
            <Link
              href="/admin/memorials"
              className="text-sm text-[#2B3E50] dark:text-[#9FB89D] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentMemorials && recentMemorials.length > 0 ? (
              recentMemorials.map((memorial) => (
                <div
                  key={memorial.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <Link
                      href={`/${memorial.slug || `memorials/${memorial.id}`}`}
                      target="_blank"
                      className="font-medium text-gray-900 dark:text-white hover:text-[#2B3E50] dark:hover:text-[#9FB89D]"
                    >
                      {memorial.full_name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(memorial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      memorial.visibility === 'public'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {memorial.visibility}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent memorials</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-[#2B3E50] dark:text-[#9FB89D] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.clerk_user_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  color: 'blue' | 'purple' | 'green' | 'amber';
  href: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color, href }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    green: 'bg-green-500 dark:bg-green-600',
    amber: 'bg-amber-500 dark:bg-amber-600',
  };

  return (
    <Link href={href}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// EngagementCard Component
interface EngagementCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'rose' | 'yellow';
}

function EngagementCard({ title, value, icon: Icon, color }: EngagementCardProps) {
  const colorClasses = {
    rose: 'bg-rose-500 dark:bg-rose-600',
    yellow: 'bg-yellow-500 dark:bg-yellow-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
