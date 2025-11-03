import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default async function AboutPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation userId={userId} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About SoulBridge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connecting hearts across time through the power of memory
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-24">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block mb-3">
                  <span className="text-[#2B3E50] dark:text-[#9FB89D] font-semibold uppercase tracking-wider text-sm">
                    Our Purpose
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Every Life Deserves to be Remembered
                </h2>

                <div className="space-y-6">
                  <p className="text-xl text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                    We believe every life tells a story worth preserving.
                  </p>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    SoulBridge exists to help African families honor their loved ones with dignity, create lasting digital memorials, and keep precious memories alive for generations to come.
                  </p>

                  <div className="border-l-4 border-[#9FB89D] pl-6 py-2 my-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      Grief is deeply personal. We walk with you, offering a platform designed with compassion, respect, and cultural sensitivity.
                    </p>
                  </div>

                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Our mission is simple: transform how we remember and celebrate those we&apos;ve lost, creating a digital legacy that brings comfort, connection, and peace to families across South Africa and beyond.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-stone-100 dark:from-gray-800 dark:to-gray-900 p-0 flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-[600px]">
                <img
                  src="/images/soulbridgenov.png"
                  alt="Memorial elements with wooden cross, candles, and peaceful arrangement"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#2B3E50] dark:text-[#9FB89D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Compassion
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We approach every memorial with sensitivity, understanding the profound importance of honoring a loved one.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#9FB89D] dark:text-[#bac9b7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Respect
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every life is unique and deserves to be celebrated with dignity and reverence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Connection
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We believe in bringing families and communities together through shared memories and tributes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Simplicity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating a memorial should be easy and intuitive, allowing you to focus on what matters most.
              </p>
            </div>
          </div>
        </div>

        {/* Why SoulBridge Section */}
        <div className="mb-24">
          <div className="bg-gradient-to-r from-[#2B3E50] to-[#9FB89D] rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Why Choose SoulBridge?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold mb-2">African-Centered Approach</h3>
                  <p className="text-indigo-100">
                    Designed with South African families in mind, honoring our diverse cultures and traditions.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Affordable & Accessible</h3>
                  <p className="text-indigo-100">
                    One-time payments with no hidden fees or recurring subscriptions. Start for free.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mobile-First Design</h3>
                  <p className="text-indigo-100">
                    Beautiful, fast, and easy to use on any device - perfect for sharing with family.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Privacy & Control</h3>
                  <p className="text-indigo-100">
                    You decide who can view and contribute. Full moderation and privacy controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section (Can be expanded later) */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Commitment
          </h2>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-lg">
              We&apos;re committed to providing a platform that honors the dignity of every life and supports families during their most difficult moments.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Our team is dedicated to continuous improvement, listening to feedback, and ensuring that SoulBridge remains a trusted, compassionate space for remembrance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#9FB89D] to-[#bac9b7] rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Creating a Memorial Today
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Honor your loved one with a beautiful digital memorial. Get started for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={userId ? "/dashboard" : "/sign-up"}
              className="bg-white text-[#9FB89D] hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg"
            >
              Create Free Memorial
            </Link>
            <Link
              href="/features"
              className="bg-[#556d53] text-white hover:bg-[#445744] px-8 py-3 rounded-lg text-lg font-medium transition-colors border-2 border-white/20"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
