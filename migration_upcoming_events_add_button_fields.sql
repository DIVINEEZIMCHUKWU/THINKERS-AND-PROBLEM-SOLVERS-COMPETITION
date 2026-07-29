-- =====================================================================
--  ADD CUSTOM CTA BUTTON FIELDS TO upcoming_events TABLE
--  Idempotent: safe to re-run on Supabase SQL Editor.
--  Adds two optional columns that the Admin Dashboard's "Upcoming Events"
--  form now writes to: button_text + button_url
--
--  Used by:
--    Dashboard.tsx   → lines 726-760 handleAddEvent payload
--    Home.tsx        → Event Details Modal button render
-- =====================================================================

ALTER TABLE public.upcoming_events
    ADD COLUMN IF NOT EXISTS button_text  VARCHAR(500)  NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS button_url   VARCHAR(1024) NOT NULL DEFAULT '';

COMMENT ON COLUMN public.upcoming_events.button_text
    IS 'Optional CTA button text shown in the homepage event flyer modal. Leave blank to show the default "Register Now".';

COMMENT ON COLUMN public.upcoming_events.button_url
    IS 'Optional CTA button destination for the event flyer modal. Accepts bare domains (e.g. skillhive.name.ng — auto-normalized to https://) or full external URLs. If blank → falls back to in-site /register/student page.';
