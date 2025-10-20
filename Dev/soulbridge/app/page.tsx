import Link from "next/link";
import { auth } from '@clerk/nextjs/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation userId={userId} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Preserve Precious Memories
            <br />
            <span className="bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] bg-clip-text text-transparent">
              Forever
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create beautiful, lasting digital memorials for loved ones. Share memories, stories, and tributes in a safe, compassionate space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {userId ? (
              <Link
                href="/dashboard"
                className="bg-[#2B3E50] text-white hover:bg-[#243342] px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="bg-[#2B3E50] text-white hover:bg-[#243342] px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/sign-in"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors border border-gray-300 dark:border-gray-600"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2B3E50] dark:text-[#9FB89D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Beautiful Memorials
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create stunning digital memorials with photos, videos, and stories that honor your loved ones.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#9FB89D] dark:text-[#bac9b7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Share & Connect
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Invite family and friends to share memories, leave tributes, and celebrate life together.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Private & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Control who can view and contribute to memorials with customizable privacy settings.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
