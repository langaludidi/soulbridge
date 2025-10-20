-- ============================================
-- SoulBridge MVP - Memorials Schema
-- Phase 3: Memorial Creation System
-- ============================================

-- ============================================
-- MEMORIALS TABLE
-- ============================================
CREATE TABLE memorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

    -- Basic Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    maiden_name TEXT,
    nickname TEXT,

    -- Dates
    date_of_birth DATE NOT NULL,
    date_of_death DATE NOT NULL,
    age_at_death INTEGER GENERATED ALWAYS AS (
        EXTRACT(YEAR FROM AGE(date_of_death, date_of_birth))
    ) STORED,

    -- Location
    place_of_birth TEXT,
    place_of_death TEXT,

    -- Service Details
    funeral_date DATE,
    funeral_time TIME,
    funeral_location TEXT,
    funeral_address TEXT,
    burial_location TEXT,

    -- Content
    biography TEXT,
    obituary TEXT,

    -- Media
    profile_image_url TEXT,
    cover_image_url TEXT,

    -- Settings
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    allow_tributes BOOLEAN DEFAULT true,
    allow_candles BOOLEAN DEFAULT true,
    allow_photos BOOLEAN DEFAULT true,

    -- SEO & Sharing
    slug TEXT UNIQUE,
    qr_code_url TEXT,

    -- Stats
    view_count INTEGER DEFAULT 0,
    tribute_count INTEGER DEFAULT 0,
    candle_count INTEGER DEFAULT 0,
    photo_count INTEGER DEFAULT 0,

    -- Status
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_memorials_profile_id ON memorials(profile_id);
CREATE INDEX idx_memorials_slug ON memorials(slug);
CREATE INDEX idx_memorials_status ON memorials(status);
CREATE INDEX idx_memorials_visibility ON memorials(visibility);
CREATE INDEX idx_memorials_created_at ON memorials(created_at DESC);
CREATE INDEX idx_memorials_date_of_death ON memorials(date_of_death DESC);

-- Full text search index
CREATE INDEX idx_memorials_search ON memorials USING gin(
    to_tsvector('english',
        coalesce(first_name, '') || ' ' ||
        coalesce(last_name, '') || ' ' ||
        coalesce(biography, '')
    )
);

-- ============================================
-- MEMORIAL MEDIA TABLE
-- ============================================
CREATE TABLE memorial_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,

    -- Media Info
    type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'document')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    title TEXT,
    caption TEXT,

    -- Metadata
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for videos

    -- Organization
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,

    -- Stats
    view_count INTEGER DEFAULT 0,

    -- Timestamps
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_memorial_media_memorial_id ON memorial_media(memorial_id);
CREATE INDEX idx_memorial_media_type ON memorial_media(type);
CREATE INDEX idx_memorial_media_display_order ON memorial_media(memorial_id, display_order);

-- ============================================
-- TRIBUTES TABLE
-- ============================================
CREATE TABLE tributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,

    -- Author (optional - can be anonymous)
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    author_relationship TEXT, -- e.g., "Friend", "Family", "Colleague"

    -- Content
    message TEXT NOT NULL,

    -- Moderation
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
    is_anonymous BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_tributes_memorial_id ON tributes(memorial_id);
CREATE INDEX idx_tributes_profile_id ON tributes(profile_id);
CREATE INDEX idx_tributes_status ON tributes(status);
CREATE INDEX idx_tributes_created_at ON tributes(created_at DESC);

-- ============================================
-- VIRTUAL CANDLES TABLE
-- ============================================
CREATE TABLE virtual_candles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,

    -- Lighter (optional - can be anonymous)
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    lighter_name TEXT NOT NULL,

    -- Message
    message TEXT,

    -- Settings
    candle_type TEXT DEFAULT 'white' CHECK (candle_type IN ('white', 'red', 'blue', 'gold', 'rainbow')),

    -- Timestamps
    lit_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Indexes
