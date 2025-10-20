'use client';

import { useState } from 'react';

interface BiographySectionProps {
  biography: string;
  obituary?: string | null;
}

export default function BiographySection({ biography, obituary }: BiographySectionProps) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [obExpanded, setObExpanded] = useState(false);

  // Check if biography is longer than 300 characters
  const bioIsLong = biography.length > 300;
  const obIsLong = obituary && obituary.length > 300;

  const bioPreview = bioIsLong ? biography.slice(0, 300) + '...' : biography;
  const obPreview = obIsLong ? obituary.slice(0, 300) + '...' : obituary;

  return (
    <>
      {/* Biography */}
      {biography && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Life Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {bioExpanded || !bioIsLong ? biography : bioPreview}
            </p>
          </div>
          {bioIsLong && (
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="mt-4 text-[#2B3E50] dark:text-[#9FB89D] hover:text-[#243342] dark:hover:text-[#9FB89D] font-medium text-sm flex items-center gap-1"
            >
              {bioExpanded ? (
                <>
                  <span>Show less</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Read more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Obituary */}
      {obituary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Obituary
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {obExpanded || !obIsLong ? obituary : obPreview}
            </p>
          </div>
          {obIsLong && (
            <button
              onClick={() => setObExpanded(!obExpanded)}
              className="mt-4 text-[#2B3E50] dark:text-[#9FB89D] hover:text-[#243342] dark:hover:text-[#9FB89D] font-medium text-sm flex items-center gap-1"
            >
              {obExpanded ? (
                <>
                  <span>Show less</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Read more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
}
