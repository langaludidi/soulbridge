-- Phase 9: Order of Service
-- File: 006_order_of_service.sql

-- ==============================================
-- ORDER OF SERVICE TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS order_of_service (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE UNIQUE,

  -- Cover Details
  cover_title VARCHAR(200) DEFAULT 'In Loving Memory',
  cover_subtitle VARCHAR(300), -- Optional subtitle
  cover_photo_url TEXT,
  theme_color VARCHAR(50) DEFAULT 'classic' CHECK (theme_color IN (
    'classic', 'modern', 'traditional', 'ubuntu', 'serene', 'elegant'
  )),

  -- Service Details
  officiant VARCHAR(200),
  co_officiant VARCHAR(200), -- Optional co-officiant
  venue VARCHAR(300),
  venue_address TEXT,
  service_date DATE,
  service_time TIME,
  service_end_time TIME, -- Optional end time

  -- Reception Details (optional)
  reception_venue VARCHAR(300),
  reception_address TEXT,
  reception_time TIME,

  -- Branding (for funeral homes)
  funeral_home_logo_url TEXT,
  funeral_home_name VARCHAR(200),
  funeral_home_address TEXT,
  funeral_home_phone VARCHAR(50),
  funeral_home_website VARCHAR(200),
  funeral_home_email VARCHAR(200),

  -- Pallbearers (stored as JSON array)
  pallbearers JSONB DEFAULT '[]',

  -- Honorary Pallbearers (stored as JSON array)
  honorary_pallbearers JSONB DEFAULT '[]',

  -- Family Flower Bearers (stored as JSON array)
  flower_bearers JSONB DEFAULT '[]',

  -- Additional Sections
  special_acknowledgements TEXT, -- Thank you notes
  donations_in_lieu TEXT, -- "In lieu of flowers, donations to..."
  additional_notes TEXT,

  -- Interment/Committal Details
  interment_location VARCHAR(300),
  interment_address TEXT,
  interment_time TIME,
  interment_private BOOLEAN DEFAULT false,

  -- Status & Workflow
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'printed')),
  finalized_at TIMESTAMP WITH TIME ZONE,
  finalized_by UUID REFERENCES profiles(id),

  -- Review Link for family sign-off
  review_token VARCHAR(100) UNIQUE,
  review_expires_at TIMESTAMP WITH TIME ZONE,
  review_approved BOOLEAN DEFAULT false,
  review_approved_at TIMESTAMP WITH TIME ZONE,
  review_approved_by VARCHAR(200), -- Name of person who approved

  -- Print tracking
  print_count INTEGER DEFAULT 0,
  last_printed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================
-- ORDER OF SERVICE ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS order_of_service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_of_service_id UUID NOT NULL REFERENCES order_of_service(id) ON DELETE CASCADE,

  -- Item Details
  item_order INTEGER NOT NULL,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN (
    'opening_prayer', 'hymn', 'scripture', 'tribute', 'eulogy',
    'poem', 'musical_selection', 'closing_prayer', 'benediction',
    'committal', 'reflection', 'procession', 'recessional',
    'moment_of_silence', 'video_tribute', 'photo_slideshow',
    'words_of_comfort', 'family_remarks', 'custom'
  )),
  title VARCHAR(300) NOT NULL,
  subtitle VARCHAR(300), -- e.g., "Hymn 234" or verse reference
  speaker_performer VARCHAR(200),
  duration INTEGER, -- in minutes
  notes TEXT, -- Full text for poems, scripture verses, etc.

  -- Additional metadata
  is_congregation_participation BOOLEAN DEFAULT false, -- e.g., "All Stand" for hymns
  page_break_before BOOLEAN DEFAULT false, -- Force page break before this item in print

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Ensure ordering is unique per order_of_service
  UNIQUE(order_of_service_id, item_order)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oos_memorial_id ON order_of_service(memorial_id);
CREATE INDEX IF NOT EXISTS idx_oos_status ON order_of_service(status);
CREATE INDEX IF NOT EXISTS idx_oos_items_order_of_service_id ON order_of_service_items(order_of_service_id);
CREATE INDEX IF NOT EXISTS idx_oos_items_order ON order_of_service_items(order_of_service_id, item_order);

-- Updated at triggers
DROP TRIGGER IF EXISTS update_order_of_service_updated_at ON order_of_service;
CREATE TRIGGER update_order_of_service_updated_at
  BEFORE UPDATE ON order_of_service
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_order_of_service_items_updated_at ON order_of_service_items;
CREATE TRIGGER update_order_of_service_items_updated_at
  BEFORE UPDATE ON order_of_service_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS
ALTER TABLE order_of_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_of_service_items ENABLE ROW LEVEL SECURITY;

-- Order of Service Policies
DROP POLICY IF EXISTS "Memorial owners can manage order of service" ON order_of_service;
DROP POLICY IF EXISTS "Public memorials order of service viewable by all" ON order_of_service;

CREATE POLICY "Memorial owners can manage order of service"
  ON order_of_service
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = order_of_service.memorial_id
      AND profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Public memorials order of service viewable by all"
  ON order_of_service FOR SELECT
  USING (
    status = 'final' AND
    EXISTS (
      SELECT 1 FROM memorials
      WHERE id = order_of_service.memorial_id
      AND visibility = 'public'
    )
  );

-- Order of Service Items Policies
DROP POLICY IF EXISTS "Memorial owners can manage oos items" ON order_of_service_items;
DROP POLICY IF EXISTS "Public memorial oos items viewable by all" ON order_of_service_items;

CREATE POLICY "Memorial owners can manage oos items"
  ON order_of_service_items
  USING (
    EXISTS (
      SELECT 1 FROM order_of_service oos
      JOIN memorials m ON m.id = oos.memorial_id
      WHERE oos.id = order_of_service_items.order_of_service_id
      AND m.profile_id = (SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Public memorial oos items viewable by all"
  ON order_of_service_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_of_service oos
      JOIN memorials m ON m.id = oos.memorial_id
      WHERE oos.id = order_of_service_items.order_of_service_id
      AND oos.status = 'final'
      AND m.visibility = 'public'
    )
  );
