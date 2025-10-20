'use client';

interface StickyActionBarProps {
  memorial: {
    profile_image_url: string | null;
    full_name: string;
    allow_candles: boolean;
    allow_tributes: boolean;
  };
  dateRange: string;
}

export default function StickyActionBar({ memorial, dateRange }: StickyActionBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Profile Picture & Name */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            {memorial.profile_image_url && (
              <img
                src={memorial.profile_image_url}
                alt={memorial.full_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2B3E50] flex-shrink-0"
              />
            )}
            <div className="min-w-0 hidden sm:block">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {memorial.full_name}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {dateRange}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <a
              href="#share"
              className="inline-flex items-center px-3 py-1.5 bg-[#2B3E50] text-white rounded-lg hover:bg-[#243342] transition-colors text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </a>
            {memorial.allow_candles && (
              <a
                href="#candles"
                className="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5 sm:mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                </svg>
                <span className="hidden sm:inline">Candle</span>
              </a>
            )}
            {memorial.allow_tributes && (
              <a
                href="#tributes"
                className="inline-flex items-center px-3 py-1.5 bg-[#9FB89D] text-white rounded-lg hover:bg-[#84a182] transition-colors text-xs font-medium"
              >
                <svg className="w-3.5 h-3.5 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Tribute</span>
              </a>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
