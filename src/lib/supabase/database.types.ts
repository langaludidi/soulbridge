export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          plan: 'free' | 'essential' | 'family' | 'lifetime'
          subscription_status: 'active' | 'cancelled' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          plan?: 'free' | 'essential' | 'family' | 'lifetime'
          subscription_status?: 'active' | 'cancelled' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          plan?: 'free' | 'essential' | 'family' | 'lifetime'
          subscription_status?: 'active' | 'cancelled' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
      memorials: {
        Row: {
          id: string
          user_id: string
          full_name: string
          slug: string
          date_of_birth: string | null
          date_of_death: string | null
          age_at_death: number | null
          profile_photo_url: string | null
          obituary_short: string | null
          obituary_full: string | null
          verse: string | null
          privacy: 'public' | 'private' | 'unlisted'
          status: 'draft' | 'published'
          allow_tributes: boolean
          allow_donations: boolean
          donation_link: string | null
          rsvp_enabled: boolean
          rsvp_event_date: string | null
          rsvp_event_time: string | null
          rsvp_event_location: string | null
          rsvp_event_details: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          slug: string
          date_of_birth?: string | null
          date_of_death?: string | null
          age_at_death?: number | null
          profile_photo_url?: string | null
          obituary_short?: string | null
          obituary_full?: string | null
          verse?: string | null
          privacy?: 'public' | 'private' | 'unlisted'
          status?: 'draft' | 'published'
          allow_tributes?: boolean
          allow_donations?: boolean
          donation_link?: string | null
          rsvp_enabled?: boolean
          rsvp_event_date?: string | null
          rsvp_event_time?: string | null
          rsvp_event_location?: string | null
          rsvp_event_details?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          slug?: string
          date_of_birth?: string | null
          date_of_death?: string | null
          age_at_death?: number | null
          profile_photo_url?: string | null
          obituary_short?: string | null
          obituary_full?: string | null
          verse?: string | null
          privacy?: 'public' | 'private' | 'unlisted'
          status?: 'draft' | 'published'
          allow_tributes?: boolean
          allow_donations?: boolean
          donation_link?: string | null
          rsvp_enabled?: boolean
          rsvp_event_date?: string | null
          rsvp_event_time?: string | null
          rsvp_event_location?: string | null
          rsvp_event_details?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      gallery_items: {
        Row: {
          id: string
          memorial_id: string
          type: 'photo' | 'video' | 'audio'
          url: string
          title: string | null
          description: string | null
          duration: number | null
          is_background_audio: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          type: 'photo' | 'video' | 'audio'
          url: string
          title?: string | null
          description?: string | null
          duration?: number | null
          is_background_audio?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          type?: 'photo' | 'video' | 'audio'
          url?: string
          title?: string | null
          description?: string | null
          duration?: number | null
          is_background_audio?: boolean
          display_order?: number
          created_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          memorial_id: string
          date: string
          title: string
          description: string | null
          icon: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          date: string
          title: string
          description?: string | null
          icon?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          date?: string
          title?: string
          description?: string | null
          icon?: string | null
          display_order?: number
          created_at?: string
        }
      }
      tributes: {
        Row: {
          id: string
          memorial_id: string
          author_name: string
          author_email: string | null
          message: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          author_name: string
          author_email?: string | null
          message: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          author_name?: string
          author_email?: string | null
          message?: string
          is_public?: boolean
          created_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          memorial_id: string
          relationship_type: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          relationship_type: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          relationship_type?: string
          name?: string
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number | null
          price_annual: number | null
          price_lifetime: number | null
          max_memorials: number | null
          max_uploads: number | null
          features: string[]
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_monthly?: number | null
          price_annual?: number | null
          price_lifetime?: number | null
          max_memorials?: number | null
          max_uploads?: number | null
          features?: string[]
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_monthly?: number | null
          price_annual?: number | null
          price_lifetime?: number | null
          max_memorials?: number | null
          max_uploads?: number | null
          features?: string[]
          is_active?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          netcash_reference: string | null
          status: 'pending' | 'completed' | 'cancelled' | 'failed'
          amount: number
          billing_cycle: 'monthly' | 'annual' | 'lifetime' | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          netcash_reference?: string | null
          status?: 'pending' | 'completed' | 'cancelled' | 'failed'
          amount: number
          billing_cycle?: 'monthly' | 'annual' | 'lifetime' | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          netcash_reference?: string | null
          status?: 'pending' | 'completed' | 'cancelled' | 'failed'
          amount?: number
          billing_cycle?: 'monthly' | 'annual' | 'lifetime' | null
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
