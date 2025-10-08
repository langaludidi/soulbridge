/**
 * Memorial View Component
 * Complete memorial page with all new professional components
 * Clean, minimalist design based on reference
 */

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HeroSection } from '@/components/memorial/HeroSection';
import { NavigationTabs } from '@/components/memorial/NavigationTabs';
import { ObituarySection } from '@/components/memorial/ObituarySection';
import { PhotoGallery } from '@/components/memorial/PhotoGallery';
import { MemoryWallSection } from '@/components/memorial/MemoryWallSection';
import { ServicesSection } from '@/components/memorial/ServicesSection';
import { DonationSection } from '@/components/memorial/DonationSection';
import { FamilyTreeSection } from '@/components/memorial/FamilyTreeSection';
import type { Service, Photo, Memory, Donation, FamilyMember } from '@/types/memorial';

interface Memorial {
  id: string;
  full_name: string;
  slug: string;
  date_of_birth: string | null;
  date_of_death: string | null;
  profile_photo_url: string | null;
  cover_photo_url?: string | null;
  verse: string | null;
  obituary_full: string | null;
  funeral_date: string | null;
  funeral_time: string | null;
  funeral_location: string | null;
  birth_place?: string | null;
  death_place?: string | null;
}

interface MemorialViewProps {
  memorial: Memorial;
}

export default function MemorialView({ memorial }: MemorialViewProps) {
  const supabase = createClientComponentClient();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [donation, setDonation] = useState<Donation | undefined>(undefined);
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemorialData();
  }, [memorial.id]);

  const fetchMemorialData = async () => {
    setIsLoading(true);
    try {
      // Fetch gallery items (photos)
      const { data: galleryData } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('memorial_id', memorial.id)
        .eq('type', 'photo')
        .order('display_order', { ascending: true });

      const transformedPhotos: Photo[] = (galleryData || []).map(item => ({
        id: item.id,
        url: item.url,
        caption: item.description || undefined,
        uploadedBy: undefined,
        uploadedAt: item.created_at,
      }));
      setPhotos(transformedPhotos);

      // Fetch tributes (memories)
      const { data: tributesData } = await supabase
        .from('tributes')
        .select('*')
        .eq('memorial_id', memorial.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      const transformedMemories: Memory[] = (tributesData || []).map(tribute => ({
        id: tribute.id,
        authorName: tribute.author_name,
        authorPhoto: undefined,
        message: tribute.message,
        photo: undefined,
        createdAt: tribute.created_at,
        candles: 0,
      }));
      setMemories(transformedMemories);

      // Create service from memorial data
      if (memorial.funeral_date && memorial.funeral_location) {
        const service: Service = {
          id: '1',
          type: 'Funeral Service',
          date: memorial.funeral_date,
          startTime: memorial.funeral_time || '10:00',
          location: memorial.funeral_location.split(',')[0] || memorial.funeral_location,
          address: memorial.funeral_location,
          details: undefined,
          mapUrl: undefined,
          directions: undefined,
        };
        setServices([service]);
      }

      // TODO: Fetch donation info from database when table is created
      // For now, set to undefined
      setDonation(undefined);

      // TODO: Fetch family tree from relationships table
      // For now, set to empty array
      setFamilyTree([]);
    } catch (error) {
      console.error('Error fetching memorial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMemory = async (memoryData: { authorName: string; message: string; photo?: string }) => {
    try {
      const { error } = await supabase.from('tributes').insert({
        memorial_id: memorial.id,
        author_name: memoryData.authorName,
        message: memoryData.message,
        is_public: true,
      });

      if (!error) {
        // Refresh memories
        fetchMemorialData();
      }
    } catch (error) {
      console.error('Error adding memory:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        name={memorial.full_name}
        birthDate={memorial.date_of_birth || ''}
        deathDate={memorial.date_of_death || ''}
        birthPlace={memorial.birth_place || undefined}
        deathPlace={memorial.death_place || undefined}
        portrait={memorial.profile_photo_url || '/placeholder-portrait.jpg'}
        coverImage={memorial.cover_photo_url || undefined}
      />

      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Main Content */}
      <main>
        {/* Obituary Section */}
        {memorial.obituary_full && (
          <ObituarySection obituary={memorial.obituary_full} />
        )}

        {/* Photo Gallery */}
        <PhotoGallery photos={photos} allowUpload={false} />

        {/* Memory Wall */}
        <MemoryWallSection
          memories={memories}
          onAddMemory={handleAddMemory}
        />

        {/* Services Section */}
        {services.length > 0 && (
          <ServicesSection services={services} />
        )}

        {/* Donation Section */}
        {donation && (
          <DonationSection donation={donation} />
        )}

        {/* Family Tree */}
        {familyTree.length > 0 && (
          <FamilyTreeSection familyTree={familyTree} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-gray-200 bg-white">
        <p className="text-gray-600">
          Created with love on{' '}
          <span className="font-semibold text-primary">SoulBridge</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          © {new Date().getFullYear()} SoulBridge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
