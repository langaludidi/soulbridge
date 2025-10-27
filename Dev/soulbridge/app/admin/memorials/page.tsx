import { getSupabaseAdmin } from '@/lib/supabase/client';
import Link from 'next/link';
import { Eye, Edit, ExternalLink, Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Memorial Management - SoulBridge Admin',
  description: 'Manage all memorials on the platform',
};

export default async function AdminMemorialsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; visibility?: string };
}) {
  const supabase = getSupabaseAdmin();
  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const offset = (page - 1) * pageSize;
  const searchTerm = searchParams.search || '';
  const visibilityFilter = searchParams.visibility || '';

  // Build query
  let query = supabase
    .from('memorials')
    .select(
      `
      id,
      full_name,
      slug,
      created_at,
      visibility,
      view_count,
      share_count,
      profiles!memorials_clerk_user_id_fkey(email, full_name)
    `,
      { count: 'exact' }
    );

  // Apply filters
  if (searchTerm) {
    query = query.ilike('full_name', `%${searchTerm}%`);
  }

  if (visibilityFilter) {
    query = query.eq('visibility', visibilityFilter);
  }

  // Execute query
  const { data: memorials, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Memorial Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all memorials on the platform
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {count?.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Memorials</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            defaultValue={searchTerm}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          />

          {/* Visibility Filter */}
          <select
            name="visibility"
            defaultValue={visibilityFilter}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2B3E50] dark:focus:ring-[#9FB89D] focus:border-transparent"
          >
            <option value="">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
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

      {/* Memorials Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Memorial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {memorials && memorials.length > 0 ? (
                memorials.map((memorial: any) => (
                  <tr
                    key={memorial.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {memorial.full_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /{memorial.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {memorial.profiles?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {memorial.profiles?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(memorial.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          memorial.visibility === 'public'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : memorial.visibility === 'private'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {memorial.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{memorial.view_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="w-4 h-4" />
                          <span>{memorial.share_count || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/${memorial.slug || `memorials/${memorial.id}`}`}
                          target="_blank"
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] transition-colors"
                          title="View memorial"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/memorials/${memorial.id}/edit`}
                          target="_blank"
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] transition-colors"
                          title="Edit memorial"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || visibilityFilter
                      ? 'No memorials found matching your filters'
                      : 'No memorials yet'}
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
                  visibilityFilter ? `&visibility=${visibilityFilter}` : ''
                }`}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${searchTerm ? `&search=${searchTerm}` : ''}${
                  visibilityFilter ? `&visibility=${visibilityFilter}` : ''
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
