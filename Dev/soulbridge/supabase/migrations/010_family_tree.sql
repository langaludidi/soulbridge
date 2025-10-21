-- ============================================
-- Family Tree Feature
-- Stores family members and relationships
-- ============================================

-- Family Members Table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memorial_id UUID REFERENCES memorials(id) ON DELETE CASCADE NOT NULL,

    -- Basic Information
    full_name TEXT NOT NULL,
    relationship_type TEXT NOT NULL, -- e.g., 'mother', 'father', 'spouse', 'son', 'daughter', 'sibling', 'grandparent', 'grandchild'

    -- Optional Details
    photo_url TEXT,
    date_of_birth DATE,
    date_of_death DATE,
    is_living BOOLEAN DEFAULT true,
    description TEXT,

    -- For building the tree structure
    parent_id UUID REFERENCES family_members(id) ON DELETE SET NULL, -- Reference to parent in tree
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_family_members_memorial_id ON family_members(memorial_id);
CREATE INDEX idx_family_members_relationship ON family_members(relationship_type);
CREATE INDEX idx_family_members_parent_id ON family_members(parent_id);
CREATE INDEX idx_family_members_display_order ON family_members(memorial_id, display_order);

-- Update timestamp trigger
CREATE TRIGGER update_family_members_updated_at
    BEFORE UPDATE ON family_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view family members of public memorials
CREATE POLICY "Anyone can view family members of public memorials"
    ON family_members FOR SELECT
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE status = 'published' AND visibility = 'public'
    ));

-- Memorial owners can view their family members
CREATE POLICY "Memorial owners can view their family members"
    ON family_members FOR SELECT
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

-- Memorial owners can manage family members
CREATE POLICY "Memorial owners can insert family members"
    ON family_members FOR INSERT
    WITH CHECK (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

CREATE POLICY "Memorial owners can update family members"
    ON family_members FOR UPDATE
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

CREATE POLICY "Memorial owners can delete family members"
    ON family_members FOR DELETE
    USING (memorial_id IN (
        SELECT id FROM memorials
        WHERE profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    ));

-- Service role can do everything
CREATE POLICY "Service role can do everything on family members"
    ON family_members FOR ALL
    USING (current_setting('role') = 'service_role');

-- ============================================
-- HELPER FUNCTION
-- ============================================

-- Function to get family tree for a memorial
CREATE OR REPLACE FUNCTION get_family_tree(p_memorial_id UUID)
RETURNS TABLE (
    id UUID,
    memorial_id UUID,
    full_name TEXT,
    relationship_type TEXT,
    photo_url TEXT,
    date_of_birth DATE,
    date_of_death DATE,
    is_living BOOLEAN,
    description TEXT,
    parent_id UUID,
    display_order INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        fm.id,
        fm.memorial_id,
        fm.full_name,
        fm.relationship_type,
        fm.photo_url,
        fm.date_of_birth,
        fm.date_of_death,
        fm.is_living,
        fm.description,
        fm.parent_id,
        fm.display_order,
        fm.created_at
    FROM family_members fm
    WHERE fm.memorial_id = p_memorial_id
    ORDER BY fm.display_order ASC, fm.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_family_tree(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_family_tree(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_family_tree(UUID) TO anon;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE family_members IS 'Family tree members for memorials';
COMMENT ON COLUMN family_members.relationship_type IS 'Type of relationship: mother, father, spouse, son, daughter, sibling, grandparent, grandchild, etc.';
COMMENT ON COLUMN family_members.parent_id IS 'Reference to parent in tree structure (for building hierarchical tree)';
COMMENT ON COLUMN family_members.display_order IS 'Order to display family members within same level';
