-- =====================================================================
--  ADD CUSTOM CTA BUTTON FIELDS TO upcoming_events TABLE
--  Idempotent: safe to re-run on Supabase SQL Editor.
--  Adds two optional columns that the Admin Dashboard's "Upcoming Events"
--  form now writes to: button_text + button_url
--
--  Used by:
--    Dashboard.tsx   → lines 725-814   handleAddEvent / handleEditEvent payload
--    Home.tsx        → lines 233-305   Event card CTA button render
--    Home.tsx        → lines 330-359   Event Details Modal button render
-- =====================================================================

ALTER TABLE public.upcoming_events
    ADD COLUMN IF NOT EXISTS button_text  VARCHAR(500)  NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS button_url   VARCHAR(1024) NOT NULL DEFAULT '';

COMMENT ON COLUMN public.upcoming_events.button_text
    IS 'Optional CTA button text shown in the homepage event flyer modal AND directly on the event card. Leave blank to show the default "Register Now".';

COMMENT ON COLUMN public.upcoming_events.button_url
    IS 'Optional CTA button destination for the event flyer modal and card. Accepts bare domains (e.g. skillhive.name.ng — auto-normalized to https://) or full external URLs. If blank → falls back to in-site /register/student page.';

-- =====================================================================
--  HOW TO UPDATE AN EXISTING ROW (copy / edit one of the templates
--  below and run AFTER the ALTER TABLE block above has been applied).
--  Replace the WHERE-condition value with the title / id of the row
--  you want to add a custom link to.
-- =====================================================================

-- EXAMPLE 1 — Add a custom Google Forms link to an existing event
-- identified by its title. Bare domain (no https://) is fine — the
-- React code will normalize it automatically.
--
-- UPDATE public.upcoming_events
--    SET button_text = 'Register via Google Form',
--        button_url  = 'forms.gle/abcXYZ123Example'
--  WHERE title = 'International Art Competition 2026';

-- EXAMPLE 2 — Point to an external sponsor event page
--
-- UPDATE public.upcoming_events
--    SET button_text = 'Visit Event Page',
--        button_url  = 'https://sponsor-name.com/event-page-here'
--  WHERE id = 'replace-with-the-event-uuid-from-supabase-table';

-- EXAMPLE 3 — Reset an event back to the default "Register Now" +
-- /register/student (clear any previous custom CTA):
--
-- UPDATE public.upcoming_events
--    SET button_text = '',
--        button_url  = ''
--  WHERE title = 'My Event Title';
