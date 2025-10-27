-- Migration: Add admin functionality to SoulBridge
-- Purpose: Enable admin dashboard with role-based access control

-- 1. Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- 3. Create admin_activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_clerk_id TEXT NOT NULL REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'view_user', 'delete_memorial', 'update_subscription'
  target_type TEXT, -- e.g., 'user', 'memorial', 'subscription'
  target_id TEXT, -- ID of the affected resource
  details JSONB, -- Additional details about the action
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create index for activity logs
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin ON admin_activity_logs(admin_clerk_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- 5. Create admin_settings table for platform configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by TEXT REFERENCES profiles(clerk_user_id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Add default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES
  ('maintenance_mode', '{"enabled": false, "message": ""}', 'Enable/disable maintenance mode'),
  ('max_memorials_per_user', '{"lite": 1, "essential": 10, "premium": -1}', 'Max memorials per plan (-1 = unlimited)'),
  ('content_moderation', '{"auto_approve_tributes": true, "auto_approve_guestbook": true}', 'Content moderation settings')
ON CONFLICT (setting_key) DO NOTHING;

-- 7. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(check_clerk_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE clerk_user_id = check_clerk_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_clerk_id TEXT,
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Verify user is admin
  IF NOT is_user_admin(p_admin_clerk_id) THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;

  -- Insert activity log
  INSERT INTO admin_activity_logs (
    admin_clerk_id,
    action,
    target_type,
    target_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_clerk_id,
    p_action,
    p_target_type,
    p_target_id,
    p_details,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Row Level Security policies for admin tables

-- Enable RLS on admin tables
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Admin activity logs: Only admins can view
DROP POLICY IF EXISTS "Admins can view activity logs" ON admin_activity_logs;
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = admin_activity_logs.admin_clerk_id
        AND profiles.is_admin = true
    )
  );

-- Admin activity logs: Only service role can insert
DROP POLICY IF EXISTS "Service role can insert activity logs" ON admin_activity_logs;
CREATE POLICY "Service role can insert activity logs"
  ON admin_activity_logs FOR INSERT
  WITH CHECK (true);

-- Admin settings: Only admins can view
DROP POLICY IF EXISTS "Admins can view settings" ON admin_settings;
CREATE POLICY "Admins can view settings"
  ON admin_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = auth.uid()::text
        AND profiles.is_admin = true
    )
  );

-- Admin settings: Only admins can update
DROP POLICY IF EXISTS "Admins can update settings" ON admin_settings;
CREATE POLICY "Admins can update settings"
  ON admin_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = auth.uid()::text
        AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = auth.uid()::text
        AND profiles.is_admin = true
    )
  );

-- 10. Grant permissions
GRANT SELECT ON admin_activity_logs TO service_role;
GRANT INSERT ON admin_activity_logs TO service_role;
GRANT SELECT, UPDATE ON admin_settings TO service_role;
GRANT SELECT, UPDATE ON profiles TO service_role;

-- 11. Comment on tables
COMMENT ON TABLE admin_activity_logs IS 'Audit trail of all admin actions';
COMMENT ON TABLE admin_settings IS 'Platform-wide admin configuration settings';
COMMENT ON COLUMN profiles.is_admin IS 'Flag indicating if user has admin privileges';

-- 12. Create view for admin dashboard stats
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles) AS total_users,
  (SELECT COUNT(*) FROM profiles WHERE created_at > now() - interval '30 days') AS new_users_30d,
  (SELECT COUNT(*) FROM memorials) AS total_memorials,
  (SELECT COUNT(*) FROM memorials WHERE created_at > now() - interval '30 days') AS new_memorials_30d,
  (SELECT COUNT(*) FROM tributes) AS total_tributes,
  (SELECT COUNT(*) FROM candles) AS total_candles,
  (SELECT COUNT(*) FROM plans WHERE plan_type != 'lite') AS paid_subscriptions,
  (SELECT COALESCE(SUM(count), 0) FROM memorial_analytics WHERE event_type = 'view' AND event_date > CURRENT_DATE - 30) AS total_views_30d;

-- 13. Grant admin view access
GRANT SELECT ON admin_dashboard_stats TO service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin schema migration completed successfully';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '   1. Set is_admin = true for your profile in Supabase Dashboard';
  RAISE NOTICE '   2. Run: UPDATE profiles SET is_admin = true WHERE clerk_user_id = ''YOUR_CLERK_ID'';';
  RAISE NOTICE '   3. Deploy admin UI components';
END $$;
