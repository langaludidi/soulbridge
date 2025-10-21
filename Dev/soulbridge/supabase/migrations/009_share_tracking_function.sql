-- ============================================
-- MIGRATION: Share Tracking Function
-- Description: Create increment_share_count function for social sharing analytics
-- ============================================

-- Function to increment share count on memorial
CREATE OR REPLACE FUNCTION increment_share_count(memorial_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE memorials
  SET share_count = COALESCE(share_count, 0) + 1
  WHERE id = memorial_id;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_share_count(UUID) TO anon;

COMMENT ON FUNCTION increment_share_count(UUID) IS 'Increments the share count for a memorial when shared on social media';