CREATE INDEX idx_virtual_candles_memorial_id ON virtual_candles(memorial_id);
CREATE INDEX idx_virtual_candles_lit_at ON virtual_candles(lit_at DESC);
CREATE INDEX idx_virtual_candles_expires_at ON virtual_candles(expires_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_memorial_slug(fname TEXT, lname TEXT, dod DATE)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base slug: firstname-lastname-year
    base_slug := lower(
        regexp_replace(
            fname || '-' || lname || '-' || EXTRACT(YEAR FROM dod)::TEXT,
            '[^a-z0-9-]', '-', 'g'
        )
    );
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(both '-' from base_slug);

    final_slug := base_slug;

    -- Check for uniqueness, add counter if needed
    WHILE EXISTS (SELECT 1 FROM memorials WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter::TEXT;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE OR REPLACE FUNCTION set_memorial_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_memorial_slug(NEW.first_name, NEW.last_name, NEW.date_of_death);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER memorial_slug_trigger
    BEFORE INSERT ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION set_memorial_slug();

-- Trigger to update updated_at
CREATE TRIGGER update_memorials_updated_at
    BEFORE UPDATE ON memorials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update memorial counters
CREATE OR REPLACE FUNCTION update_memorial_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'tributes' THEN
        UPDATE memorials
        SET tribute_count = (
            SELECT COUNT(*) FROM tributes
            WHERE memorial_id = NEW.memorial_id AND status = 'approved'
        )
        WHERE id = NEW.memorial_id;
    ELSIF TG_TABLE_NAME = 'virtual_candles' THEN
        UPDATE memorials
        SET candle_count = (
            SELECT COUNT(*) FROM virtual_candles
            WHERE memorial_id = NEW.memorial_id
        )
        WHERE id = NEW.memorial_id;
    ELSIF TG_TABLE_NAME = 'memorial_media' THEN
        UPDATE memorials
        SET photo_count = (
            SELECT COUNT(*) FROM memorial_media
            WHERE memorial_id = NEW.memorial_id AND type = 'photo'
        )
        WHERE id = NEW.memorial_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for counters
CREATE TRIGGER update_tribute_count
    AFTER INSERT OR UPDATE ON tributes
    FOR EACH ROW
    EXECUTE FUNCTION update_memorial_counters();

CREATE TRIGGER update_candle_count
    AFTER INSERT ON virtual_candles
    FOR EACH ROW
    EXECUTE FUNCTION update_memorial_counters();

CREATE TRIGGER update_photo_count
    AFTER INSERT ON memorial_media
    FOR EACH ROW
    EXECUTE FUNCTION update_memorial_counters();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorial_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_candles ENABLE ROW LEVEL SECURITY;

-- Memorials policies
CREATE POLICY "Anyone can view published public memorials"
    ON memorials FOR SELECT
    USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Users can view their own memorials"
    ON memorials FOR SELECT
    USING (profile_id IN (
        SELECT id FROM profiles
        WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can create their own memorials"
    ON memorials FOR INSERT
    WITH CHECK (profile_id IN (
        SELECT id FROM profiles
        WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can update their own memorials"
    ON memorials FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM profiles
        WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can delete their own memorials"
    ON memorials FOR DELETE
    USING (profile_id IN (
        SELECT id FROM profiles
        WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Service role can do everything on memorials"
    ON memorials FOR ALL
    USING (current_setting('role') = 'service_role');

-- Memorial media policies
CREATE POLICY "Anyone can view media from public memorials"
    ON memorial_media FOR SELECT
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE status = 'published' AND visibility = 'public'
    ));

CREATE POLICY "Memorial owners can manage their media"
    ON memorial_media FOR ALL
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

-- Tributes policies
CREATE POLICY "Anyone can view approved tributes"
    ON tributes FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Anyone can create tributes"
    ON tributes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Memorial owners can moderate tributes"
    ON tributes FOR UPDATE
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

-- Virtual candles policies
CREATE POLICY "Anyone can view candles"
    ON virtual_candles FOR SELECT
    USING (true);

CREATE POLICY "Anyone can light candles"
    ON virtual_candles FOR INSERT
    WITH CHECK (true);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE memorials IS 'Memorial pages for loved ones';
COMMENT ON TABLE memorial_media IS 'Photos, videos, and documents for memorials';
COMMENT ON TABLE tributes IS 'Condolence messages and tributes';
COMMENT ON TABLE virtual_candles IS 'Virtual memorial candles';
COMMENT ON COLUMN memorials.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN memorials.view_count IS 'Number of times memorial page was viewed';
