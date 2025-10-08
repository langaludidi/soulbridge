/**
 * DonationSection Component
 * Memorial donation section with CTA
 * Clean design matching reference
 */

'use client';

import { Heart } from 'lucide-react';
import type { Donation } from '@/types/memorial';

interface DonationSectionProps {
  donation: Donation;
}

export function DonationSection({ donation }: DonationSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Make a Donation
          </h3>
          <p className="text-gray-700 mb-4">
            Please consider making a contribution in {donation.organization}'s memory
          </p>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <p className="font-semibold text-gray-900 mb-1">
              {donation.organization}
            </p>
            {donation.description && (
              <p className="text-sm text-gray-600">
                {donation.description}
              </p>
            )}
          </div>

          {donation.link ? (
            <a
              href={donation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Donate Now
            </a>
          ) : (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              Donate Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
