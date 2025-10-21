-- Memorial Services Table
-- Stores funeral, unveiling, visitation, memorial services, and other events for memorials

CREATE TABLE IF NOT EXISTS memorial_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('funeral', 'unveiling', 'visitation', 'memorial_service', 'celebration_of_life', 'other')),
    title TEXT,
    service_date DATE NOT NULL,
    service_time TIME,
    location_name TEXT,
    address TEXT,
    city TEXT,
    state_province TEXT,
    country TEXT,
    details TEXT,
    virtual_link TEXT,
    requires_rsvp BOOLEAN DEFAULT false,
    max_attendees INTEGER,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_memorial_services_memorial_id ON memorial_services(memorial_id);
CREATE INDEX idx_memorial_services_date ON memorial_services(service_date);
CREATE INDEX idx_memorial_services_type ON memorial_services(service_type);

-- Updated at trigger
CREATE TRIGGER update_memorial_services_updated_at
    BEFORE UPDATE ON memorial_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE memorial_services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public services
CREATE POLICY "Anyone can view public services"
    ON memorial_services
    FOR SELECT
    USING (is_private = false);

-- Policy: Memorial owner can view all services (public and private)
CREATE POLICY "Memorial owner can view all services"
    ON memorial_services
    FOR SELECT
    USING (
        memorial_id IN (
            SELECT m.id FROM memorials m
            INNER JOIN profiles p ON m.profile_id = p.id
            WHERE p.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Policy: Memorial owner can insert services
CREATE POLICY "Memorial owner can insert services"
    ON memorial_services
    FOR INSERT
    WITH CHECK (
        memorial_id IN (
            SELECT m.id FROM memorials m
            INNER JOIN profiles p ON m.profile_id = p.id
            WHERE p.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Policy: Memorial owner can update their services
CREATE POLICY "Memorial owner can update services"
    ON memorial_services
    FOR UPDATE
    USING (
        memorial_id IN (
            SELECT m.id FROM memorials m
            INNER JOIN profiles p ON m.profile_id = p.id
            WHERE p.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Policy: Memorial owner can delete their services
CREATE POLICY "Memorial owner can delete services"
    ON memorial_services
    FOR DELETE
    USING (
        memorial_id IN (
            SELECT m.id FROM memorials m
            INNER JOIN profiles p ON m.profile_id = p.id
            WHERE p.clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Helper function to get services for a memorial
CREATE OR REPLACE FUNCTION get_memorial_services(p_memorial_id UUID, p_include_private BOOLEAN DEFAULT false)
RETURNS TABLE (
    id UUID,
    memorial_id UUID,
    service_type TEXT,
    title TEXT,
    service_date DATE,
    service_time TIME,
    location_name TEXT,
    address TEXT,
    city TEXT,
    state_province TEXT,
    country TEXT,
    details TEXT,
    virtual_link TEXT,
    requires_rsvp BOOLEAN,
    max_attendees INTEGER,
    is_private BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    IF p_include_private THEN
        RETURN QUERY
        SELECT ms.*
        FROM memorial_services ms
        WHERE ms.memorial_id = p_memorial_id
        ORDER BY ms.service_date ASC, ms.service_time ASC NULLS LAST;
    ELSE
        RETURN QUERY
        SELECT ms.*
        FROM memorial_services ms
        WHERE ms.memorial_id = p_memorial_id AND ms.is_private = false
        ORDER BY ms.service_date ASC, ms.service_time ASC NULLS LAST;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON memorial_services TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_memorial_services TO anon, authenticated, service_role;

-- Comments for documentation
COMMENT ON TABLE memorial_services IS 'Stores memorial services and events (funeral, unveiling, visitation, etc.)';
COMMENT ON COLUMN memorial_services.service_type IS 'Type of service: funeral, unveiling, visitation, memorial_service, celebration_of_life, other';
COMMENT ON COLUMN memorial_services.virtual_link IS 'URL for virtual/online attendance (Zoom, YouTube, etc.)';
COMMENT ON COLUMN memorial_services.requires_rsvp IS 'Whether attendees need to RSVP';
COMMENT ON COLUMN memorial_services.is_private IS 'Private services only visible to memorial owner';
