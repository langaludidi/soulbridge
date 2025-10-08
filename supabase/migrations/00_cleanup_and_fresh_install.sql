-- ============================================================================
-- SoulBridge Database - Complete Clean Install
-- ============================================================================
-- This script will:
-- 1. Drop all existing SoulBridge tables (CAREFUL - this deletes data!)
-- 2. Create fresh tables with correct schema
-- 3. Set up RLS policies
-- 4. Create necessary functions and triggers
-- ============================================================================

-- STEP 1: Drop all existing tables (in correct order due to foreign keys)
-- ============================================================================

DROP TABLE IF EXISTS public.virtual_candles CASCADE;
DROP TABLE IF EXISTS public.relationships CASCADE;
DROP TABLE IF EXISTS public.tributes CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.gallery_items CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.memorials CASCADE;
-- Note: We keep profiles table as it's used by auth

-- STEP 2: Enable required extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 3: Create fresh tables
-- ============================================================================

-- Memorials table
CREATE TABLE public.memorials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  age_at_death INTEGER,
  profile_photo_url TEXT,
  obituary_short TEXT,
  obituary_full TEXT,
  verse TEXT,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'unlisted')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  allow_tributes BOOLEAN DEFAULT TRUE,
  allow_donations BOOLEAN DEFAULT FALSE,
  donation_link TEXT,
  rsvp_enabled BOOLEAN DEFAULT FALSE,
  rsvp_event_date DATE,
  rsvp_event_time TIME,
  rsvp_event_location TEXT,
  rsvp_event_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Gallery items table
CREATE TABLE public.gallery_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'audio')),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  duration INTEGER,
  is_background_audio BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline events table
CREATE TABLE public.timeline_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tributes (guestbook) table
CREATE TABLE public.tributes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Virtual candles table
CREATE TABLE public.virtual_candles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relationships table
CREATE TABLE public.relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE public.plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_annual DECIMAL(10,2),
  price_lifetime DECIMAL(10,2),
  max_memorials INTEGER,
  max_uploads INTEGER,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
  amount DECIMAL(10,2) NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- STEP 4: Create indexes for performance
-- ============================================================================

CREATE INDEX idx_memorials_user_id ON public.memorials(user_id);
CREATE INDEX idx_memorials_slug ON public.memorials(slug);
CREATE INDEX idx_memorials_status ON public.memorials(status);
CREATE INDEX idx_memorials_privacy ON public.memorials(privacy);
CREATE INDEX idx_gallery_items_memorial_id ON public.gallery_items(memorial_id);
CREATE INDEX idx_timeline_events_memorial_id ON public.timeline_events(memorial_id);
CREATE INDEX idx_tributes_memorial_id ON public.tributes(memorial_id);
CREATE INDEX idx_virtual_candles_memorial_id ON public.virtual_candles(memorial_id);
CREATE INDEX idx_relationships_memorial_id ON public.relationships(memorial_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- STEP 5: Enable Row Level Security
-- ============================================================================

ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS Policies
-- ============================================================================

-- Memorials policies
CREATE POLICY "Anyone can view published public memorials" ON public.memorials
  FOR SELECT USING (
    (status = 'published' AND privacy = 'public') OR user_id = auth.uid()
  );

CREATE POLICY "Users can create their own memorials" ON public.memorials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memorials" ON public.memorials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memorials" ON public.memorials
  FOR DELETE USING (auth.uid() = user_id);

-- Gallery items policies
CREATE POLICY "Anyone can view gallery items of public memorials" ON public.gallery_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = gallery_items.memorial_id
      AND memorials.status = 'published'
      AND memorials.privacy = 'public'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = gallery_items.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage gallery items for their memorials" ON public.gallery_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = gallery_items.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Timeline events policies
CREATE POLICY "Anyone can view timeline events of public memorials" ON public.timeline_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = timeline_events.memorial_id
      AND memorials.status = 'published'
      AND memorials.privacy = 'public'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = timeline_events.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage timeline events for their memorials" ON public.timeline_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = timeline_events.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Tributes policies
CREATE POLICY "Anyone can view public tributes" ON public.tributes
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Anyone can create tributes" ON public.tributes
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Memorial owners can moderate tributes" ON public.tributes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = tributes.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Memorial owners can delete tributes" ON public.tributes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = tributes.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Virtual candles policies
CREATE POLICY "Anyone can view virtual candles" ON public.virtual_candles
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can light a candle" ON public.virtual_candles
  FOR INSERT WITH CHECK (TRUE);

-- Relationships policies
CREATE POLICY "Anyone can view relationships of public memorials" ON public.relationships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = relationships.memorial_id
      AND memorials.status = 'published'
      AND memorials.privacy = 'public'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = relationships.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage relationships for their memorials" ON public.relationships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = relationships.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Plans policies
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = TRUE);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STEP 7: Create triggers
-- ============================================================================

-- Update updated_at timestamp function (if not exists)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for memorials updated_at
DROP TRIGGER IF EXISTS set_updated_at_memorials ON public.memorials;
CREATE TRIGGER set_updated_at_memorials
  BEFORE UPDATE ON public.memorials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- STEP 8: Insert default plans
-- ============================================================================

INSERT INTO public.plans (name, description, price_monthly, price_annual, price_lifetime, max_memorials, max_uploads, features) VALUES
  ('Free', 'Perfect for trying out SoulBridge', 0, 0, 0, 1, 10, ARRAY['1 memorial', '10 photos/videos', 'Basic timeline', 'Public guestbook']),
  ('Essential', 'For a single memorial with unlimited memories', 49, 490, NULL, 1, NULL, ARRAY['1 memorial', 'Unlimited uploads', 'Full timeline', 'Audio background', 'QR sharing', 'Email support']),
  ('Family', 'For multiple family memorials', 99, 990, NULL, 3, NULL, ARRAY['3 memorials', 'Unlimited uploads', 'All features', 'Priority support']),
  ('Lifetime', 'One-time payment, forever access', NULL, NULL, 999, NULL, NULL, ARRAY['Unlimited memorials', 'Unlimited uploads', 'All features', 'Lifetime access', 'Priority support'])
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- Migration Complete!
-- ============================================================================
