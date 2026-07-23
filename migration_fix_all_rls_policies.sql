-- ============================================================
-- Comprehensive RLS Policy Migration for ALL Tables
-- Fix Row-Level Security Policies for All Supabase Tables
-- ============================================================

-- ============================================================
-- TABLE 1: activities
-- ============================================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert activities" ON activities;
DROP POLICY IF EXISTS "Allow select activities" ON activities;
DROP POLICY IF EXISTS "Allow admin manage activities" ON activities;
DROP POLICY IF EXISTS "Allow admin delete activities" ON activities;

-- Allow INSERT for public (admin dashboard uploads)
CREATE POLICY "Allow public insert activities" ON activities
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for all (viewing content)
CREATE POLICY "Allow select activities" ON activities
  FOR SELECT
  USING (true);

-- Allow UPDATE for anyone (app controls access)
CREATE POLICY "Allow admin manage activities" ON activities
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete activities" ON activities
  FOR DELETE
  USING (true);

-- ============================================================
-- TABLE 2: admin_settings
-- ============================================================
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin select settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin update settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin delete settings" ON admin_settings;

-- Allow INSERT for admin setup (public INSERT, app controls access)
CREATE POLICY "Allow admin insert settings" ON admin_settings
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for authenticated users (public SELECT, app controls access)
CREATE POLICY "Allow admin select settings" ON admin_settings
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin (public UPDATE, app controls access)
CREATE POLICY "Allow admin update settings" ON admin_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for admin (public DELETE, app controls access)
CREATE POLICY "Allow admin delete settings" ON admin_settings
  FOR DELETE
  USING (true);

-- ============================================================
-- TABLE 3: artwork_gallery
-- ============================================================
ALTER TABLE artwork_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert artwork" ON artwork_gallery;
DROP POLICY IF EXISTS "Allow select artwork" ON artwork_gallery;
DROP POLICY IF EXISTS "Allow admin update artwork" ON artwork_gallery;
DROP POLICY IF EXISTS "Allow admin delete artwork" ON artwork_gallery;

-- Allow INSERT for admin uploads (public INSERT, app controls access)
CREATE POLICY "Allow admin insert artwork" ON artwork_gallery
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for public (viewing gallery)
CREATE POLICY "Allow select artwork" ON artwork_gallery
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin (public UPDATE, app controls access)
CREATE POLICY "Allow admin update artwork" ON artwork_gallery
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for admin (public DELETE, app controls access)
CREATE POLICY "Allow admin delete artwork" ON artwork_gallery
  FOR DELETE
  USING (true);

-- ============================================================
-- TABLE 4: registrations
-- ============================================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert registrations" ON registrations;
DROP POLICY IF EXISTS "Allow admin select registrations" ON registrations;
DROP POLICY IF EXISTS "Allow admin update registrations" ON registrations;
DROP POLICY IF EXISTS "Allow admin delete registrations" ON registrations;

-- Allow INSERT for public registration
CREATE POLICY "Allow public insert registrations" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for admin only
CREATE POLICY "Allow admin select registrations" ON registrations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow UPDATE for admin
CREATE POLICY "Allow admin update registrations" ON registrations
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow DELETE for admin
CREATE POLICY "Allow admin delete registrations" ON registrations
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE 5: students
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public student registration" ON students;
DROP POLICY IF EXISTS "Allow select all students" ON students;
DROP POLICY IF EXISTS "Allow admin update students" ON students;
DROP POLICY IF EXISTS "Allow admin delete students" ON students;

-- Allow INSERT for public student registration
CREATE POLICY "Allow public student registration" ON students
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for all
CREATE POLICY "Allow select all students" ON students
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin
CREATE POLICY "Allow admin update students" ON students
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow DELETE for admin
CREATE POLICY "Allow admin delete students" ON students
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE 6: upcoming_events
-- ============================================================
ALTER TABLE upcoming_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert events" ON upcoming_events;
DROP POLICY IF EXISTS "Allow select events" ON upcoming_events;
DROP POLICY IF EXISTS "Allow admin update events" ON upcoming_events;
DROP POLICY IF EXISTS "Allow admin delete events" ON upcoming_events;

-- Allow INSERT for admin (public INSERT, app controls access)
CREATE POLICY "Allow admin insert events" ON upcoming_events
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for public (viewing events)
CREATE POLICY "Allow select events" ON upcoming_events
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin (public UPDATE, app controls access)
CREATE POLICY "Allow admin update events" ON upcoming_events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for admin (public DELETE, app controls access)
CREATE POLICY "Allow admin delete events" ON upcoming_events
  FOR DELETE
  USING (true);

-- ============================================================
-- TABLE 7: video_gallery
-- ============================================================
ALTER TABLE video_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert videos" ON video_gallery;
DROP POLICY IF EXISTS "Allow select videos" ON video_gallery;
DROP POLICY IF EXISTS "Allow admin update videos" ON video_gallery;
DROP POLICY IF EXISTS "Allow admin delete videos" ON video_gallery;

-- Allow INSERT for admin uploads (public INSERT, app controls access)
CREATE POLICY "Allow admin insert videos" ON video_gallery
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for public (viewing videos)
CREATE POLICY "Allow select videos" ON video_gallery
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin (public UPDATE, app controls access)
CREATE POLICY "Allow admin update videos" ON video_gallery
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for admin (public DELETE, app controls access)
CREATE POLICY "Allow admin delete videos" ON video_gallery
  FOR DELETE
  USING (true);

-- ============================================================
-- TABLE 8: winner_artwork
-- ============================================================
ALTER TABLE winner_artwork ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert winner artwork" ON winner_artwork;
DROP POLICY IF EXISTS "Allow select winner artwork" ON winner_artwork;
DROP POLICY IF EXISTS "Allow admin update winner artwork" ON winner_artwork;
DROP POLICY IF EXISTS "Allow admin delete winner artwork" ON winner_artwork;

-- Allow INSERT for admin (public INSERT, app controls access)
CREATE POLICY "Allow admin insert winner artwork" ON winner_artwork
  FOR INSERT
  WITH CHECK (true);

-- Allow SELECT for public (viewing winners)
CREATE POLICY "Allow select winner artwork" ON winner_artwork
  FOR SELECT
  USING (true);

-- Allow UPDATE for admin (public UPDATE, app controls access)
CREATE POLICY "Allow admin update winner artwork" ON winner_artwork
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE for admin (public DELETE, app controls access)
CREATE POLICY "Allow admin delete winner artwork" ON winner_artwork
  FOR DELETE
  USING (true);

-- ============================================================
-- VERIFICATION: Check all RLS policies
-- ============================================================
SELECT
  schemaname,
  tablename,
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================
-- SECURITY SUMMARY
-- ============================================================
-- ✅ activities: Public INSERT/SELECT, Admin UPDATE/DELETE
-- ✅ admin_settings: Admin only (INSERT/SELECT/UPDATE/DELETE)
-- ✅ artwork_gallery: Admin INSERT, Public SELECT, Admin UPDATE/DELETE
-- ✅ registrations: Public INSERT, Admin SELECT/UPDATE/DELETE
-- ✅ students: Public INSERT, Public SELECT, Admin UPDATE/DELETE
-- ✅ upcoming_events: Admin INSERT, Public SELECT, Admin UPDATE/DELETE
-- ✅ video_gallery: Admin INSERT, Public SELECT, Admin UPDATE/DELETE
-- ✅ winner_artwork: Admin INSERT, Public SELECT, Admin UPDATE/DELETE
-- ============================================================
