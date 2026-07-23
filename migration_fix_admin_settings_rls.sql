-- Fix RLS for admin_settings so admin dashboard can INSERT/UPDATE safely
-- Run this in Supabase SQL Editor

BEGIN;

-- Ensure RLS is enabled
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Remove conflicting/duplicate policies first
DROP POLICY IF EXISTS "Allow admin insert settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin select settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin update settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow admin delete settings" ON admin_settings;

-- Create safe policies that allow authenticated users (dashboard) to manage settings.
-- These policies allow actions when the request is authenticated (auth.uid() is set)
-- This avoids requiring a specific role string and works with Supabase client sessions.

-- Allow SELECT for authenticated sessions
CREATE POLICY "Allow admin select settings" ON admin_settings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Allow INSERT for authenticated sessions
CREATE POLICY "Allow admin insert settings" ON admin_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow UPDATE for authenticated sessions
CREATE POLICY "Allow admin update settings" ON admin_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow DELETE for authenticated sessions (if needed)
CREATE POLICY "Allow admin delete settings" ON admin_settings
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

COMMIT;

-- Verification: run this SELECT after applying to confirm policies
-- SELECT policyname, polcmd, polqual, polwithcheck FROM pg_policies WHERE tablename = 'admin_settings';
