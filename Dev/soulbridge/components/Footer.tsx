import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SoulBridge
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Preserving memories with love and respect. Create beautiful digital memorials to honor the lives of those you cherish.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} SoulBridge. All rights reserved.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  Explore
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-sm transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-500 text-xs text-center md:text-left">
              Honoring lives, preserving memories.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Social Links - Can be added later */}
              <a
                href="mailto:info@soulbridge.co.za"
                className="text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-[#9FB89D] text-xs transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
