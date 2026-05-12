-- Supabase Database SQL Configuration for TPSC Application

-- 1. Create Supabase Storage Bucket for TPSC Images
-- Set to public access, 50MB size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'tpsc-images', 
    'tpsc-images', 
    true, 
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true, 
    file_size_limit = 52428800;

-- 2. Storage Bucket Policies (Public read, authenticated/anon upload)
-- IMPORTANT CLEANUP: Remove any broad SELECT policy that might expose the list of all files
DROP POLICY IF EXISTS "Public Read Access for tpsc-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads to tpsc-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes from tpsc-images" ON storage.objects;

-- Allow anyone to view images unconditionally
CREATE POLICY "Public Read Access for tpsc-images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'tpsc-images' );

-- Allow uploads to the bucket without enforcing RLS roles (allows anon uploads)
CREATE POLICY "Allow Uploads to tpsc-images" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'tpsc-images' );

-- Allow deletes (if needed)
CREATE POLICY "Allow Deletes from tpsc-images" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'tpsc-images' );


-- 3. Cleanup unused and duplicate tables created by previous scripts
-- We only use local state via Zustand, so these DB tables are not required at the moment.
-- If they are required later, please choose ONE consistent naming convention.
DROP TABLE IF EXISTS "activities";
DROP TABLE IF EXISTS "artwork_gallery";
DROP TABLE IF EXISTS "video_gallery";
DROP TABLE IF EXISTS "winners_artwork";
