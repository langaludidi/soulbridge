'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface NavigationProps {
  userId: string | null;
}

export default function Navigation({ userId }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-full.png"
                alt="SoulBridge"
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/browse"
              className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Explore
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="bg-[#2B3E50] text-white hover:bg-[#243342] px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#2B3E50] text-white hover:bg-[#243342] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                href="/features"
                className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/browse"
                className="text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                {userId ? (
                  <Link
                    href="/dashboard"
                    className="block bg-[#2B3E50] text-white hover:bg-[#243342] px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="block text-gray-700 dark:text-gray-300 hover:text-[#2B3E50] dark:hover:text-[#9FB89D] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block bg-[#2B3E50] text-white hover:bg-[#243342] px-3 py-2 rounded-md text-sm font-medium transition-colors mt-2 text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
