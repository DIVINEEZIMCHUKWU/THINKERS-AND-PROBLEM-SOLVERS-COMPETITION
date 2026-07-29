-- =====================================================================
--  TPSC SKILL ACQUISITION MODULE — ADMIN DASHBOARD SQL SCRIPT (8 tables)
--  Idempotent — SAFE TO RUN MANY TIMES in Supabase SQL Editor.
--  All other tables (students, winners, activities, videos, etc.)
--  already work perfectly — this script is ONLY for the Skill
--  Acquisition tab + Art Materials tab in Admin Dashboard, so that
--  every Add/Edit/Delete/Toggle Live action reflects on the website.
--
--  Run the ENTIRE script here (all at once):
--    https://app.supabase.com/project/<YOUR-PROJECT-ID>/sql/new
--
--  TABLES CREATED (all under schema "public"):
--    1. skill_settings        — single-row hero/contact/registration status
--    2. skill_sponsors        — "Proudly Supported By" sponsor logos
--    3. skill_partners        — partner logos section
--    4. skill_courses         — courses / skills to learn
--    5. skill_gallery         — photo gallery (upload OR URL)
--    6. skill_highlights      — hero headline stats
--    7. skill_programmes      — one-click activate / delete sponsor
--                               programmes (NDDC, future sponsors, etc.)
--    8. art_materials         — "ART MATERIALS & COLORS AVAILABLE"
--                               homepage section (18 default items seeded)
--
--  ON EVERY TABLE:
--    • Row Level Security (RLS) + 4 permissive policies
--      (SELECT / INSERT / UPDATE / DELETE open)
--    • auto-"updated_at" BEFORE UPDATE trigger = NOW()
--    • BTREE indexes for display_order, status, category, type
--    • COMMENTs for Supabase Table Editor
--  PLUS:
--    • Idempotent UPSERT seed data (skill_settings row + 18 art materials)
--    • Optional realtime publications for all 8 tables (each wrapped
--      in DO $$ … $$ so permission errors become harmless NOTICEs)
-- =====================================================================

-- =====================================================================
--  (0) Shared helper — the "update_updated_at_column" trigger fn
-- =====================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';


