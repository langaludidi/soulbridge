import { getSupabaseAdmin } from '@/lib/supabase/client';
import Link from 'next/link';
import { Calendar, Mail, FileText, Crown, Shield } from 'lucide-react';

export const metadata = {
  title: 'User Management - SoulBridge Admin',
  description: 'Manage all users on the platform',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; plan?: string };
}) {
  const supabase = getSupabaseAdmin();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;
  const searchTerm = searchParams.search || '';
  const planFilter = searchParams.plan || '';

  // Build query
  let query = supabase
    .from('profiles')
    .select(
      `
      clerk_user_id,
      email,
      full_name,
      created_at,
      is_admin,
      plans!plans_clerk_user_id_fkey(plan_type, status),
      memorials(count)
    `,
      { count: 'exact' }
    );

  // Apply filters
  if (searchTerm) {
    query = query.or(
      `email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`
    );
  }

  // Execute query
  const { data: users, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Filter by plan type in memory (since we can't easily join/filter on the plan type in the query above)
  let filteredUsers = users || [];
  if (planFilter && users) {
    filteredUsers = users.filter((user: any) => {
      const plan = user.plans?.[0];
      return plan?.plan_type === planFilter;
    });
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all users on the platform
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {count?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <input
            type="text"
            name="search"
            placeholder="Search by name or email..."
            defaultValue={searchTerm}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          />

          {/* Plan Filter */}
          <select
            name="plan"
            defaultValue={planFilter}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          >
            <option value="">All Plans</option>
            <option value="lite">Lite</option>
            <option value="essential">Essential</option>
            <option value="premium">Premium</option>
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

      {/* Users Table */}
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
                  Memorials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => {
                  const plan = user.plans?.[0];
                  const memorialCount = user.memorials?.[0]?.count || 0;

                  return (
                    <tr
                      key={user.clerk_user_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {(user.full_name || user.email)[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.full_name || 'Unknown'}
                            </p>
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {plan ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.plan_type === 'premium'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                : plan.plan_type === 'essential'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {plan.plan_type === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                            {plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No plan</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{memorialCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_admin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">User</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/users/${user.clerk_user_id}`}
                          className="text-[#2B3E50] dark:text-[#9FB89D] hover:underline text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || planFilter
                      ? 'No users found matching your filters'
                      : 'No users yet'}
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
                href={`?page=${page - 1}${searchTerm ? `&search=${searchTerm}` : ''}${
                  planFilter ? `&plan=${planFilter}` : ''
                }`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${searchTerm ? `&search=${searchTerm}` : ''}${
                  planFilter ? `&plan=${planFilter}` : ''
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
