-- Phase 5: Timeline and Sharing Features
-- File: 003_timeline_and_sharing.sql

-- ==============================================
-- TIMELINE EVENTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,

  -- Event Details
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) DEFAULT 'life_event' CHECK (event_type IN (
    'birth', 'graduation', 'marriage', 'career', 'achievement',
    'travel', 'family', 'hobby', 'life_event', 'other'
  )),

  -- Media
  image_url TEXT,

  -- Display Order
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_timeline_events_memorial_id ON timeline_events(memorial_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_date ON timeline_events(event_date);
CREATE INDEX IF NOT EXISTS idx_timeline_events_event_type ON timeline_events(event_type);

-- Updated at trigger
DROP TRIGGER IF EXISTS update_timeline_events_updated_at ON timeline_events;
CREATE TRIGGER update_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- MEMORIAL SHARES TABLE (for tracking shares)
-- ==============================================
CREATE TABLE IF NOT EXISTS memorial_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,

  -- Share Details
  share_type VARCHAR(50) NOT NULL CHECK (share_type IN (
    'facebook', 'twitter', 'whatsapp', 'email', 'link', 'qr_code', 'other'
  )),
  shared_by_ip VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memorial_shares_memorial_id ON memorial_shares(memorial_id);
CREATE INDEX IF NOT EXISTS idx_memorial_shares_share_type ON memorial_shares(share_type);
CREATE INDEX IF NOT EXISTS idx_memorial_shares_created_at ON memorial_shares(created_at);

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_shares ENABLE ROW LEVEL SECURITY;

-- Timeline Events Policies
DROP POLICY IF EXISTS "Timeline events are viewable if memorial is viewable" ON timeline_events;
DROP POLICY IF EXISTS "Memorial owners can create timeline events" ON timeline_events;
DROP POLICY IF EXISTS "Memorial owners can update timeline events" ON timeline_events;
DROP POLICY IF EXISTS "Memorial owners can delete timeline events" ON timeline_events;

CREATE POLICY "Timeline events are viewable if memorial is viewable"
  ON timeline_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = timeline_events.memorial_id
      AND (visibility = 'public' AND status = 'published')
    )
    OR
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = timeline_events.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Memorial owners can create timeline events"
  ON timeline_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = timeline_events.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Memorial owners can update timeline events"
  ON timeline_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = timeline_events.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Memorial owners can delete timeline events"
  ON timeline_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = timeline_events.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

-- Memorial Shares Policies
DROP POLICY IF EXISTS "Anyone can create share records" ON memorial_shares;
DROP POLICY IF EXISTS "Memorial owners can view share records" ON memorial_shares;

CREATE POLICY "Anyone can create share records"
  ON memorial_shares FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Memorial owners can view share records"
  ON memorial_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = memorial_shares.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

-- ==============================================
-- ADD SHARE COUNT TO MEMORIALS
-- ==============================================
ALTER TABLE memorials ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0;

-- Function to update memorial share count
CREATE OR REPLACE FUNCTION update_memorial_share_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE memorials
    SET share_count = share_count + 1
    WHERE id = NEW.memorial_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE memorials
    SET share_count = GREATEST(0, share_count - 1)
    WHERE id = OLD.memorial_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_memorial_share_count ON memorial_shares;
CREATE TRIGGER trigger_update_memorial_share_count
AFTER INSERT OR DELETE ON memorial_shares
FOR EACH ROW
EXECUTE FUNCTION update_memorial_share_count();
