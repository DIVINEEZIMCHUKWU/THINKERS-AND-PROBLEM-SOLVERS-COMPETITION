-- Secure admin access to student registrations.
-- Run this in the Supabase SQL Editor before using the admin dashboard.

BEGIN;

INSERT INTO public.admin_settings (id, password)
VALUES ('admin', 'Thinkers123')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  student_policy record;
BEGIN
  FOR student_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'students'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.students', student_policy.policyname);
  END LOOP;
END;
$$;

CREATE POLICY "Allow public student registration" ON public.students
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.admin_verify_password(p_admin_password text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT p_admin_password IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.admin_settings
      WHERE id = 'admin' AND password = p_admin_password
    );
$$;

CREATE OR REPLACE FUNCTION public.admin_set_password(
  p_current_password text,
  p_new_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF p_new_password IS NULL OR length(trim(p_new_password)) < 8 THEN
    RETURN jsonb_build_object('success', false, 'error', 'New password must be at least 8 characters.');
  END IF;

  IF NOT public.admin_verify_password(p_current_password) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Current password validation failed.');
  END IF;

  UPDATE public.admin_settings SET password = p_new_password WHERE id = 'admin';
  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_students(
  p_admin_password text,
  p_offset integer DEFAULT 0,
  p_limit integer DEFAULT 1000
)
RETURNS SETOF public.students
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NOT public.admin_verify_password(p_admin_password) THEN
    RAISE EXCEPTION 'Admin password validation failed';
  END IF;

  RETURN QUERY
  SELECT student.*
  FROM public.students AS student
  ORDER BY coalesce(
    to_jsonb(student)->>'registered_at',
    to_jsonb(student)->>'created_at',
    to_jsonb(student)->>'updated_at'
  ) DESC NULLS LAST, student.id DESC
  OFFSET greatest(coalesce(p_offset, 0), 0)
  LIMIT least(greatest(coalesce(p_limit, 1000), 1), 1000);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_student_status(
  p_admin_password text,
  p_student_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  affected_rows integer;
BEGIN
  IF p_status NOT IN ('Pending', 'Verified') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid student status.');
  END IF;

  IF NOT public.admin_verify_password(p_admin_password) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Admin password validation failed. Log out and sign in again.');
  END IF;

  EXECUTE format('UPDATE public.students SET status = %L WHERE id = $1', p_status)
  USING p_student_id;
  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Student record was not found. Refresh the registrations list.');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_student(
  p_admin_password text,
  p_student_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  affected_rows integer;
BEGIN
  IF NOT public.admin_verify_password(p_admin_password) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Admin password validation failed. Log out and sign in again.');
  END IF;

  DELETE FROM public.students WHERE id = p_student_id;
  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Student record was not found. Refresh the registrations list.');
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_verify_password(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_password(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_students(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_student_status(text, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_delete_student(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_verify_password(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_password(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_students(text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_student_status(text, uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_student(text, uuid) TO anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'students'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
END;
$$;

COMMIT;
