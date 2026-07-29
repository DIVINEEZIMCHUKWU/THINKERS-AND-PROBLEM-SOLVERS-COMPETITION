-- =====================================================================
-- SUPABASE MIGRATION: ART MATERIALS & COLORS AVAILABLE
-- (Idempotent — safe to run multiple times in Supabase SQL Editor)
-- =====================================================================
-- This script creates the art_materials table used by the Admin Dashboard
-- ("Art Materials" tab). Run the ENTIRE script in your Supabase project
-- SQL Editor at: https://app.supabase.com/project/<PROJECT-ID>/sql/new
--
-- It supports:
--   • Admin adding items via image upload OR image URL + description
--   • Custom display ordering (display_order column)
--   • Permissive RLS policies matching the rest of the TPSC schema
--   • Auto updated_at timestamp triggers
-- =====================================================================

-- ---------- (1) Ensure helper trigger fn exists ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- ---------- (2) Create art_materials table ----------
CREATE TABLE IF NOT EXISTS public.art_materials (
    id              VARCHAR(50)     PRIMARY KEY,                          -- Matches store.ts random short IDs (Math.random().toString(36).substr(2,9))
    title           VARCHAR(500)    NOT NULL,                             -- e.g. "ARTIST BOX, 150 ART SET"
    description     TEXT            NOT NULL,                             -- Full description incl price / brand
    image_url       VARCHAR(1024)   NOT NULL DEFAULT '',                  -- Image URL (ibb.co CDN OR Supabase storage public URL)
    display_order   INTEGER         NOT NULL DEFAULT 1,                   -- Custom sort order, lower = earlier in the grid
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ---------- (3) Index for fast display_order sorting ----------
CREATE INDEX IF NOT EXISTS idx_art_materials_display_order
    ON public.art_materials (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_art_materials_created_at
    ON public.art_materials (created_at DESC);

-- ---------- (4) Comments (visible in Supabase Table Editor) ----------
COMMENT ON TABLE  public.art_materials               IS 'Items displayed in the "ART MATERIALS & COLORS AVAILABLE" section on the Homepage.';
COMMENT ON COLUMN public.art_materials.id            IS 'Client-generated short ID; matches the Zustand store.';
COMMENT ON COLUMN public.art_materials.title         IS 'Short title shown under the image card.';
COMMENT ON COLUMN public.art_materials.description   IS 'Full description; may contain brand, price, and line breaks.';
COMMENT ON COLUMN public.art_materials.image_url     IS 'Remote URL OR Supabase storage public URL for the art product photo.';
COMMENT ON COLUMN public.art_materials.display_order IS 'Position: 1 = first card; admin controls this in the Art Materials tab.';

-- ---------- (5) Enable RLS + permissive policies ----------
ALTER TABLE public.art_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS art_materials_allow_all_select ON public.art_materials;
CREATE POLICY art_materials_allow_all_select
    ON public.art_materials FOR SELECT
    USING (true);

DROP POLICY IF EXISTS art_materials_allow_all_insert ON public.art_materials;
CREATE POLICY art_materials_allow_all_insert
    ON public.art_materials FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS art_materials_allow_all_update ON public.art_materials;
CREATE POLICY art_materials_allow_all_update
    ON public.art_materials FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS art_materials_allow_all_delete ON public.art_materials;
CREATE POLICY art_materials_allow_all_delete
    ON public.art_materials FOR DELETE
    USING (true);

-- ---------- (6) updated_at auto-trigger ----------
DROP TRIGGER IF EXISTS trg_art_materials_updated_at ON public.art_materials;
CREATE TRIGGER trg_art_materials_updated_at
BEFORE UPDATE ON public.art_materials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- (7) INITIAL SEED DATA — the 18 default art materials
--     (Skip this section if you plan to add items manually via Admin)
--     UPSERT (ON CONFLICT DO NOTHING) is used so the script stays
--     idempotent even after the admin adds / edits their own items.
-- =====================================================================

INSERT INTO public.art_materials (id, title, description, image_url, display_order, created_at, updated_at)
VALUES
    ('am001', 'ARTIST BOX, 150 ART SET',
     'ARTIST BOX, 150 ART SET - N54,000',
     'https://i.ibb.co/KpsrYSBk/IMG-20260728-WA0042.jpg', 1, NOW(), NOW()),

    ('am002', 'Crayola 24 Mini Kids Maxi Wax Crayons',
     'Crayola 24 Mini Kids Maxi Wax Crayons - Assorted Colors Brand: Crayola | Similar Products from Crayola N33,250',
     'https://i.ibb.co/vCmsn7Y8/IMG-20260728-WA0043.jpg', 2, NOW(), NOW()),

    ('am003', 'Monami 12 Color Poster Paint Set',
     'Monami 12 Color Poster Paint Set - Premium Water-Based Art Colors with Portable Storage Case. Brand: Monami | Similar Products from Monami - N13,350',
     'https://i.ibb.co/4nsb5R31/IMG-20260728-WA0044.jpg', 3, NOW(), NOW()),

    ('am004', '12Pcs Artist Paint Brush Pen',
     '12Pcs Artist Paint Brush Pen for Acrylic, Oil Painting, Drawing - N17,500',
     'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', 4, NOW(), NOW()),

    ('am005', '32Pcs Oil Painting Brush Set',
     '32Pcs Oil Painting Brush Set, Nylon Hair Brush Set - N24,400',
     'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', 5, NOW(), NOW()),

    ('am006', 'Paint Runner Roller Pro Kit',
     'Paint Runner Roller Pro Rollers Wall Painting Kit, Walls Brush Handle Tool, Home Garden+Extension Pole Tube DIY - N55,450',
     'https://i.ibb.co/ZyyccL4/IMG-20260728-WA0046.jpg', 6, NOW(), NOW()),

    ('am007', '17 Holes Non-Stick Paint Palette',
     '17 Holes Non-Stick Paint Palette/Artist Paint Mixing Tray - N16,500',
     'https://i.ibb.co/2bnNBcQ/IMG-20260728-WA0047.jpg', 7, NOW(), NOW()),

    ('am008', '5 Painting Knives Stainless Spatula',
     '5 Painting Knives Stainless Spatula Palette Knife - N19,999',
     'https://i.ibb.co/Tqbw1P5w/IMG-20260728-WA0048.jpg', 8, NOW(), NOW()),

    ('am009', '35Pcs Professional Sketching Drawing Kit',
     '35Pcs Professional Sketching Drawing Artist Kit, Sketch Pencils, Charcoal Art Tools Set - N18,994',
     'https://i.ibb.co/sdt2cZBX/IMG-20260728-WA0049.jpg', 9, NOW(), NOW()),

    ('am010', 'Digabi 24 Colors Dual-Ended Colored Pencils',
     'Digabi 12pcs/24 Colors Dual-Ended Water-Soluble Colored Pencils - 24 Vibrant Colors, Triangular Log Sketch Art Supplies, Suitable for Schools, Offices, And Artists, Office Art Supplies, Vivid Art Supplies, Durable Art Materials, Colored Pencil Set
Brand: Digabi | Similar products from Digabi
₦ 21,026',
     'https://i.ibb.co/6J7fYgVQ/IMG-20260728-WA0050.jpg', 10, NOW(), NOW()),

    ('am011', '72pcs Professional Drawing Artist Kit',
     '72pcs Professional Drawing Artist Kit Set Art & Bag
₦ 32,984',
     'https://i.ibb.co/tPN8VkQR/IMG-20260728-WA0051.jpg', 11, NOW(), NOW()),

    ('am012', 'Early Education Kiddies Complete Artistic Set',
     'Early Education Kiddies Complete Artistic set Drawing And Painting Art Kit With Colourful Pencils - 208 Pieces - Pink
₦ 39,000',
     'https://i.ibb.co/5hfkQh77/IMG-20260728-WA0052.jpg', 12, NOW(), NOW()),

    ('am013', 'OVO TOUMI 80 Colors Art Markers',
     'OVO TOUMI 80 Colors Art Markers Set Double Tip Broad Fine Point Marker Pen
Brand: OVO TOUMI | Similar products from OVO TOUMI
₦ 30,800',
     'https://i.ibb.co/NdhV9yh4/IMG-20260728-WA0053.jpg', 13, NOW(), NOW()),

    ('am014', '24-Color Oil-Based Colored Pencils',
     '24-Color Oil-Based Colored Pencils Set: Student/Kids Art Drawing Pencils (Thick Tip)
₦ 8,880',
     'https://i.ibb.co/wZ847gjc/IMG-20260728-WA0054.jpg', 14, NOW(), NOW()),

    ('am015', 'OVO TOUMI 150pcs Art Drawing Set',
     'OVO TOUMI 150pcs Art Drawing Set Painting Sketching Color Pen
Brand: OVO TOUMI | Similar products from OVO TOUMI
₦ 18,480 - N18,480',
     'https://i.ibb.co/xrdzjcT/IMG-20260728-WA0055.jpg', 15, NOW(), NOW()),

    ('am016', '14Pcs Professional Sketch Pencil Set',
     '14Pcs/Set Professional Sketch Pencil Set HB 2B Graphite Art Drawing Pencil School Stationery
₦ 26,705',
     'https://i.ibb.co/QvPXysVm/IMG-20260728-WA0056.jpg', 16, NOW(), NOW()),

    ('am017', 'Poster Colours 60ml x12',
     'Poster Colours 60ml x12 N18,450.00',
     'https://i.ibb.co/yFJ0PxDt/IMG-20260728-WA0057.jpg', 17, NOW(), NOW()),

    ('am018', 'Pure White Cotton Hankerchief 12 Pieces',
     'Pure White Cotton Hankerchief I 12 Pieces
₦ 6,700',
     'https://i.ibb.co/ZRF5wFYZ/IMG-20260728-WA0058.jpg', 18, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- (8) Optional: Realtime Publication — subscribe from the client
--     If you want client-side IndexedDB auto-sync with Supabase.
--
-- NOTE: Supabase PostgreSQL does NOT allow standalone BEGIN..EXCEPTION
-- blocks at the SQL level.  We wrap the optional publication DDL in a
-- DO $$ ... $$ anonymous PL/pgSQL block so that any permission /
-- replication errors are swallowed harmlessly as NOTICEs instead of
-- failing the entire migration with 42601: syntax error at or near
-- "EXCEPTION".  Run the whole script end-to-end; it is idempotent.
-- =====================================================================
DO $$
BEGIN
  DROP PUBLICATION IF EXISTS tpsc_art_materials_pub;
  CREATE PUBLICATION tpsc_art_materials_pub FOR TABLE public.art_materials;
EXCEPTION
  WHEN OTHERS THEN
    -- Publication / replication features may be restricted on some
    -- Supabase tiers.  The core table + CRUD still work without it.
    RAISE NOTICE 'Skipping optional realtime publication creation (%: %)', SQLSTATE, SQLERRM;
END $$;

-- =====================================================================
-- FINISHED — you should now see the art_materials table in the
-- Supabase Table Editor. The Admin Dashboard "Art Materials" tab
-- reads & writes to this table.
--
-- To verify, run this in Supabase SQL Editor AFTER the script:
--   SELECT id, title, display_order FROM public.art_materials ORDER BY display_order;
-- =====================================================================
