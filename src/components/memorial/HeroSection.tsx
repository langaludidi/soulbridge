/**
 * HeroSection Component
 * Clean, professional hero section with cover image and portrait
 * Supports 60+ beautiful themes and custom backgrounds
 */

'use client';

import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import type { Memorial } from '@/types/memorial';

interface HeroSectionProps {
  memorial: Pick<Memorial, 'name' | 'birthDate' | 'deathDate' | 'birthPlace' | 'deathPlace' | 'portrait' | 'coverImage'>;
}

export function HeroSection({ memorial }: HeroSectionProps) {
  const { currentTheme, customBackground } = useTheme();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate: string, deathDate: string) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Determine background source
  const backgroundSource = customBackground || memorial.coverImage || currentTheme.preview;
  const hasGradient = !customBackground && !memorial.coverImage && currentTheme.gradient;
  const hasSolidColor = !customBackground && !memorial.coverImage && currentTheme.color;

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background with theme support - more subtle */}
      <div className="absolute inset-0 opacity-10">
        {backgroundSource ? (
          <Image
            src={backgroundSource}
            alt="Background"
            fill
            className="object-cover"
          />
        ) : hasGradient ? (
          <div
            className="w-full h-full"
            style={{ background: currentTheme.gradient }}
          />
        ) : hasSolidColor ? (
          <div
            className="w-full h-full"
            style={{ backgroundColor: currentTheme.color }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />
        )}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Two-column layout: Portrait left, Info right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Portrait (5 columns) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden ring-[12px] ring-white shadow-2xl">
              {memorial.portrait ? (
                <Image
                  src={memorial.portrait}
                  alt={memorial.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-8xl md:text-9xl text-white font-bold">
                    {memorial.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Information (7 columns) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {memorial.name}
              </h1>

              <div className="text-lg md:text-xl text-gray-600 space-y-2">
                <p className="font-medium">
                  {formatDate(memorial.birthDate)} — {formatDate(memorial.deathDate)}
                </p>
                <p className="text-base text-gray-500">
                  {calculateAge(memorial.birthDate, memorial.deathDate)} years
                </p>
              </div>
            </div>

            {(memorial.birthPlace || memorial.deathPlace) && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-base text-gray-600">
                  {memorial.birthPlace && memorial.deathPlace
                    ? `${memorial.birthPlace} • ${memorial.deathPlace}`
                    : memorial.birthPlace || memorial.deathPlace}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
