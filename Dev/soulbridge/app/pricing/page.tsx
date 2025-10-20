import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation userId={userId} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for you. One-time payment, no monthly subscriptions.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Lite (Free) Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Lite
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">Free</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Perfect for creating your first memorial
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  1 memorial
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Up to 5 photos
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Classic theme only
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Timeline & Tribute Wall
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Virtual candles
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Order of Service PDF
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  QR code & link sharing
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Basic analytics
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                  Audio & video uploads
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                  Explore listing
                </span>
              </li>
            </ul>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <strong>Hosted for:</strong> 3 months
            </div>

            <Link
              href={userId ? "/dashboard" : "/sign-up"}
              className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Essential Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-[#2B3E50] relative transform scale-105">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Essential
              </h3>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">R 150</span>
              </div>
              <p className="text-sm text-[#2B3E50] dark:text-[#9FB89D] mb-2">
                Introductory price - limited time
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                One-time payment, no subscription
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 3 memorials</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Up to 30 photos per memorial
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 10 audio files</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 10 videos</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Classic + Modern themes
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  All features from Lite
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Explore listing</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Enhanced analytics (30 days)
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Email support
                </span>
              </li>
            </ul>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <strong>Hosted for:</strong> 6 months
            </div>

            <Link
              href={userId ? "/checkout?plan=essential" : "/sign-up?redirect_url=/checkout?plan=essential"}
              className="block w-full text-center bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] text-white hover:from-indigo-700 hover:to-purple-700 px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Get Essential
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Premium
              </h3>
              <div className="flex items-baseline mb-2">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">R 600</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                One-time payment, renewable yearly
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 10 memorials</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 200 photos</strong> per memorial
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 30 audio files</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Up to 30 videos</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>All themes</strong> (Classic, Modern, Traditional, Ubuntu)
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  All features from Essential
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Advanced analytics + PDF export</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Priority email support</strong>
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Future WhatsApp support
                </span>
              </li>
            </ul>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <strong>Hosted for:</strong> 12 months
              <br />
              <span className="text-xs">Renewable at R100/year</span>
            </div>

            <Link
              href={userId ? "/checkout?plan=premium" : "/sign-up?redirect_url=/checkout?plan=premium"}
              className="block w-full text-center bg-gradient-to-r from-[#9FB89D] to-[#bac9b7] text-white hover:from-[#84a182] hover:to-[#9FB89D] px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Get Premium
            </Link>
          </div>
        </div>

        {/* Comparison Table (Desktop) */}
        <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Lite (Free)
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/20">
                    Essential
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Price
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Free
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    <strong>R 150</strong><br />
                    <span className="text-xs text-[#2B3E50] dark:text-[#9FB89D]">intro once-off</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    <strong>R 600</strong><br />
                    <span className="text-xs">once-off</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    # of Memorials
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    1
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Up to 3
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Up to 10
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Photo uploads per memorial
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Up to 5
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Up to 30
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Up to 200
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Audio uploads per memorial
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-400">
                    —
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Up to 10
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Up to 30
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Video uploads per memorial
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-400">
                    —
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Up to 10
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Up to 30
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Available Themes
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Classic only
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Classic + Modern
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    All (4 themes)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Timeline, Tribute Wall, Candles
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Order of Service PDF
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Explore Listing
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center bg-indigo-50 dark:bg-indigo-900/20">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Analytics
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Basic totals only
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Totals + last 30 days
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    30 days + PDF export
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Hosting Duration
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    3 months
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    6 months
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    12 months (renewable)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    Support
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    FAQ / self-service
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20">
                    Email support
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    Priority email
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade my plan later?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade from Lite to Essential or Premium at any time. You&apos;ll only pay the difference.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What happens after my hosting period ends?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                For Lite and Essential plans, you&apos;ll be notified before the end of your hosting period and given the option to upgrade or renew. Premium plans can be renewed for R100/year.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is the introductory Essential price permanent?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The R150 introductory price is available for a limited time. Once you purchase, that&apos;s your price - even if it increases for new users later.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel and get a refund?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 14-day money-back guarantee on Essential and Premium plans if you&apos;re not satisfied.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
