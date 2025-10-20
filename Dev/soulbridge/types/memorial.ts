/**
 * Memorial Types for SoulBridge MVP
 * Phase 3: Memorial Creation System
 */

// ============================================
// ENUMS
// ============================================

export type MemorialVisibility = 'public' | 'private' | 'unlisted';
export type MemorialStatus = 'draft' | 'published' | 'archived';
export type MediaType = 'photo' | 'video' | 'document';
export type TributeStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type CandleType = 'white' | 'red' | 'blue' | 'gold' | 'rainbow';

// ============================================
// MEMORIAL
// ============================================

export interface Memorial {
  id: string;
  profile_id: string;

  // Basic Information
  first_name: string;
  last_name: string;
  full_name: string;
  maiden_name: string | null;
  nickname: string | null;

  // Dates
  date_of_birth: string;
  date_of_death: string;
  age_at_death: number;

  // Location
  place_of_birth: string | null;
  place_of_death: string | null;

  // Service Details
  funeral_date: string | null;
  funeral_time: string | null;
  funeral_location: string | null;
  funeral_address: string | null;
  burial_location: string | null;

  // Content
  biography: string | null;
  obituary: string | null;

  // Media
  profile_image_url: string | null;
  cover_image_url: string | null;

  // Settings
  visibility: MemorialVisibility;
  allow_tributes: boolean;
  allow_candles: boolean;
  allow_photos: boolean;

  // SEO & Sharing
  slug: string;
  qr_code_url: string | null;

  // Stats
  view_count: number;
  tribute_count: number;
  candle_count: number;
  photo_count: number;

  // Status
  status: MemorialStatus;

  // Timestamps
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface MemorialInsert {
  profile_id: string;
  first_name: string;
  last_name: string;
  maiden_name?: string;
  nickname?: string;
  date_of_birth: string;
  date_of_death: string;
  place_of_birth?: string;
  place_of_death?: string;
  funeral_date?: string;
  funeral_time?: string;
  funeral_location?: string;
  funeral_address?: string;
  burial_location?: string;
  biography?: string;
  obituary?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  visibility?: MemorialVisibility;
  allow_tributes?: boolean;
  allow_candles?: boolean;
  allow_photos?: boolean;
  status?: MemorialStatus;
  slug?: string;
}

export interface MemorialUpdate {
  first_name?: string;
  last_name?: string;
  maiden_name?: string;
  nickname?: string;
  date_of_birth?: string;
  date_of_death?: string;
  place_of_birth?: string;
  place_of_death?: string;
  funeral_date?: string;
  funeral_time?: string;
  funeral_location?: string;
  funeral_address?: string;
  burial_location?: string;
  biography?: string;
  obituary?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  visibility?: MemorialVisibility;
  allow_tributes?: boolean;
  allow_candles?: boolean;
  allow_photos?: boolean;
  status?: MemorialStatus;
}

// ============================================
// MEMORIAL MEDIA
// ============================================

export interface MemorialMedia {
  id: string;
  memorial_id: string;
  type: MediaType;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  caption: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  display_order: number;
  is_featured: boolean;
  view_count: number;
  uploaded_at: string;
  created_at: string;
}

export interface MemorialMediaInsert {
  memorial_id: string;
  type: MediaType;
  url: string;
  thumbnail_url?: string;
  title?: string;
  caption?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  duration?: number;
  display_order?: number;
  is_featured?: boolean;
}

// ============================================
// TRIBUTE
// ============================================

export interface Tribute {
  id: string;
  memorial_id: string;
  profile_id: string | null;
  author_name: string;
  author_email: string | null;
  author_relationship: string | null;
  message: string;
  status: TributeStatus;
  is_anonymous: boolean;
  created_at: string;
  approved_at: string | null;
}

export interface TributeInsert {
  memorial_id: string;
  profile_id?: string;
  author_name: string;
  author_email?: string;
  author_relationship?: string;
  message: string;
  is_anonymous?: boolean;
}

// ============================================
// VIRTUAL CANDLE
// ============================================

export interface VirtualCandle {
  id: string;
  memorial_id: string;
  profile_id: string | null;
  lighter_name: string;
  message: string | null;
  candle_type: CandleType;
  lit_at: string;
  expires_at: string;
}

export interface VirtualCandleInsert {
  memorial_id: string;
  profile_id?: string;
  lighter_name: string;
  message?: string;
  candle_type?: CandleType;
}

// ============================================
// API TYPES
// ============================================

export interface CreateMemorialRequest {
  first_name: string;
  last_name: string;
  maiden_name?: string;
  nickname?: string;
  date_of_birth: string;
  date_of_death: string;
  place_of_birth?: string;
  place_of_death?: string;
  funeral_date?: string;
  funeral_time?: string;
  funeral_location?: string;
  funeral_address?: string;
  burial_location?: string;
  biography?: string;
  obituary?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  visibility?: MemorialVisibility;
  allow_tributes?: boolean;
  allow_candles?: boolean;
  allow_photos?: boolean;
  status?: MemorialStatus;
}

export interface UpdateMemorialRequest extends Partial<CreateMemorialRequest> {}

export interface MemorialResponse {
  data: Memorial;
  message?: string;
}

export interface MemorialsListResponse {
  data: Memorial[];
  count: number;
}

export interface MemorialWithDetails extends Memorial {
  media: MemorialMedia[];
  tributes: Tribute[];
  candles: VirtualCandle[];
}
