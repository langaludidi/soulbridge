'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Memorial {
  id: string;
  full_name: string;
  date_of_birth: string;
  date_of_death: string;
  place_of_birth: string | null;
  place_of_death: string | null;
  biography: string | null;
  view_count: number;
  tribute_count: number;
  status: string;
}

export default function BrowsePage() {
  const router = useRouter();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMemorials, setFilteredMemorials] = useState<Memorial[]>([]);

  useEffect(() => {
    fetchMemorials();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMemorials(memorials);
    } else {
      const filtered = memorials.filter(memorial =>
        memorial.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memorial.place_of_birth?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memorial.place_of_death?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMemorials(filtered);
    }
  }, [searchTerm, memorials]);

  const fetchMemorials = async () => {
    try {
      const response = await fetch('/api/browse');
      const data = await response.json();
      if (response.ok) {
        setMemorials(data.data || []);
        setFilteredMemorials(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching memorials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Browse Memorials
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover and honor cherished memories
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-[#2B3E50] hover:text-[#243342] dark:text-[#9FB89D] text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {filteredMemorials.length} memorial{filteredMemorials.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading memorials...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMemorials.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No memorials found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Be the first to create a memorial'}
            </p>
          </div>
        )}

        {/* Memorial Grid */}
        {!loading && filteredMemorials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemorials.map((memorial) => (
              <Link
                key={memorial.id}
                href={memorial.slug ? `/${memorial.slug}` : `/memorials/${memorial.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {memorial.full_name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {new Date(memorial.date_of_birth).getFullYear()} - {new Date(memorial.date_of_death).getFullYear()}
                  </p>

                  {memorial.biography && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {memorial.biography}
                    </p>
                  )}

                  {(memorial.place_of_birth || memorial.place_of_death) && (
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      {memorial.place_of_birth && (
                        <p>📍 Born in {memorial.place_of_birth}</p>
                      )}
                      {memorial.place_of_death && (
                        <p>📍 Passed in {memorial.place_of_death}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>{memorial.view_count} views</span>
                    <span>{memorial.tribute_count} tributes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
