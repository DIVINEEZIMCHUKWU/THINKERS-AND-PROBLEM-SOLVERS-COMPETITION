-- Idempotent fix for admin_settings RLS policy conflicts
-- Drops any existing policies with the same names then creates secure policies
-- Run in Supabase SQL Editor

BEGIN;

-- Ensure RLS is enabled
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies (safe even if they don't exist)
DROP POLICY IF EXISTS "Allow admin insert settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin select settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin update settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin delete settings" ON public.admin_settings;

-- Recreate policies: allow only authenticated sessions (auth.uid() IS NOT NULL)
-- This ensures the admin dashboard user (signed-in) can update settings, while public cannot.
CREATE POLICY "Allow admin select settings" ON public.admin_settings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin insert settings" ON public.admin_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin update settings" ON public.admin_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin delete settings" ON public.admin_settings
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

COMMIT;

-- Verification (optional):
-- SELECT policyname, polcmd, polqual, polwithcheck FROM pg_policies WHERE tablename = 'admin_settings';
