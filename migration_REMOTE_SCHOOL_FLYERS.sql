-- =====================================================================
--  REMOTE SCHOOL FLYERS TABLE  —  `public.remote_school_flyers`
--  Idempotent: safe to re-run in Supabase SQL Editor.
--
--  Used by:
--    RemoteSchool.tsx (public /remote-school page):
--      • Section 3 — "Apply as a Student or Teacher Today"
--          → flyers where section = 'apply'  (4 rows by default)
--          → Clicking any Apply flyer opens a LIGHTBOX / MODAL so the
--            user can see the full flyer in large size.
--          → Each Apply flyer carries title + description + CTA button.
--            Admin can override button_text / button_url per flyer via
--            the Dashboard. Defaults are shown below.
--      • Section 8 — "Our Online School in Pictures" (after Why Choose Us)
--          → flyers where section = 'gallery'  (9 rows by default)
--          → These are STATIC IMAGES — NO CTA BUTTONS, NO LINKS.
--            They are purely decorative.
--    Dashboard.tsx   (admin "Remote School Flyers" tab):
--          → Full CRUD (create, edit, re-order, delete).
--          → Every new flyer upload requires the admin to pick the
--            SECTION (Apply or Gallery) in the form dropdown.
--          → Upload OR external-URL image input (per project convention).
--          → Optional title / description / button_text / button_url
--            (same flexible pattern as `upcoming_events`).
--
--  DEFAULT CTA (used only by APPLY flyers, when button_* cols empty):
--    Button Text : "LEARN MORE"
--    Button URL  : https://chat.whatsapp.com/KYSRJs7HR3rJ9fHMxr2cSj
--
--  GALLERY FLYERS NEVER SHOW A CTA (React code enforces this regardless
--  of the values in button_text / button_url).
-- =====================================================================

-- =====================================================================
--  STEP 1  —  CREATE / ALTER THE TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.remote_school_flyers (
    id             UUID             NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url      VARCHAR(2048)    NOT NULL,
    title          VARCHAR(500)     NOT NULL DEFAULT '',
    description    TEXT             NOT NULL DEFAULT '',
    button_text    VARCHAR(500)     NOT NULL DEFAULT '',
    button_url     VARCHAR(1024)    NOT NULL DEFAULT '',
    section        VARCHAR(32)      NOT NULL DEFAULT 'gallery'
                     CHECK (section IN ('apply', 'gallery')),
    display_order  INTEGER          NOT NULL DEFAULT 0,
    status         VARCHAR(32)      NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'archived')),
    created_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
--  If you ran the OLDER version of this migration BEFORE (the one that
--  lacked the `section` column) — uncomment the two lines below ONCE
--  to retrofit the column into the existing table, then comment them
--  out again.  (The CREATE TABLE IF NOT EXISTS above won't touch an
--  existing table, so this is the safe ALTER route.)
-- ---------------------------------------------------------------------
-- ALTER TABLE public.remote_school_flyers
--     ADD COLUMN IF NOT EXISTS section VARCHAR(32) NOT NULL DEFAULT 'gallery'
--         CHECK (section IN ('apply', 'gallery'));

