-- ============================================
-- SoulBridge MVP - Initial Database Schema
-- Phase 2: User Profile Management
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT GENERATED ALWAYS AS (
        CASE
            WHEN first_name IS NOT NULL AND last_name IS NOT NULL
            THEN first_name || ' ' || last_name
            WHEN first_name IS NOT NULL
            THEN first_name
            WHEN last_name IS NOT NULL
            THEN last_name
            ELSE NULL
        END
    ) STORED,
    avatar_url TEXT,
    phone_number TEXT,
    date_of_birth DATE,

    -- Address fields
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'South Africa',

    -- Preferences
    preferred_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Africa/Johannesburg',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,

    -- User role and status
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),

    -- Custom metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_sign_in_at TIMESTAMPTZ
);

-- Indexes for profiles table
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    clerk_session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    signed_in_at TIMESTAMPTZ DEFAULT NOW(),
    signed_out_at TIMESTAMPTZ,
    session_duration INTERVAL GENERATED ALWAYS AS (
        signed_out_at - signed_in_at
    ) STORED
);

-- Indexes for user_sessions table
CREATE INDEX idx_user_sessions_profile_id ON user_sessions(profile_id);
CREATE INDEX idx_user_sessions_signed_in_at ON user_sessions(signed_in_at DESC);
CREATE INDEX idx_user_sessions_clerk_session_id ON user_sessions(clerk_session_id);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit_logs table
CREATE INDEX idx_audit_logs_profile_id ON audit_logs(profile_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (profile_id, action, resource_type, resource_id, old_values, new_values)
        VALUES (
            NEW.id,
            'profile.updated',
            'profile',
            NEW.id::TEXT,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (profile_id, action, resource_type, resource_id, new_values)
        VALUES (
            NEW.id,
            'profile.created',
            'profile',
            NEW.id::TEXT,
            to_jsonb(NEW)
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (profile_id, action, resource_type, resource_id, old_values)
        VALUES (
            OLD.id,
            'profile.deleted',
            'profile',
            OLD.id::TEXT,
            to_jsonb(OLD)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for audit logging
CREATE TRIGGER log_profile_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_changes();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Service role can do everything on profiles"
    ON profiles FOR ALL
    USING (current_setting('role') = 'service_role');

-- User sessions policies
CREATE POLICY "Users can view their own sessions"
    ON user_sessions FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Service role can do everything on sessions"
    ON user_sessions FOR ALL
    USING (current_setting('role') = 'service_role');

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs"
    ON audit_logs FOR SELECT
    USING (
        profile_id IN (
            SELECT id FROM profiles
            WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Service role can do everything on audit logs"
    ON audit_logs FOR ALL
    USING (current_setting('role') = 'service_role');

-- ============================================
-- VIEWS
-- ============================================

-- View for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT
    p.id,
    p.clerk_user_id,
    p.email,
    p.full_name,
    p.role,
    p.status,
    p.created_at,
    p.last_sign_in_at,
    COUNT(DISTINCT us.id) as total_sessions,
    COUNT(DISTINCT al.id) as total_actions
FROM profiles p
LEFT JOIN user_sessions us ON p.id = us.profile_id
LEFT JOIN audit_logs al ON p.id = al.profile_id
GROUP BY p.id;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a test admin user (optional - remove in production)
-- INSERT INTO profiles (clerk_user_id, email, first_name, last_name, role)
-- VALUES ('test_admin', 'admin@soulbridge.com', 'Admin', 'User', 'admin');

-- ============================================
-- GRANTS (Optional - adjust as needed)
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- Grant permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles synced from Clerk';
COMMENT ON TABLE user_sessions IS 'Track user sign-in sessions';
COMMENT ON TABLE audit_logs IS 'Audit trail of all user actions';
COMMENT ON COLUMN profiles.clerk_user_id IS 'Clerk user ID for authentication';
COMMENT ON COLUMN profiles.full_name IS 'Auto-generated from first_name and last_name';
COMMENT ON COLUMN profiles.notification_preferences IS 'JSONB object with email, sms, push preferences';
COMMENT ON COLUMN profiles.metadata IS 'Custom fields for future extensibility';
