-- =====================================================================
-- SUPABASE MIGRATION: SKILL ACQUISITION PROGRAMME
-- (Idempotent — safe to run multiple times in Supabase SQL Editor)
-- =====================================================================
-- Run the ENTIRE script here (all at once):
--   https://app.supabase.com/project/<YOUR-PROJECT-ID>/sql/new
--
-- This script creates all 7 tables used by the Admin Dashboard →
-- "Skill Acquisition" tab:
--    1. skill_settings        (single-row hero config: title, subtitle,
--                              banner images, contact info, status)
--    2. skill_sponsors        (logos + websites for the "Proudly
--                              Supported By" section)
--    3. skill_partners        (logos + websites for Partners section)
--    4. skill_courses         (skills students learn — icon, color,
--                              description, category)
--    5. skill_gallery         (photo gallery — upload OR image URL)
--    6. skill_highlights      (Hero headline/stats — "6,000+ Trained")
--    7. skill_programmes      (one-click activate/delete sponsor
--                              programmes — sponsor, hero images,
--                              registration links, programme gallery)
-- =====================================================================

-- ---------- (0) Shared helper (run once) ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================================
-- 1. skill_settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_settings (
    id                  VARCHAR(50)     PRIMARY KEY DEFAULT 'default',
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

COMMENT ON TABLE public.skill_settings IS 'Single-row hero settings for Skill Acquisition page.';
COMMENT ON COLUMN public.skill_settings.id IS 'Always use id=default (single-row table).';

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

-- Seed default single row (id='default') — idempotent
INSERT INTO public.skill_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 2. skill_sponsors
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
CREATE INDEX IF NOT EXISTS idx_skill_sponsors_order ON public.skill_sponsors (display_order ASC);

COMMENT ON TABLE public.skill_sponsors IS '"Proudly Supported By" logos (upload or URL).';

ALTER TABLE public.skill_sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_sponsors_allow_all_select ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_select ON public.skill_sponsors FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_insert ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_insert ON public.skill_sponsors FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_update ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_update ON public.skill_sponsors FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_sponsors_allow_all_delete ON public.skill_sponsors;
CREATE POLICY skill_sponsors_allow_all_delete ON public.skill_sponsors FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_sponsors_updated_at ON public.skill_sponsors;
CREATE TRIGGER trg_skill_sponsors_updated_at BEFORE UPDATE ON public.skill_sponsors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 3. skill_partners
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
CREATE INDEX IF NOT EXISTS idx_skill_partners_order ON public.skill_partners (display_order ASC);

COMMENT ON TABLE public.skill_partners IS 'Partner logos (upload or URL), rendered next to sponsors.';

ALTER TABLE public.skill_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_partners_allow_all_select ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_select ON public.skill_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_partners_allow_all_insert ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_insert ON public.skill_partners FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_partners_allow_all_update ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_update ON public.skill_partners FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_partners_allow_all_delete ON public.skill_partners;
CREATE POLICY skill_partners_allow_all_delete ON public.skill_partners FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_partners_updated_at ON public.skill_partners;
CREATE TRIGGER trg_skill_partners_updated_at BEFORE UPDATE ON public.skill_partners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 4. skill_courses
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
CREATE INDEX IF NOT EXISTS idx_skill_courses_order ON public.skill_courses (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_skill_courses_category ON public.skill_courses (category);

COMMENT ON TABLE public.skill_courses IS 'Courses / Skills available to learn (rendered on Courses section).';

ALTER TABLE public.skill_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_courses_allow_all_select ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_select ON public.skill_courses FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_courses_allow_all_insert ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_insert ON public.skill_courses FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_courses_allow_all_update ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_update ON public.skill_courses FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_courses_allow_all_delete ON public.skill_courses;
CREATE POLICY skill_courses_allow_all_delete ON public.skill_courses FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_courses_updated_at ON public.skill_courses;
CREATE TRIGGER trg_skill_courses_updated_at BEFORE UPDATE ON public.skill_courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 5. skill_gallery
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_gallery (
    id              VARCHAR(50)     PRIMARY KEY,
    image_url       VARCHAR(1024)   NOT NULL DEFAULT '',
    title           VARCHAR(500)    NOT NULL DEFAULT '',
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_gallery_order ON public.skill_gallery (display_order ASC);

COMMENT ON TABLE public.skill_gallery IS 'Photo gallery. Image upload OR image URL; optional title/caption.';

ALTER TABLE public.skill_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_gallery_allow_all_select ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_select ON public.skill_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_insert ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_insert ON public.skill_gallery FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_update ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_update ON public.skill_gallery FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_gallery_allow_all_delete ON public.skill_gallery;
CREATE POLICY skill_gallery_allow_all_delete ON public.skill_gallery FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_gallery_updated_at ON public.skill_gallery;
CREATE TRIGGER trg_skill_gallery_updated_at BEFORE UPDATE ON public.skill_gallery
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 6. skill_highlights
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.skill_highlights (
    id              VARCHAR(50)     PRIMARY KEY,
    text            TEXT            NOT NULL,
    display_order   INTEGER         NOT NULL DEFAULT 1,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_highlights_order ON public.skill_highlights (display_order ASC);

COMMENT ON TABLE public.skill_highlights IS 'Hero headline stats (e.g. "6,000+ Students Trained").';

ALTER TABLE public.skill_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_highlights_allow_all_select ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_select ON public.skill_highlights FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_insert ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_insert ON public.skill_highlights FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_update ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_update ON public.skill_highlights FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_highlights_allow_all_delete ON public.skill_highlights;
CREATE POLICY skill_highlights_allow_all_delete ON public.skill_highlights FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_highlights_updated_at ON public.skill_highlights;
CREATE TRIGGER trg_skill_highlights_updated_at BEFORE UPDATE ON public.skill_highlights
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 7. skill_programmes
-- =====================================================================
-- NOTE: JSONB is used for arrays (skills, programme_images) because
-- PostgreSQL stores arrays of objects cleanly as JSONB, and the
-- Supabase JavaScript client returns them as native JS arrays.
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
CREATE INDEX IF NOT EXISTS idx_skill_programmes_active ON public.skill_programmes (is_active);
CREATE INDEX IF NOT EXISTS idx_skill_programmes_order ON public.skill_programmes (display_order ASC);

COMMENT ON TABLE public.skill_programmes IS 'Sponsor programmes — one can be active at a time (one-click activate/delete).';
COMMENT ON COLUMN public.skill_programmes.skills IS 'JSON string[]: ["Farming","Graphic Design","Fashion Design",...]';
COMMENT ON COLUMN public.skill_programmes.programme_images IS 'JSON {image_url, title?}[]: uploaded images + URL images merged.';

ALTER TABLE public.skill_programmes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS skill_programmes_allow_all_select ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_select ON public.skill_programmes FOR SELECT USING (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_insert ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_insert ON public.skill_programmes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_update ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_update ON public.skill_programmes FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS skill_programmes_allow_all_delete ON public.skill_programmes;
CREATE POLICY skill_programmes_allow_all_delete ON public.skill_programmes FOR DELETE USING (true);

DROP TRIGGER IF EXISTS trg_skill_programmes_updated_at ON public.skill_programmes;
CREATE TRIGGER trg_skill_programmes_updated_at BEFORE UPDATE ON public.skill_programmes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- Optional: Realtime Publication (skill_sponsors + skill_partners +
-- skill_courses + skill_gallery + skill_highlights + skill_programmes
-- + skill_settings + art_materials).  Wrapped in DO $$...$$ so any
-- permission / replication failures are NOTICES instead of errors —
-- so the whole migration still succeeds end-to-end.
-- =====================================================================
DO $$
BEGIN
  DROP PUBLICATION IF EXISTS tpsc_skill_programmes_pub;
  CREATE PUBLICATION tpsc_skill_programmes_pub FOR TABLE
      public.skill_settings,
      public.skill_sponsors,
      public.skill_partners,
      public.skill_courses,
      public.skill_gallery,
      public.skill_highlights,
      public.skill_programmes;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping optional Skill Acquisition publication creation (%: %)', SQLSTATE, SQLERRM;
END $$;

-- =====================================================================
-- FINISHED
-- =====================================================================
-- To verify, run this AFTER the script in Supabase SQL Editor:
--
--   SELECT 'skill_settings'   AS t, COUNT(*) AS rows FROM public.skill_settings
--   UNION ALL SELECT 'skill_sponsors',   COUNT(*) FROM public.skill_sponsors
--   UNION ALL SELECT 'skill_partners',   COUNT(*) FROM public.skill_partners
--   UNION ALL SELECT 'skill_courses',    COUNT(*) FROM public.skill_courses
--   UNION ALL SELECT 'skill_gallery',    COUNT(*) FROM public.skill_gallery
--   UNION ALL SELECT 'skill_highlights', COUNT(*) FROM public.skill_highlights
--   UNION ALL SELECT 'skill_programmes', COUNT(*) FROM public.skill_programmes;
-- =====================================================================
