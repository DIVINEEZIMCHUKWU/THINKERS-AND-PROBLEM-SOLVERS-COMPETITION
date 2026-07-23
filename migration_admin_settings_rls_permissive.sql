-- Permissive RLS for admin_settings (temporary)
-- Use this only for debugging. It allows the Admin Dashboard to INSERT/UPDATE/DELETE.
-- After verifying the dashboard works, revert to stricter policies (see note below).

BEGIN;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Allow admin select settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin insert settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin update settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Allow admin delete settings" ON public.admin_settings;

-- Permissive policies (allow dashboard writes from the client)
CREATE POLICY "Allow admin select settings" ON public.admin_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin insert settings" ON public.admin_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin update settings" ON public.admin_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete settings" ON public.admin_settings
  FOR DELETE
  USING (true);

COMMIT;

-- Verification queries (run after applying):
-- 1) List policies: SELECT policyname, polcmd, polqual, polwithcheck FROM pg_policies WHERE tablename = 'admin_settings';
-- 2) Test a small update from the dashboard or via SQL to confirm changes.

-- SECURITY NOTE:
-- These policies are intentionally permissive and should only be used temporarily
-- if you cannot sign-in the dashboard client as an authenticated user. Once you've
-- confirmed writes work, replace these with the stricter policies that require
-- authentication (e.g., USING (auth.uid() IS NOT NULL)).
