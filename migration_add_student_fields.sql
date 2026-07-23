-- Migration Script: Add New Student Fields to Database
-- This script adds the missing columns to the 'students' table in Supabase
-- Execute this in your Supabase SQL Editor

-- ============================================================
-- STEP 1: Add new columns to the students table
-- ============================================================
ALTER TABLE students
ADD COLUMN IF NOT EXISTS lga VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS registration_category VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS level VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS student_class VARCHAR(255) DEFAULT '';

-- Add comments to document the new columns
COMMENT ON COLUMN students.lga IS 'Local Government Area (LGA) - Only populated for Nigerian students';
COMMENT ON COLUMN students.registration_category IS 'Competition category: Painting, French Spelling Bee, Essay Writing, Music and Dance, All';
COMMENT ON COLUMN students.level IS 'Education level: Individual, University, Senior Secondary, Junior Secondary, Primary, Nursery';
COMMENT ON COLUMN students.student_class IS 'Student class based on education level';

-- ============================================================
-- STEP 2: Enable Row-Level Security on students table
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: Create Secure RLS Policies for Public Registration
-- ============================================================

-- Policy 1: Allow anyone to INSERT new student registrations (public registration form)
CREATE POLICY "Allow public student registration" ON students
  FOR INSERT
  WITH CHECK (true);  -- Allow all new registrations from the public form

-- Policy 2: Allow authenticated admins to SELECT/UPDATE/DELETE
-- (This assumes you have a separate admin role)
CREATE POLICY "Allow admin to manage students" ON students
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Allow SELECT for viewing (if needed for dashboard)
CREATE POLICY "Allow SELECT all student records" ON students
  FOR SELECT
  USING (true);  -- Allow viewing all records (adjust if needed)

-- ============================================================
-- STEP 4: Verify the changes
-- ============================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'students';