COMMENT ON TABLE  public.remote_school_flyers
    IS 'Flyer images rendered on the /remote-school page in TWO distinct sections:
        section = ''apply''   → Section 3 (Apply as Student/Teacher). 4 initial flyers.
                                 Clickable: opens a lightbox with the full flyer + CTA button.
        section = ''gallery'' → Section 8 (after "Why Choose Us?"). 9 initial flyers.
                                 Static decorative images — NO BUTTONS, NO LINKS (React code
                                 always strips the CTA for gallery rows).
        When button_text / button_url are left empty, APPLY-section rows fall back to
        a default "LEARN MORE" pointing to the Remote School WhatsApp group
        (https://chat.whatsapp.com/KYSRJs7HR3rJ9fHMxr2cSj).';

COMMENT ON COLUMN public.remote_school_flyers.image_url
    IS 'Direct URL to the flyer image. Stored either as a public Supabase Storage URL or an external https:// URL (e.g. i.ibb.co, imgbb, etc.).';
COMMENT ON COLUMN public.remote_school_flyers.title
    IS 'Optional heading shown below the flyer image (Apply section) or above the image body (Gallery section). Gallery rows usually leave this blank.';
COMMENT ON COLUMN public.remote_school_flyers.description
    IS 'Optional short description shown under the title. APPLY flyers typically fill this in so users can read what the flyer is about inside the lightbox as well.';
COMMENT ON COLUMN public.remote_school_flyers.button_text
    IS '(APPLY section ONLY — Gallery flyers ignore this.) Replaces the default "LEARN MORE" label on the CTA button. Leave blank → shows default.';
COMMENT ON COLUMN public.remote_school_flyers.button_url
    IS '(APPLY section ONLY — Gallery flyers ignore this.) Replaces the default WhatsApp group URL on the CTA button. Bare domains (e.g. skillhive.name.ng) are normalized to https:// by the React code. Leave blank → default WhatsApp link.';
COMMENT ON COLUMN public.remote_school_flyers.section
    IS '''apply'' = Section 3 (Apply flyers: clickable, open lightbox, support CTA).
        ''gallery'' = Section 8 (static decorative images, NO CTA EVER).';
COMMENT ON COLUMN public.remote_school_flyers.display_order
    IS 'Manual sort order within each section. Smaller numbers show first. 0 = last-resort sort by created_at DESC.';
COMMENT ON COLUMN public.remote_school_flyers.status
    IS '''active'' (shown on the live site) or ''archived'' (hidden). Only ''active'' rows are loaded by the public page.';

-- =====================================================================
--  STEP 2  —  INDEXES
-- =====================================================================

CREATE INDEX IF NOT EXISTS remote_school_flyers_status_order_idx
    ON public.remote_school_flyers (status, section, display_order ASC, created_at DESC);

-- =====================================================================
--  STEP 3  —  ROW LEVEL SECURITY
-- =====================================================================

ALTER TABLE public.remote_school_flyers ENABLE ROW LEVEL SECURITY;

-- Public page read-access: allow anyone to SELECT * active flyers.
DROP POLICY IF EXISTS remote_school_flyers_active_public_read ON public.remote_school_flyers;
CREATE POLICY remote_school_flyers_active_public_read
    ON public.remote_school_flyers
    AS PERMISSIVE
    FOR SELECT
    USING (status = 'active');

-- Admin write-access: permissive pattern (matches other LIVE_FIELDS tables
-- in this project — Supabase anon-key writes are allowed, protected by
-- the Dashboard UI + admin password gate).
DROP POLICY IF EXISTS remote_school_flyers_admin_all ON public.remote_school_flyers;
CREATE POLICY remote_school_flyers_admin_all
    ON public.remote_school_flyers
    AS PERMISSIVE
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =====================================================================
--  STEP 4  —  AUTO-UPDATED updated_at
-- =====================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_remote_school_flyers_set_updated_at
    ON public.remote_school_flyers;
CREATE TRIGGER trg_remote_school_flyers_set_updated_at
    BEFORE UPDATE ON public.remote_school_flyers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
--  STEP 5  —  PRE-POPULATE 4 APPLY FLYERS + 9 GALLERY FLYERS  (13 total)
--
--  Default WhatsApp CTA URL (used by APPLY-section rows below whenever
--  button_text / button_url are empty):
--      https://chat.whatsapp.com/KYSRJs7HR3rJ9fHMxr2cSj
--  Default button label = "LEARN MORE"  (handled in the React code).
--
--  NOTE: GALLERY SECTION ROWS ARE STATIC IMAGES — EVEN IF YOU FILL IN
--  button_text / button_url, THE REACT UI SIMPLY DOES NOT RENDER THEM.
-- =====================================================================

INSERT INTO public.remote_school_flyers
    (image_url, title, description, button_text, button_url, section, display_order, status)
VALUES
    -- -----------------------------------------------------------------
    --  SECTION: apply   (4 flyers — Section 3: Apply as Student/Teacher)
    --  Clicking any of these opens the full-size flyer in a lightbox.
    --  Each one carries title + description + a "LEARN MORE" CTA that
    --  by default opens the WhatsApp group.
    -- -----------------------------------------------------------------
    (
        'https://i.ibb.co/5XsXDJ63/1.jpg',
        'Register as a Student',
        'Kickstart your academic journey — sign up for personalized one-on-one or group lessons with our qualified teachers across Mathematics, Sciences, English, and more.',
        '',                                         -- button_text → empty = default "LEARN MORE"
        '',                                         -- button_url  → empty = default WhatsApp group
        'apply',
        1,
        'active'
    ),
    (
        'https://i.ibb.co/x8qqWj7b/2.jpg',
        'Apply as a Teacher',
        'Qualified educators and passionate tutors — join our team, share your expertise, and help students across every subject and level achieve excellence.',
        '',
        '',
        'apply',
        2,
        'active'
    ),
    (
        'https://i.ibb.co/SX7L6Gnm/3.jpg',
        'Flexible Online Learning',
        'Anywhere, anytime. From Nursery to A-Level, WAEC, JAMB, NECO, IGCSE and Adult Education — our tutors meet you where you are on a schedule you choose.',
        '',
        '',
        'apply',
        3,
        'active'
    ),
    (
        'https://i.ibb.co/dwx6jN61/4.jpg',
        'Speak With Us on WhatsApp',
        'Still have questions? Get our full programme details, price list, available subjects and tutors, and enrollment guidance directly in the WhatsApp group.',
        '',
        '',
        'apply',
        4,
        'active'
    ),

    -- -----------------------------------------------------------------
    --  SECTION: gallery   (9 flyers — Section 8: after "Why Choose Us?")
    --  STATIC IMAGES ONLY — no buttons, no click-through, no CTA.
    --  title / description are intentionally left empty; if you fill
    --  them in they will be displayed above the image (as a caption).
    -- -----------------------------------------------------------------
    ('https://i.ibb.co/zH04mwmn/photo-1-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 1, 'active'),
    ('https://i.ibb.co/TxJtDCfZ/photo-2-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 2, 'active'),
    ('https://i.ibb.co/5X09d8Zx/photo-3-2026-07-31-12-41-19.jpg',  '', '', '', '', 'gallery', 3, 'active'),
    ('https://i.ibb.co/QvSb7MsH/photo-4-2026-07-31-12-41-19.jpg',  '', '', '', '', 'gallery', 4, 'active'),
    ('https://i.ibb.co/twCPM2h8/photo-5-2026-07-31-12-41-19.jpg',  '', '', '', '', 'gallery', 5, 'active'),
    ('https://i.ibb.co/XfrKhSTP/photo-6-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 6, 'active'),
    ('https://i.ibb.co/MDFLXK9g/photo-7-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 7, 'active'),
    ('https://i.ibb.co/Rkx5y4XH/photo-8-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 8, 'active'),
    ('https://i.ibb.co/RpPPbJcF/photo-9-2026-07-31-12-38-51.jpg',  '', '', '', '', 'gallery', 9, 'active')
ON CONFLICT DO NOTHING;

-- =====================================================================
--  (OPTIONAL) HOW TO UPDATE FLYERS LATER  —  copy/paste as needed
-- =====================================================================

-- Example A — Override the CTA on Apply flyer #3 (Flexible Online Learning)
-- to point to a custom Google Form / external website instead of WhatsApp:
--
--   UPDATE public.remote_school_flyers
--      SET button_text = 'Pick a Time Slot',
--          button_url  = 'https://calendly.com/your-link-here'
--    WHERE section = 'apply' AND display_order = 3;

-- Example B — Change the default WhatsApp CTA on ALL APPLY flyers
-- that currently have NO custom override:
--
--   UPDATE public.remote_school_flyers
--      SET button_url = 'https://chat.whatsapp.com/NEW_GROUP_LINK'
--    WHERE section = 'apply' AND (button_url IS NULL OR button_url = '');

-- Example C — Replace a single GALLERY flyer image (e.g. gallery #5):
--
--   UPDATE public.remote_school_flyers
--      SET image_url = 'https://i.ibb.co/your-new-image.jpg'
--    WHERE section = 'gallery' AND display_order = 5;

-- Example D — Add a 5th APPLY flyer (Admin Dashboard also supports this):
--
--   INSERT INTO public.remote_school_flyers
--       (image_url, title, description, button_text, button_url, section, display_order, status)
--   VALUES
--       ('https://i.ibb.co/.../5th-apply-flyer.jpg',
--        'Exam Prep Bootcamp',
--        'Intensive 4-week crash course for WAEC / JAMB candidates.',
--        'BOOK YOUR SLOT',
--        'https://forms.google.com/...',
--        'apply', 5, 'active');
