/**
 * MemorialPageClient Component
 * Client-side wrapper with theme system and floating navigation
 */

'use client';

import { useState } from 'react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { HeroSection } from '@/components/memorial/HeroSection';
import { FloatingNavigation } from '@/components/memorial/FloatingNavigation';
import { FloatingShareButton } from '@/components/memorial/FloatingShareButton';
import { ThemeSelector } from '@/components/memorial/ThemeSelector';
import { ObituarySection } from '@/components/memorial/ObituarySection';
import { ServicesSection } from '@/components/memorial/ServicesSection';
import { PhotoGallery } from '@/components/memorial/PhotoGallery';
import { MemoryWallSection } from '@/components/memorial/MemoryWallSection';
import { FamilyTreeSection } from '@/components/memorial/FamilyTreeSection';
import { Timeline } from '@/components/memorial/Timeline';
import { VirtualCandles } from '@/components/memorial/VirtualCandles';
import { VisitorStatistics } from '@/components/memorial/VisitorStatistics';
import { RecentActivity } from '@/components/memorial/RecentActivity';
import { ContactOwnerButton } from '@/components/memorial/ContactOwnerButton';
import { EmailSubscription } from '@/components/memorial/EmailSubscription';
import { uploadThemeImage } from '@/lib/uploadTheme';
import type { Memorial, Service, Photo, Memory } from '@/types/memorial';
import type { Theme } from '@/data/themes';

interface MemorialPageClientProps {
  memorial: any;
  memorialData: Pick<Memorial, 'name' | 'birthDate' | 'deathDate' | 'birthPlace' | 'deathPlace' | 'portrait' | 'coverImage'>;
  photos: Photo[];
  memories: Memory[];
  services: Service[];
  timelineEvents: any[];
}

function MemorialContent({
  memorial,
  memorialData,
  photos,
  memories,
  services,
  timelineEvents,
}: MemorialPageClientProps) {
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const { currentTheme, setTheme, setCustomBackground } = useTheme();

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
  };

  const handleCustomUpload = async (file: File) => {
    try {
      const imageUrl = await uploadThemeImage(file);
      setCustomBackground(imageUrl);
      console.log('Uploaded image URL:', imageUrl);
    } catch (error) {
      console.error('Error uploading theme:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section with Profile & Info */}
      <HeroSection memorial={memorialData} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Top Section: Statistics & Quick Actions */}
        <div className="space-y-6">
          <VisitorStatistics memorialId={memorial.id} />
          <div className="flex flex-wrap gap-4">
            <ContactOwnerButton
              memorialId={memorial.id}
              ownerName={memorial.owner_name}
            />
          </div>
        </div>

        {/* Life Story Section */}
        {memorial.obituary_full && (
          <section id="obituary" className="scroll-mt-20">
            <ObituarySection content={memorial.obituary_full} />
          </section>
        )}

        {/* Life Timeline - chronological story */}
        {timelineEvents && timelineEvents.length > 0 && (
          <section id="timeline" className="scroll-mt-20">
            <Timeline events={timelineEvents} />
          </section>
        )}

        {/* Services & Memorial Events */}
        {services && services.length > 0 && (
          <section id="services" className="scroll-mt-20">
            <ServicesSection services={services} />
          </section>
        )}

        {/* Virtual Tribute Section */}
        <section id="candles" className="scroll-mt-20">
          <VirtualCandles
            memorialId={memorial.id}
            memorialName={memorial.full_name}
          />
        </section>

        {/* Photo Memories */}
        {photos && photos.length > 0 && (
          <section id="photos" className="scroll-mt-20">
            <PhotoGallery photos={photos} allowUpload={false} />
          </section>
        )}

        {/* Memory Wall - Community tributes */}
        <section id="memories" className="scroll-mt-20">
          <MemoryWallSection
            memories={memories || []}
            memorialId={memorial.id}
            memorialName={memorial.full_name}
          />
        </section>

        {/* Activity & Engagement Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity memorialId={memorial.id} />
          <EmailSubscription
            memorialId={memorial.id}
            memorialName={memorial.full_name}
          />
        </div>

        {/* Family Tree */}
        <section id="family" className="scroll-mt-20">
          <FamilyTreeSection members={[]} />
        </section>
      </main>

      {/* Floating Share Button - Right Side */}
      <FloatingShareButton
        memorialName={memorial.full_name}
        birthDate={memorial.date_of_birth || ''}
        deathDate={memorial.date_of_death || ''}
      />

      {/* Modern Floating Navigation */}
      <FloatingNavigation onThemeClick={() => setIsThemeSelectorOpen(true)} />

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentTheme={currentTheme}
        onThemeSelect={handleThemeSelect}
        onCustomUpload={handleCustomUpload}
      />

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Created with love on <span className="font-semibold text-primary">SoulBridge</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © {new Date().getFullYear()} SoulBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function MemorialPageClient(props: MemorialPageClientProps) {
  return (
    <ThemeProvider>
      <MemorialContent {...props} />
    </ThemeProvider>
  );
}