-- =====================================================================
--  1. skill_settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_settings (
    id                  VARCHAR(50)     PRIMARY KEY DEFAULT 'programme',
    hero_title          VARCHAR(500)    NOT NULL DEFAULT 'FREE 6-Month Skills Acquisition Programme',
    hero_subtitle       VARCHAR(500)    NOT NULL DEFAULT 'Empower Your Future. Learn a Skill for Free.',
    hero_description    TEXT            NOT NULL DEFAULT '',
    programme_status    VARCHAR(20)     NOT NULL DEFAULT 'open'
                        CHECK (programme_status IN ('open','closed','paused')),
    registration_open   BOOLEAN         NOT NULL DEFAULT TRUE,
    banner_image_1      VARCHAR(1024)   NOT NULL DEFAULT '',
    banner_image_2      VARCHAR(1024)   NOT NULL DEFAULT '',
    contact_location    VARCHAR(500)    NOT NULL DEFAULT 'Port Harcourt, Rivers State, Nigeria',
    contact_phone       VARCHAR(100)    NOT NULL DEFAULT '+234 810 383 3239',
    contact_email       VARCHAR(255)    NOT NULL DEFAULT 'worldthinkerscompetition@gmail.com',
    contact_website     VARCHAR(255)    NOT NULL DEFAULT 'www.thinkersproblemsolvers.com',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.skill_settings IS 'Single-row hero + contact settings for Skill Acquisition page.';
COMMENT ON COLUMN public.skill_settings.id IS 'Always id="programme" (single-row table).';

ALTER TABLE public.skill_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_settings_allow_all_select ON public.skill_settings;
CREATE POLICY skill_settings_allow_all_select
    ON public.skill_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_settings_allow_all_insert ON public.skill_settings;
CREATE POLICY skill_settings_allow_all_insert
    ON public.skill_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_settings_allow_all_update ON public.skill_settings;
CREATE POLICY skill_settings_allow_all_update
    ON public.skill_settings FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_settings_allow_all_delete ON public.skill_settings;
CREATE POLICY skill_settings_allow_all_delete
    ON public.skill_settings FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_settings_updated_at ON public.skill_settings;
CREATE TRIGGER trg_skill_settings_updated_at
BEFORE UPDATE ON public.skill_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed single default row (idempotent)
INSERT INTO public.skill_settings (id) VALUES ('programme')
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
--  2. skill_sponsors
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_sponsors (
    id              VARCHAR(50)     PRIMARY KEY,
    name            VARCHAR(500)    NOT NULL,
    logo_url        VARCHAR(1024)   NOT NULL DEFAULT '',
    website         VARCHAR(1024)   NOT NULL DEFAULT '',
    description     TEXT            NOT NULL DEFAULT '',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_sponsors_order
    ON public.skill_sponsors (display_order ASC);

COMMENT ON TABLE public.skill_sponsors IS '"Proudly Supported By" logos. Admin uploads OR pastes a URL.';

ALTER TABLE public.skill_sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_sponsors_allow_all_select ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_select
    ON public.skill_sponsors FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_insert ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_insert
    ON public.skill_sponsors FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_update ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_update
    ON public.skill_sponsors FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_delete ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_delete
    ON public.skill_sponsors FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_sponsors_updated_at ON public.skill_sponsors;
CREATE TRIGGER trg_skill_sponsors_updated_at
BEFORE UPDATE ON public.skill_sponsors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  3. skill_partners
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_partners (
    id              VARCHAR(50)     PRIMARY KEY,
    name            VARCHAR(500)    NOT NULL,
    logo_url        VARCHAR(1024)   NOT NULL DEFAULT '',
    website         VARCHAR(1024)   NOT NULL DEFAULT '',
    description     TEXT            NOT NULL DEFAULT '',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_partners_order
    ON public.skill_partners (display_order ASC);

COMMENT ON TABLE public.skill_partners IS 'Partner logos — rendered next to sponsors.';

ALTER TABLE public.skill_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_partners_allow_all_select ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_select
    ON public.skill_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_partners_allow_all_insert ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_insert
    ON public.skill_partners FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_partners_allow_all_update ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_update
    ON public.skill_partners FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_partners_allow_all_delete ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_delete
    ON public.skill_partners FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_partners_updated_at ON public.skill_partners;
CREATE TRIGGER trg_skill_partners_updated_at
BEFORE UPDATE ON public.skill_partners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  4. skill_courses
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_courses (
    id              VARCHAR(50)     PRIMARY KEY,
    title           VARCHAR(500)    NOT NULL,
    category        VARCHAR(100)    NOT NULL DEFAULT 'main'
                        CHECK (category IN ('main','digital','vocational','business')),
    description     TEXT            NOT NULL DEFAULT '',
    icon_key        VARCHAR(100)    NOT NULL DEFAULT 'Palette',
    color_class     VARCHAR(255)    NOT NULL DEFAULT 'from-primary to-emerald-600',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_courses_order
    ON public.skill_courses (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_skill_courses_category
    ON public.skill_courses (category);

COMMENT ON TABLE public.skill_courses IS 'Courses / Skills the programme teaches.';

ALTER TABLE public.skill_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_courses_allow_all_select ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_select
    ON public.skill_courses FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_courses_allow_all_insert ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_insert
    ON public.skill_courses FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_courses_allow_all_update ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_update
    ON public.skill_courses FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_courses_allow_all_delete ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_delete
    ON public.skill_courses FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_courses_updated_at ON public.skill_courses;
CREATE TRIGGER trg_skill_courses_updated_at
BEFORE UPDATE ON public.skill_courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  5. skill_gallery
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_gallery (
    id              VARCHAR(50)     PRIMARY KEY,
    image_url       VARCHAR(1024)   NOT NULL DEFAULT '',
    title           VARCHAR(500)    NOT NULL DEFAULT '',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_gallery_order
    ON public.skill_gallery (display_order ASC);

COMMENT ON TABLE public.skill_gallery IS 'Photo gallery. Admin uploads to tpsc-images bucket OR pastes an image URL.';

ALTER TABLE public.skill_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_gallery_allow_all_select ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_select
    ON public.skill_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_insert ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_insert
    ON public.skill_gallery FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_update ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_update
    ON public.skill_gallery FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_delete ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_delete
    ON public.skill_gallery FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_gallery_updated_at ON public.skill_gallery;
CREATE TRIGGER trg_skill_gallery_updated_at
BEFORE UPDATE ON public.skill_gallery
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  6. skill_highlights
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_highlights (
    id              VARCHAR(50)     PRIMARY KEY,
    text            TEXT            NOT NULL,
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_highlights_order
    ON public.skill_highlights (display_order ASC);

COMMENT ON TABLE public.skill_highlights IS 'Hero headline stats (e.g. "6,000+ Trained").';

ALTER TABLE public.skill_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_highlights_allow_all_select ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_select
    ON public.skill_highlights FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_insert ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_insert
    ON public.skill_highlights FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_update ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_update
    ON public.skill_highlights FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_delete ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_delete
    ON public.skill_highlights FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_highlights_updated_at ON public.skill_highlights;
CREATE TRIGGER trg_skill_highlights_updated_at
BEFORE UPDATE ON public.skill_highlights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  7. skill_programmes  (one-click activate/delete sponsor programmes)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_programmes (
    id                VARCHAR(50)     PRIMARY KEY,
    is_active         BOOLEAN         NOT NULL DEFAULT FALSE,
    hero_title        VARCHAR(500)    NOT NULL DEFAULT '',
    hero_subtitle     VARCHAR(1000)   NOT NULL DEFAULT '',
    hero_description  TEXT            NOT NULL DEFAULT '',
    skills            JSONB           NOT NULL DEFAULT '[]'::jsonb,
    full_content      TEXT            NOT NULL DEFAULT '',
    sponsor_name      VARCHAR(500)    NOT NULL DEFAULT '',
    sponsor_logo_url  VARCHAR(1024)   NOT NULL DEFAULT '',
    sponsor_website   VARCHAR(1024)   NOT NULL DEFAULT '',
    organizer_name    VARCHAR(500)    NOT NULL DEFAULT 'Thinkers and Problem Solvers',
    apply_link        VARCHAR(1024)   NOT NULL DEFAULT '',
    tutor_link        VARCHAR(1024)   NOT NULL DEFAULT '',
    programme_images  JSONB           NOT NULL DEFAULT '[]'::jsonb,
    display_order     INTEGER         NOT NULL DEFAULT 1,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_programmes_active
    ON public.skill_programmes (is_active);
CREATE INDEX IF NOT EXISTS idx_skill_programmes_order
    ON public.skill_programmes (display_order ASC);

COMMENT ON TABLE public.skill_programmes IS 'Sponsor programmes — ONE active at a time (one-click activate/delete).';
COMMENT ON COLUMN public.skill_programmes.skills IS 'JSON string[]: ["Farming","Graphic Design","Fashion Design",...]';
COMMENT ON COLUMN public.skill_programmes.programme_images IS 'JSON {image_url,title?}[]: uploaded images + URL images merged.';

ALTER TABLE public.skill_programmes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_programmes_allow_all_select ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_select
    ON public.skill_programmes FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_insert ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_insert
    ON public.skill_programmes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_update ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_update
    ON public.skill_programmes FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_delete ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_delete
    ON public.skill_programmes FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_programmes_updated_at ON public.skill_programmes;
CREATE TRIGGER trg_skill_programmes_updated_at
BEFORE UPDATE ON public.skill_programmes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================================
--  8. art_materials  (18 default items UPSERTED idempotently)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.art_materials (
    id              VARCHAR(50)     PRIMARY KEY,
    title           VARCHAR(500)    NOT NULL,
    description     TEXT            NOT NULL,
    image_url       VARCHAR(1024)   NOT NULL DEFAULT '',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_art_materials_display_order
    ON public.art_materials (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_art_materials_created_at
    ON public.art_materials (created_at DESC);

COMMENT ON TABLE  public.art_materials               IS 'Items in the "ART MATERIALS & COLORS AVAILABLE" section on the HOMEPAGE.';
COMMENT ON COLUMN public.art_materials.id            IS 'Short client-generated ID — matches Zustand store.';
COMMENT ON COLUMN public.art_materials.title         IS 'Short product title shown under the image card.';
COMMENT ON COLUMN public.art_materials.description   IS 'Full description incl. brand + price + line breaks.';
COMMENT ON COLUMN public.art_materials.image_url     IS 'Remote CDN URL OR Supabase tpsc-images bucket public URL.';
COMMENT ON COLUMN public.art_materials.display_order IS 'Position in the grid (1 = first card).';

ALTER TABLE public.art_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS art_materials_allow_all_select ON public.art_materials;
CREATE POLICY art_materials_allow_all_select
    ON public.art_materials FOR SELECT USING (true);
DROP POLICY IF EXISTS art_materials_allow_all_insert ON public.art_materials;
CREATE POLICY art_materials_allow_all_insert
    ON public.art_materials FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS art_materials_allow_all_update ON public.art_materials;
CREATE POLICY art_materials_allow_all_update
    ON public.art_materials FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS art_materials_allow_all_delete ON public.art_materials;
CREATE POLICY art_materials_allow_all_delete
    ON public.art_materials FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_art_materials_updated_at ON public.art_materials;
CREATE TRIGGER trg_art_materials_updated_at
BEFORE UPDATE ON public.art_materials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------- 18 default art materials (UPSERT, idempotent) --------
INSERT INTO public.art_materials
    (id, title, description, image_url, display_order, created_at, updated_at)
VALUES
('am001','ARTIST BOX, 150 ART SET',
 'ARTIST BOX, 150 ART SET - N54,000',
 'https://i.ibb.co/KpsrYSBk/IMG-20260728-WA0042.jpg', 1, NOW(), NOW()),

('am002','Crayola 24 Mini Kids Maxi Wax Crayons',
 'Crayola 24 Mini Kids Maxi Wax Crayons - Assorted Colors Brand: Crayola | Similar Products from Crayola N33,250',
 'https://i.ibb.co/vCmsn7Y8/IMG-20260728-WA0043.jpg', 2, NOW(), NOW()),

('am003','Monami 12 Color Poster Paint Set',
 'Monami 12 Color Poster Paint Set - Premium Water-Based Art Colors with Portable Storage Case. Brand: Monami | Similar Products from Monami - N13,350',
 'https://i.ibb.co/4nsb5R31/IMG-20260728-WA0044.jpg', 3, NOW(), NOW()),

('am004','12Pcs Artist Paint Brush Pen',
 '12Pcs Artist Paint Brush Pen for Acrylic, Oil Painting, Drawing - N17,500',
 'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', 4, NOW(), NOW()),

('am005','32Pcs Oil Painting Brush Set',
 '32Pcs Oil Painting Brush Set, Nylon Hair Brush Set - N24,400',
 'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', 5, NOW(), NOW()),

('am006','Paint Runner Roller Pro Kit',
 'Paint Runner Roller Pro Rollers Wall Painting Kit, Walls Brush Handle Tool, Home Garden+Extension Pole Tube DIY - N55,450',
 'https://i.ibb.co/ZyyccL4/IMG-20260728-WA0046.jpg', 6, NOW(), NOW()),

('am007','17 Holes Non-Stick Paint Palette',
 '17 Holes Non-Stick Paint Palette/Artist Paint Mixing Tray - N16,500',
 'https://i.ibb.co/2bnNBcQ/IMG-20260728-WA0047.jpg', 7, NOW(), NOW()),

('am008','5 Painting Knives Stainless Spatula',
 '5 Painting Knives Stainless Spatula Palette Knife - N19,999',
 'https://i.ibb.co/Tqbw1P5w/IMG-20260728-WA0048.jpg', 8, NOW(), NOW()),

('am009','35Pcs Professional Sketching Drawing Kit',
 '35Pcs Professional Sketching Drawing Artist Kit, Sketch Pencils, Charcoal Art Tools Set - N18,994',
 'https://i.ibb.co/sdt2cZBX/IMG-20260728-WA0049.jpg', 9, NOW(), NOW()),

('am010','Digabi 24 Colors Dual-Ended Colored Pencils',
 'Digabi 12pcs/24 Colors Dual-Ended Water-Soluble Colored Pencils - 24 Vibrant Colors, Triangular Log Sketch Art Supplies, Suitable for Schools, Offices, And Artists, Office Art Supplies, Vivid Art Supplies, Durable Art Materials, Colored Pencil Set
Brand: Digabi | Similar products from Digabi
₦ 21,026',
 'https://i.ibb.co/6J7fYgVQ/IMG-20260728-WA0050.jpg', 10, NOW(), NOW()),

('am011','72pcs Professional Drawing Artist Kit',
 '72pcs Professional Drawing Artist Kit Set Art & Bag
₦ 32,984',
 'https://i.ibb.co/tPN8VkQR/IMG-20260728-WA0051.jpg', 11, NOW(), NOW()),

('am012','Early Education Kiddies Complete Artistic Set',
 'Early Education Kiddies Complete Artistic set Drawing And Painting Art Kit With Colourful Pencils - 208 Pieces - Pink
₦ 39,000',
 'https://i.ibb.co/5hfkQh77/IMG-20260728-WA0052.jpg', 12, NOW(), NOW()),

('am013','OVO TOUMI 80 Colors Art Markers',
 'OVO TOUMI 80 Colors Art Markers Set Double Tip Broad Fine Point Marker Pen
Brand: OVO TOUMI | Similar products from OVO TOUMI
₦ 30,800',
 'https://i.ibb.co/NdhV9yh4/IMG-20260728-WA0053.jpg', 13, NOW(), NOW()),

('am014','24-Color Oil-Based Colored Pencils',
 '24-Color Oil-Based Colored Pencils Set: Student/Kids Art Drawing Pencils (Thick Tip)
₦ 8,880',
 'https://i.ibb.co/wZ847gjc/IMG-20260728-WA0054.jpg', 14, NOW(), NOW()),

('am015','OVO TOUMI 150pcs Art Drawing Set',
 'OVO TOUMI 150pcs Art Drawing Set Painting Sketching Color Pen
Brand: OVO TOUMI | Similar products from OVO TOUMI
₦ 18,480 - N18,480',
 'https://i.ibb.co/xrdzjcT/IMG-20260728-WA0055.jpg', 15, NOW(), NOW()),

('am016','14Pcs Professional Sketch Pencil Set',
 '14Pcs/Set Professional Sketch Pencil Set HB 2B Graphite Art Drawing Pencil School Stationery
₦ 26,705',
 'https://i.ibb.co/QvPXysVm/IMG-20260728-WA0056.jpg', 16, NOW(), NOW()),

('am017','Poster Colours 60ml x12',
 'Poster Colours 60ml x12 N18,450.00',
 'https://i.ibb.co/yFJ0PxDt/IMG-20260728-WA0057.jpg', 17, NOW(), NOW()),

('am018','Pure White Cotton Hankerchief 12 Pieces',
 'Pure White Cotton Hankerchief I 12 Pieces
₦ 6,700',
 'https://i.ibb.co/ZRF5wFYZ/IMG-20260728-WA0058.jpg', 18, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;


-- =====================================================================
--  (Optional) Realtime Publications for ALL 8 SKILL-ACQUISITION TABLES
--  Each DDL is wrapped in DO $$ … $$ so any permission / replication
--  error becomes a harmless NOTICE — never fails the migration.
-- =====================================================================
DO $$
BEGIN
  DROP PUBLICATION IF EXISTS tpsc_skill_all_pub;
  CREATE PUBLICATION tpsc_skill_all_pub FOR TABLE
      public.skill_settings,
      public.skill_sponsors,
      public.skill_partners,
      public.skill_courses,
      public.skill_gallery,
      public.skill_highlights,
      public.skill_programmes,
      public.art_materials;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping optional Skill Acquisition publication creation (%: %)', SQLSTATE, SQLERRM;
END $$;


-- =====================================================================
--  Also set REPLICA IDENTITY FULL on every table (for realtime listeners
--  that want the full row image on every UPDATE/DELETE event).
--  Safe wrapper never breaks the migration.
-- =====================================================================
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'skill_settings','skill_sponsors','skill_partners','skill_courses',
        'skill_gallery','skill_highlights','skill_programmes','art_materials'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Could not set REPLICA IDENTITY FULL for % (%: %)', t, SQLSTATE, SQLERRM;
        END;
    END LOOP;
END $$;


-- =====================================================================
--  FINISHED — ALL 8 SKILL ACQUISITION TABLES ARE READY.
-- =====================================================================
--  POST-RUN VERIFICATION (paste into Supabase SQL Editor right after
--  this script completes):
--
--    SELECT 'skill_settings'   AS t, COUNT(*) AS rows FROM public.skill_settings
--    UNION ALL SELECT 'skill_sponsors',   COUNT(*) FROM public.skill_sponsors
--    UNION ALL SELECT 'skill_partners',   COUNT(*) FROM public.skill_partners
--    UNION ALL SELECT 'skill_courses',    COUNT(*) FROM public.skill_courses
--    UNION ALL SELECT 'skill_gallery',    COUNT(*) FROM public.skill_gallery
--    UNION ALL SELECT 'skill_highlights', COUNT(*) FROM public.skill_highlights
--    UNION ALL SELECT 'skill_programmes', COUNT(*) FROM public.skill_programmes
--    UNION ALL SELECT 'art_materials',    COUNT(*) FROM public.art_materials
--    ORDER BY t;
--
--  Expected row counts after a fresh run:
--       skill_settings  = 1
--       art_materials   = 18
--       everything else = 0  (you add them via Admin Dashboard)
--
--  HOW ADMIN ACTIONS → REFLECT ON WEBSITE:
--  1. Admin clicks Add/Update/Delete/Toggle in "Skill Acquisition" OR
--     "Art Materials" tab of Admin Dashboard
--  2. Dashboard calls saveToSupabaseTable() / deleteFromSupabaseTable()
--     → INSERT / UPDATE / DELETE row in Supabase
--  3. Public /skill-acquisition page & Homepage SELECT from these
--     tables → new data renders on next page load
--  4. RLS policies = permissive SELECT for all 8 tables
--     → Website visitors instantly see the updates ✅
-- =====================================================================
