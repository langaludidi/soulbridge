import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserProfile } from '@clerk/nextjs'
import Link from 'next/link'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Clerk UserProfile Component */}
          <div className="p-6">
            <UserProfile
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none bg-transparent",
                  navbar: "hidden",
                  pageScrollBox: "p-0",
                  profileSection: "border-gray-200 dark:border-gray-700",
                  profileSectionTitle: "text-gray-900 dark:text-white",
                  profileSectionContent: "text-gray-700 dark:text-gray-300",
                  formButtonPrimary:
                    "bg-[#2B3E50] hover:bg-[#243342] text-white normal-case",
                  formFieldInput:
                    "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                  formFieldLabel: "text-gray-700 dark:text-gray-300",
                  identityPreviewText: "text-gray-900 dark:text-white",
                  identityPreviewEditButton: "text-[#2B3E50] dark:text-[#9FB89D]",
                },
                variables: {
                  colorPrimary: "#2B3E50",
                },
              }}
            />
          </div>

          {/* Additional App Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Memorial Settings
            </h2>

            <div className="space-y-4">
              {/* Notification Preferences */}
              <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Receive email updates when someone lights a candle or leaves a tribute on your memorials
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#2B3E50] focus:ring-[#2B3E50] border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Profile Visibility
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Show your name as the memorial creator on public memorials
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#2B3E50] focus:ring-[#2B3E50] border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Tribute Moderation */}
              <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Tribute Moderation
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Require your approval before tributes appear on your memorials
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#2B3E50] focus:ring-[#2B3E50] border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Monthly Reports */}
              <div className="flex items-start justify-between py-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Monthly Reports
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Receive monthly summaries of views, tributes, and engagement on your memorials
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#2B3E50] focus:ring-[#2B3E50] border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors text-sm font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Subscription & Billing
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Current Plan
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and manage your subscription
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-[#2B3E50] dark:text-[#9FB89D] hover:underline"
                >
                  View Plan Details
                </Link>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Upgrade Plan
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get more memorials, photos, and features
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors text-sm font-medium"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/10 p-6">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-4">
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900 dark:text-red-400">
                    Delete Account
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Permanently delete your account and all associated memorials. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-900 dark:text-red-400">
                      Before you delete your account:
                    </h3>
                    <ul className="mt-2 text-sm text-red-800 dark:text-red-300 list-disc list-inside space-y-1">
                      <li>All your memorials will be permanently deleted</li>
                      <li>All uploaded photos, videos, and audio will be removed</li>
                      <li>All tributes and guestbook entries will be lost</li>
                      <li>Your subscription will be cancelled immediately</li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
