import { getSupabaseAdmin } from '@/lib/supabase/client';
import Link from 'next/link';
import { Crown, Calendar, DollarSign, User, CheckCircle, XCircle, Clock } from 'lucide-react';

export const metadata = {
  title: 'Subscription Management - SoulBridge Admin',
  description: 'Manage all subscriptions and plans',
};

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: { page?: string; plan?: string; status?: string };
}) {
  const supabase = getSupabaseAdmin();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;
  const planFilter = searchParams.plan || '';
  const statusFilter = searchParams.status || '';

  // Build query
  let query = supabase
    .from('plans')
    .select(
      `
      id,
      plan_type,
      status,
      start_date,
      end_date,
      price,
      billing_cycle,
      profiles!plans_clerk_user_id_fkey(clerk_user_id, email, full_name)
    `,
      { count: 'exact' }
    );

  // Apply filters
  if (planFilter) {
    query = query.eq('plan_type', planFilter);
  }

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  // Execute query
  const { data: subscriptions, count, error } = await query
    .order('start_date', { ascending: false })
    .range(offset, offset + pageSize - 1);

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  // Get subscription stats
  const { data: stats } = await supabase
    .from('plans')
    .select('plan_type, status');

  const statsMap = {
    total: stats?.length || 0,
    active: stats?.filter((s) => s.status === 'active').length || 0,
    lite: stats?.filter((s) => s.plan_type === 'lite').length || 0,
    essential: stats?.filter((s) => s.plan_type === 'essential').length || 0,
    premium: stats?.filter((s) => s.plan_type === 'premium').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all subscription plans
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Plans" value={statsMap.total} color="gray" />
        <StatCard title="Active" value={statsMap.active} color="green" />
        <StatCard title="Lite" value={statsMap.lite} color="blue" />
        <StatCard title="Essential" value={statsMap.essential} color="purple" />
        <StatCard title="Premium" value={statsMap.premium} color="amber" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          {/* Plan Filter */}
          <select
            name="plan"
            defaultValue={planFilter}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          >
            <option value="">All Plans</option>
            <option value="lite">Lite</option>
            <option value="essential">Essential</option>
            <option value="premium">Premium</option>
          </select>

          {/* Status Filter */}
          <select
            name="status"
            defaultValue={statusFilter}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-[#2B3E50] hover:bg-[#243342] text-white rounded-lg transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {subscriptions && subscriptions.length > 0 ? (
                subscriptions.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {sub.profiles?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sub.profiles?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {sub.plan_type === 'premium' && <Crown className="w-4 h-4 text-amber-500" />}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sub.plan_type === 'premium'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : sub.plan_type === 'essential'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {sub.plan_type.charAt(0).toUpperCase() + sub.plan_type.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : sub.status === 'cancelled' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {sub.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(sub.start_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.end_date ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(sub.end_date).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No end date</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {sub.price && sub.price > 0 ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white font-medium">
                          <DollarSign className="w-4 h-4" />
                          <span>R{sub.price}/{sub.billing_cycle}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/users/${sub.profiles?.clerk_user_id}`}
                        className="text-[#2B3E50] dark:text-[#9FB89D] hover:underline text-sm font-medium"
                      >
                        View User
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {planFilter || statusFilter
                      ? 'No subscriptions found matching your filters'
                      : 'No subscriptions yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex space-x-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}${planFilter ? `&plan=${planFilter}` : ''}${
                  statusFilter ? `&status=${statusFilter}` : ''
                }`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${planFilter ? `&plan=${planFilter}` : ''}${
                  statusFilter ? `&status=${statusFilter}` : ''
                }`}
                className="px-4 py-2 bg-[#2B3E50] hover:bg-[#243342] text-white rounded-lg transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  color: 'gray' | 'green' | 'blue' | 'purple' | 'amber';
}

function StatCard({ title, value, color }: StatCardProps) {
  const colorClasses = {
    gray: 'bg-gray-500 dark:bg-gray-600',
    green: 'bg-green-500 dark:bg-green-600',
    blue: 'bg-blue-500 dark:bg-blue-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    amber: 'bg-amber-500 dark:bg-amber-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${colorClasses[color]} w-2 h-12 rounded-full`}></div>
      </div>
    </div>
  );
}
