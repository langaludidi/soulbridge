-- Phase 8: Advanced Features
-- File: 005_advanced_features.sql

-- ==============================================
-- ADD COVER IMAGE TO MEMORIALS
-- ==============================================
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- ==============================================
-- ADD THEME SUPPORT TO MEMORIALS
-- ==============================================
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'classic' CHECK (theme IN (
  'classic', 'modern', 'elegant', 'minimal', 'warm', 'serene'
));

-- ==============================================
-- GUESTBOOK ENTRIES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  signed_by_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Entry Content
  signed_by_name VARCHAR(200) NOT NULL,
  signed_by_email VARCHAR(255),
  location VARCHAR(200),
  message TEXT,

  -- Moderation
  is_approved BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_memorial_id ON guestbook_entries(memorial_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_created_at ON guestbook_entries(created_at);

-- ==============================================
-- NOTIFICATIONS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Notification Details
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'new_tribute', 'new_candle', 'new_guestbook', 'new_photo', 'milestone_views'
  )),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_emailed BOOLEAN DEFAULT false,
  emailed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_memorial_id ON notifications(memorial_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ==============================================
-- ANALYTICS TABLE (for tracking)
-- ==============================================
CREATE TABLE IF NOT EXISTS memorial_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,

  -- Analytics Data
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'view', 'tribute', 'candle', 'share', 'photo', 'guestbook', 'qr_scan'
  )),
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,

  -- Metadata
  referrer VARCHAR(500),
  user_agent VARCHAR(500),
  country VARCHAR(100),
  city VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Unique constraint for daily aggregation
  UNIQUE(memorial_id, event_type, event_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_memorial_id ON memorial_analytics(memorial_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON memorial_analytics(event_date);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON memorial_analytics(event_type);

-- Updated at trigger
DROP TRIGGER IF EXISTS update_memorial_analytics_updated_at ON memorial_analytics;
CREATE TRIGGER update_memorial_analytics_updated_at
  BEFORE UPDATE ON memorial_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ADD GUESTBOOK COUNT TO MEMORIALS
-- ==============================================
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS guestbook_count INTEGER DEFAULT 0;

-- Function to update memorial guestbook count
CREATE OR REPLACE FUNCTION update_memorial_guestbook_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE memorials
    SET guestbook_count = guestbook_count + 1
    WHERE id = NEW.memorial_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE memorials
    SET guestbook_count = GREATEST(0, guestbook_count - 1)
    WHERE id = OLD.memorial_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_memorial_guestbook_count ON guestbook_entries;
CREATE TRIGGER trigger_update_memorial_guestbook_count
AFTER INSERT OR DELETE ON guestbook_entries
FOR EACH ROW
EXECUTE FUNCTION update_memorial_guestbook_count();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_analytics ENABLE ROW LEVEL SECURITY;

-- Guestbook Policies
DROP POLICY IF EXISTS "Approved guestbook entries are viewable by everyone" ON guestbook_entries;
DROP POLICY IF EXISTS "Anyone can sign guestbook" ON guestbook_entries;
DROP POLICY IF EXISTS "Memorial owners can view all guestbook entries" ON guestbook_entries;

CREATE POLICY "Approved guestbook entries are viewable by everyone"
  ON guestbook_entries FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can sign guestbook"
  ON guestbook_entries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Memorial owners can view all guestbook entries"
  ON guestbook_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = guestbook_entries.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'));

-- Analytics Policies
DROP POLICY IF EXISTS "Memorial owners can view analytics" ON memorial_analytics;

CREATE POLICY "Memorial owners can view analytics"
  ON memorial_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = memorial_analytics.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
