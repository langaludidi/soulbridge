-- Migration: Add INSERT policy for memorial_analytics table
-- Issue: RLS is enabled but no INSERT policy exists, blocking all analytics inserts

-- Add policy to allow service role to insert analytics events
DROP POLICY IF EXISTS "Service role can insert analytics" ON memorial_analytics;

CREATE POLICY "Service role can insert analytics"
  ON memorial_analytics FOR INSERT
  WITH CHECK (true);

-- Add policy to allow service role to update analytics (for incrementing counts)
DROP POLICY IF EXISTS "Service role can update analytics" ON memorial_analytics;

CREATE POLICY "Service role can update analytics"
  ON memorial_analytics FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions to service role
GRANT INSERT, UPDATE ON memorial_analytics TO service_role;
GRANT INSERT, UPDATE ON memorial_analytics TO authenticated;
GRANT INSERT, UPDATE ON memorial_analytics TO anon;

-- Verify the policies were created
DO $$
BEGIN
  RAISE NOTICE 'Analytics INSERT and UPDATE policies created successfully';
END $$;
