-- Check current memorial slugs
SELECT
  slug,
  first_name || ' ' || last_name AS full_name,
  created_at
FROM memorials
ORDER BY created_at DESC
LIMIT 20;
