import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Sparkles, Heart, Palette, Camera, Shirt, CookingPot, Trophy, MapPin,
  Phone, Mail, Globe, ChevronRight, GraduationCap, Users, Leaf, Award, BookOpen,
  Briefcase, Star, CheckCircle, ArrowRight, TrendingUp, ShieldCheck, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppStore, SkillProgramme } from '@/store';
import { fetchSkillProgrammes, adaptSkillProgrammeRow } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { normalizeUrl } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const DEFAULT_APPLY = 'https://docs.google.com/forms/d/e/1FAIpQLSdIjaRrWNgnPhgdx1Na-IJf-Sv07tWtnAtnoMUp9ZI7lTmlxg/viewform';
const DEFAULT_TUTOR = 'https://docs.google.com/forms/d/e/1FAIpQLSdVSXi26Psdh3VORwNDZDyYu9gfDHkQulAjlEaK9cF2zo367Q/viewform?usp=publish-editor';
const DEFAULT_NDDC_LOGO = 'https://i.ibb.co/rKbYF43P/IMG-20260723-WA0036.jpg';
const DEFAULT_ORGANIZER = 'Thinkers and Problem Solvers';

const DEFAULT_NDDC_SKILLS = [
  'Farming','Poultry','Fishery','Crop Production',
  'Graphic Design','Photography','Photo Editing','Videography',
  'Leather Works','Shoes','Bags','Belts','Sandals',
  'Fashion Design','Garment Making','Sewing','Tailoring',
  'Drawing','Painting','Arts and Crafts',
  'Catering Services','Baking and Confectionery',
  'Chin-Chin Production','Groundnut Processing and Packaging',
  'Small Chops Production','Event Decoration','Interior Styling',
  'Business Development','Entrepreneurship','Branding and Marketing',
  'Digital Business Skills','Financial Literacy','Record Keeping',
  'And Lots More'
];

const DEFAULT_NDDC_IMAGES = [
  'https://i.ibb.co/4RPVsf0G/IMG-20260728-WA0000.jpg',
  'https://i.ibb.co/9998Kv0h/IMG-20260728-WA0001.jpg',
  'https://i.ibb.co/jk4NgqBs/IMG-20260728-WA0002.jpg',
  'https://i.ibb.co/WLRfBm5/IMG-20260728-WA0003.jpg',
  'https://i.ibb.co/G44WbqSv/IMG-20260728-WA0005.jpg',
  'https://i.ibb.co/dJjYK00X/IMG-20260728-WA0006.jpg',
  'https://i.ibb.co/0pgfPR6c/IMG-20260728-WA0007.jpg',
  'https://i.ibb.co/QvjK8ZFj/IMG-20260728-WA0008.jpg',
  'https://i.ibb.co/5xWfXfdF/IMG-20260728-WA0009.jpg',
  'https://i.ibb.co/4R64qydq/IMG-20260728-WA0010.jpg',
  'https://i.ibb.co/wF3tq9Tg/IMG-20260728-WA0011.jpg',
  'https://i.ibb.co/hxsKBBn6/IMG-20260728-WA0012.jpg',
  'https://i.ibb.co/R4QW43Mc/IMG-20260728-WA0013.jpg',
  'https://i.ibb.co/PGx16DZW/IMG-20260728-WA0014.jpg',
  'https://i.ibb.co/nsJJqJYW/IMG-20260728-WA0015.jpg',
  'https://i.ibb.co/nsqdVsMs/IMG-20260728-WA0016.jpg',
  'https://i.ibb.co/LzDwPyVP/IMG-20260728-WA0017.jpg',
  'https://i.ibb.co/F4v7qjXk/IMG-20260728-WA0018.jpg',
  'https://i.ibb.co/m5bcW7V0/IMG-20260728-WA0019.jpg',
  'https://i.ibb.co/LXKdXLRr/IMG-20260728-WA0020.jpg'
];

// BLACK, GREEN, RED — STRIP COLOR PALETTE
// GREEN = primary (#10b981)  (border, accent, fill buttons)
// RED   = destructive (#f43f5e) (CTA alternate, delete)
// BLACK = background / text

const SkillAcquisition: React.FC = () => {
  // Authoritative list of programmes fetched DIRECTLY from Supabase.
  // Uses local useState — NOT zustand — so NO persist merge / shallow-equal /
  // IndexedDB race can ever overwrite it.  This is 100% page-controlled.
  const [dbProgrammes, setDbProgrammes] = useState<SkillProgramme[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);

  // Also subscribe to zustand in case Dashboard Admin (same browser)
  // creates a programme — we want the add/update/delete to reflect
  // without requiring a refresh.
  const storeProgrammes = useAppStore(s => s.skillProgrammes);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---------------------------------------------------------------------------
  //  100% reliable, multi-trigger Supabase fetch.
  //  - Runs immediately (inline after mount), at 250ms and at 1200ms.
  //  - Uses a bare `supabase.from(...).select('*')` fallback so fetch helper
  //    return value (even if malformed) never drops valid rows.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const doFetch = async (): Promise<SkillProgramme[]> => {
      try {
        // Try the helper first
        let rows = await fetchSkillProgrammes();
        if (!Array.isArray(rows) || rows.length === 0) {
          // Fallback: direct raw select (bypasses helper if any helper bug)
          if (supabase) {
            try {
              const { data, error } = await supabase
                .from('skill_programmes')
                .select('*')
                .order('display_order', { ascending: true, nullsFirst: false })
                .order('created_at', { ascending: false });
              if (!error && Array.isArray(data) && data.length > 0) {
                rows = data.map((row: any) => adaptSkillProgrammeRow(row) as unknown as SkillProgramme);
              }
            } catch (e2) { /* ignore */ }
          }
        }
        return (Array.isArray(rows) ? rows : []) as unknown as SkillProgramme[];
      } catch (err) {
        console.error('SkillAcquisition fetch error:', err);
        return [];
      }
    };

    const hydrate = async () => {
      setIsHydrating(true);
      const rows = await doFetch();
      if (cancelled) return;
      setDbProgrammes(rows);
      // Also push into zustand as an in-memory cache (NOT persisted) so
      // cross-tab navigation doesn't re-fetch.
      try {
        useAppStore.setState((prev: any) => ({
          skillProgrammes: Array.isArray(rows) ? rows : prev.skillProgrammes,
          _lastSyncedAt: Date.now(),
        }));
      } catch {}
      setIsHydrating(false);
    };

    const guard = { ran: false };
    const once = () => {
      if (guard.ran || cancelled) return;
      guard.ran = true;
      hydrate();
    };

    // (1) immediate microtask kickoff
    queueMicrotask(once);
    // (2) 250ms safety net (in case microtask cancelled race)
    timers.push(setTimeout(once, 250));
    // (3) 1200ms final safety net
    timers.push(setTimeout(() => {
      if (cancelled) return;
      if (isHydrating || dbProgrammes.length > 0) return; // already hydrated or OK
      hydrate();
    }, 1200));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  //  If the same-browser Admin modifies programmes via Dashboard, zustand
  //  updates its skillProgrammes array (in memory). Merge those changes into
  //  our local authoritative state so new programmes / status toggles show
  //  immediately without a page reload.
  //
  //  AUTHORITY RULES (merge order by id):
  //    1. Brand-new programmes in store that don't exist in DB yet → add them.
  //    2. For existing rows, DB values are KING UNLESS store has a STRICTLY
  //       NEWER updated_at timestamp (means Admin just edited it in Dashboard
  //       without refreshing, so store's payload is more recent than DB).
  //  This protects against the edge case where store still has stale
  //  is_active=true for a programme whose DB row was already flipped OFF.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!Array.isArray(storeProgrammes) || storeProgrammes.length === 0) return;
    // Merge: union by id — DB wins for existing rows unless store is newer.
    setDbProgrammes(prev => {
      const map = new Map<string, SkillProgramme>();
      for (const p of prev) map.set(p.id, p);
      let anyChange = false;
      for (const sp of storeProgrammes) {
        const existing = map.get(sp.id);
        if (!existing) {
          // Brand-new programme (created in Admin without refresh yet)
          anyChange = true;
          map.set(sp.id, sp);
          continue;
        }
        const storeUpdated = (sp.updated_at as any) ? String(sp.updated_at) : '';
        const dbUpdated = (existing.updated_at as any) ? String(existing.updated_at) : '';
        const storeIsNewer = storeUpdated && dbUpdated && storeUpdated > dbUpdated;
        if (storeIsNewer) {
          anyChange = true;
          map.set(sp.id, { ...existing, ...sp });
          continue;
        }
        // Otherwise DB stays authoritative — do not overwrite existing with store.
      }
      return anyChange ? Array.from(map.values()) : prev;
    });
  }, [storeProgrammes]);

  // ============ PROGRAMME SWITCHER (MULTI-ACTIVE) ============
  const FALLBACK_PROGRAMME: SkillProgramme = useMemo(() => ({
    id: 'default-nddc',
    is_active: true,
    hero_title: 'FREE 6-Month Skills Acquisition Programme',
    hero_subtitle: 'Empower Your Future. Learn a Skill for Free.',
    hero_description:
      'Gain practical vocational and digital skills through our fully sponsored training programme designed to help you become financially independent. This comprehensive initiative brings together industry experts, modern training facilities, and real-world learning experiences to equip you with the tools you need to succeed in today\'s competitive marketplace.',
    skills: DEFAULT_NDDC_SKILLS,
    full_content: '',
    sponsor_name: 'Niger Delta Development Commission (NDDC)',
    sponsor_logo_url: DEFAULT_NDDC_LOGO,
    sponsor_website: '',
    organizer_name: DEFAULT_ORGANIZER,
    apply_link: DEFAULT_APPLY,
    tutor_link: DEFAULT_TUTOR,
    programme_images: DEFAULT_NDDC_IMAGES.map(url => ({ image_url: url, title: '' })),
    display_order: 1,
    created_at: new Date().toISOString(),
  } as SkillProgramme), []);

  // Build the list of "programmes in the switcher".
  // Source of truth = [dbProgrammes ∪ merged storeProgrammes] from above.
  // Falls back to NDDC default ONLY when (no DB rows with is_active=true) AND
  // (no in-memory programmes active from same-browser Admin).
  const availableProgrammes = useMemo<SkillProgramme[]>(() => {
    const list: SkillProgramme[] = Array.isArray(dbProgrammes) ? [...dbProgrammes] : [];
    const actives = list
      .filter(p => p && typeof p === 'object' && p.is_active)
      .sort((a, b) => {
        const ao = Number(a.display_order || 0);
        const bo = Number(b.display_order || 0);
        if (ao !== bo) return ao - bo;
        return String(a.created_at || '').localeCompare(String(b.created_at || ''));
      });
    if (actives.length > 0) return actives;
    return [FALLBACK_PROGRAMME];
  }, [dbProgrammes, FALLBACK_PROGRAMME]);

  // Selected programme state (user-controlled via switcher)
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>(FALLBACK_PROGRAMME.id);

  // Keep selectedId valid when the programme list changes (Admin creates a new
  // one, or Admin toggles make-live status, or hydrate swaps the list).
  useEffect(() => {
    if (!availableProgrammes.some(p => p.id === selectedProgrammeId)) {
      setSelectedProgrammeId(availableProgrammes[0]?.id ?? FALLBACK_PROGRAMME.id);
    } else if (selectedProgrammeId === FALLBACK_PROGRAMME.id && availableProgrammes.length > 1) {
      // If DB programmes arrive and FALLBACK id is still selected, prefer
      // the FIRST LIVE DB programme instead of continuing to show fallback.
      const firstLiveDb = availableProgrammes.find(p => p.id !== FALLBACK_PROGRAMME.id);
      if (firstLiveDb) setSelectedProgrammeId(firstLiveDb.id);
    }
  }, [availableProgrammes, selectedProgrammeId, FALLBACK_PROGRAMME.id]);

  const activeProgramme = useMemo<SkillProgramme>(() => {
    return availableProgrammes.find(p => p.id === selectedProgrammeId)
      ?? availableProgrammes[0]
      ?? FALLBACK_PROGRAMME;
  }, [availableProgrammes, selectedProgrammeId, FALLBACK_PROGRAMME]);

  const isDefaultProgramme = activeProgramme.id === FALLBACK_PROGRAMME.id;
  const hasFullContent = Boolean(activeProgramme.full_content && activeProgramme.full_content.trim().length > 0);

  const APPLY_LINK = normalizeUrl(activeProgramme.apply_link) || normalizeUrl(DEFAULT_APPLY);
  const TUTOR_LINK = normalizeUrl(activeProgramme.tutor_link) || normalizeUrl(DEFAULT_TUTOR);
  const SPONSOR_LOGO = activeProgramme.sponsor_logo_url || DEFAULT_NDDC_LOGO;
  const SPONSOR_NAME = activeProgramme.sponsor_name || 'Niger Delta Development Commission (NDDC)';
  const ORGANIZER = activeProgramme.organizer_name || DEFAULT_ORGANIZER;
  const SKILLS = activeProgramme.skills && activeProgramme.skills.length ? activeProgramme.skills : DEFAULT_NDDC_SKILLS;
  const IMAGES = activeProgramme.programme_images && activeProgramme.programme_images.length
    ? activeProgramme.programme_images.map(p => p.image_url).filter(Boolean)
    : DEFAULT_NDDC_IMAGES;

  const heroSkills = SKILLS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 sm:pb-20 md:pb-28 border-b border-primary/10">
        {/* Background: black with green accent blobs (no other colors) */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-background" />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className="absolute -top-40 -left-24 w-[34rem] h-[34rem] rounded-full blur-[120px] bg-primary"
            style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 2.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-[-10rem] right-[-4rem] w-[30rem] h-[30rem] rounded-full blur-[120px] bg-destructive"
            style={{ transform: `translate3d(0, ${-scrollY * 0.05}px, 0)` }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <Badge className="bg-primary/15 text-primary border-primary/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-5 sm:mb-6">
                Skills Acquisition Programme
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-5 sm:mb-6">
              {activeProgramme.hero_title || 'FREE 6-Month Skills Acquisition Programme'}
            </motion.h1>
            <motion.h2 variants={fadeInUp} className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-4 sm:mb-6 max-w-3xl mx-auto">
              {activeProgramme.hero_subtitle || 'Empower Your Future. Learn a Skill for Free.'}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              {activeProgramme.hero_description}
            </motion.p>

            {/* Sponsor + Organizer badges */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <div className="flex items-center gap-3 border-2 border-primary/40 bg-background/80 backdrop-blur-xl px-4 sm:px-5 py-3 rounded-2xl shadow-lg">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white p-1 border overflow-hidden flex-shrink-0">
                  <img src={SPONSOR_LOGO} alt={SPONSOR_NAME} className="w-full h-full object-contain" onError={(e) => ((e.currentTarget as any).style.display='none')} />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Sponsored By</div>
                  <div className="font-bold text-sm md:text-base truncate">{SPONSOR_NAME}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-2 border-destructive/30 bg-background/80 backdrop-blur-xl px-4 sm:px-5 py-3 rounded-2xl shadow-lg">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-destructive font-bold">Organized By</div>
                  <div className="font-bold text-sm md:text-base truncate">{ORGANIZER}</div>
                </div>
              </div>
            </motion.div>

            {/* Hero CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl">
                <a href={APPLY_LINK} target="_blank" rel="noreferrer">
                  Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-xl" onClick={(e) => { (e.currentTarget as HTMLElement).blur(); document.getElementById('programmes-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <a href="#programmes-section" onClick={(e) => { e.preventDefault(); document.getElementById('programmes-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  View Programmes <ChevronRight className="w-5 h-5 ml-1" />
                </a>
              </Button>
            </motion.div>

            {/* Skills tag cloud */}
            <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
              <div className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3 sm:mb-4">Skills Available to Learn</div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {heroSkills.map((s, i) => (
                  <span key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold border bg-background/70 backdrop-blur-sm transition-all hover:scale-105"
                    style={{
                      borderColor: i % 3 === 0 ? 'rgb(16 185 129 / 0.45)' : i % 3 === 1 ? 'rgb(244 63 94 / 0.45)' : 'rgb(24 24 27 / 0.6)',
                      color: i % 3 === 0 ? 'rgb(16 185 129)' : i % 3 === 1 ? 'rgb(244 63 94)' : 'var(--foreground)'
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= STICKY PROGRAMME SWITCHER ================= */}
      <section className="sticky top-[64px] sm:top-[72px] md:top-[80px] z-30 bg-background/90 backdrop-blur-xl border-y border-primary/15 py-3 sm:py-4 md:py-5 shadow-[0_4px_30px_-12px_rgba(16,185,129,0.35)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <h3 className="font-bold text-sm md:text-base tracking-tight">Select Sponsor Programme</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 text-[10px] md:text-xs ml-1">{availableProgrammes.length} LIVE</Badge>
            </div>

            {/* DROPDOWN SELECTOR (always visible on mobile; hidden on md+) */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between bg-background/80">
                    <span className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 rounded-md bg-white border p-0.5 overflow-hidden flex-shrink-0">
                        <img src={activeProgramme.sponsor_logo_url || DEFAULT_NDDC_LOGO} alt="" className="w-full h-full object-contain" />
                      </span>
                      <span className="font-semibold truncate">{activeProgramme.sponsor_name?.replace(/\(.*\)/, '').trim() || 'Programme'}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] md:w-80 max-h-[60vh] overflow-y-auto">
                  <DropdownMenuLabel>Choose a sponsor programme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableProgrammes.map((prog) => (
                    <DropdownMenuItem
                      key={prog.id}
                      onSelect={() => setSelectedProgrammeId(prog.id)}
                      className={`cursor-pointer gap-3 py-2.5 ${prog.id === selectedProgrammeId ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <span className="w-8 h-8 rounded-md bg-white border p-1 overflow-hidden flex-shrink-0">
                        <img src={prog.sponsor_logo_url || DEFAULT_NDDC_LOGO} alt="" className="w-full h-full object-contain" onError={(e) => ((e.currentTarget as any).style.display='none')}/>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{prog.sponsor_name || 'Niger Delta Development Commission (NDDC)'}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{prog.hero_title}</div>
                      </div>
                      {prog.id === selectedProgrammeId && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* TAB BAR BUTTONS (hidden on mobile; scrollable horizontal row on md+) */}
          <div className="hidden md:block -mx-2 px-2">
            <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
              {availableProgrammes.map((prog) => {
                const selected = prog.id === selectedProgrammeId;
                return (
                  <button
                    key={prog.id}
                    onClick={() => setSelectedProgrammeId(prog.id)}
                    className={`group relative flex-shrink-0 flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border-2 transition-all duration-300 ${
                      selected
                        ? 'border-primary bg-primary text-white shadow-[0_6px_20px_-4px_rgba(16,185,129,0.55)] scale-[1.02]'
                        : 'border-border bg-background hover:border-primary/40 hover:bg-primary/[0.04] text-foreground'
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-full p-1 overflow-hidden flex items-center justify-center flex-shrink-0 ${selected ? 'bg-white' : 'bg-white border'}`}>
                      <img src={prog.sponsor_logo_url || DEFAULT_NDDC_LOGO} alt="" className="w-full h-full object-contain" onError={(e) => ((e.currentTarget as any).style.display='none')} />
                    </span>
                    <span className="flex flex-col items-start leading-tight">
                      <span className="font-bold text-xs md:text-sm tracking-tight">{prog.sponsor_name?.replace(/\(.*\)/, '').trim() || 'NDDC'}</span>
                      <span className={`text-[10px] md:text-[11px] truncate max-w-[180px] ${selected ? 'text-white/85' : 'text-muted-foreground'}`}>{prog.hero_title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ANIMATED PROGRAMME CONTENT (changes when user switches programme) ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedProgrammeId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >

      {/* ================= MISSION SECTION ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="space-y-8">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Our Mission</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Transforming Lives Through Practical Education</h2>
              <div className="h-1 w-20 sm:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-8 border-l-[6px] border-l-primary shadow-xl hover:shadow-2xl transition-shadow bg-background/70 backdrop-blur">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                    <Target className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3">Mission Statement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To transform lives through practical education, innovation, and real-world skills training by providing free, accessible, and high-quality vocational, entrepreneurial, and creative development programs that empower individuals, reduce unemployment, and inspire self-reliance for sustainable community development.
                  </p>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-8 border-l-[6px] border-l-destructive shadow-xl hover:shadow-2xl transition-shadow bg-background/70 backdrop-blur">
                  <div className="w-14 h-14 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mb-5">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3">Vision Statement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become a leading organization in Africa dedicated to raising a generation of creative thinkers, problem solvers, innovators, and skilled entrepreneurs who contribute meaningfully to economic growth, social development, and national transformation.
                  </p>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full p-8 border-l-[6px] border-l-foreground/60 shadow-xl hover:shadow-2xl transition-shadow bg-background/70 backdrop-blur">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/10 text-foreground flex items-center justify-center mb-5">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl mb-3">Our Aim</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our aim is to empower individuals with practical, in-demand skills that create immediate economic opportunities. We bridge the gap between formal education and the workplace by delivering hands-on training, mentorship, and direct support that enables participants to start businesses, gain employment, and contribute meaningfully to their families and communities.
                  </p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= BUILDING SKILLS - CORE OBJECTIVES ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-primary/[0.04] border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Building Skills. Creating Opportunities.</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Building Skills. Creating Opportunities.</h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Through a carefully structured curriculum delivered by industry experts, our training programmes provide participants with a complete ecosystem of learning — from technical skills to entrepreneurship support and career guidance.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              {[
                'Provide free six-month vocational and skills acquisition training',
                'Promote creativity, innovation, and problem-solving',
                'Empower unemployed youths and women',
                'Encourage entrepreneurship',
                'Bridge education and employable skills',
                'Discover and develop talents',
                'Foster leadership and integrity',
                'Partner with government agencies and NGOs',
                'Contribute to poverty reduction',
                'Build stronger communities through lifelong learning and self-reliance'
              ].map((obj, i) => (
                <div key={i} className="p-5 rounded-xl border bg-background shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderColor: i % 2 === 0 ? 'rgb(16 185 129 / 0.25)' : 'rgb(244 63 94 / 0.25)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <p className="font-semibold text-sm leading-snug">{obj}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <Card className="p-7 border-2 border-primary/20 bg-background/80 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Practical, Industry-Relevant Training
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every programme is designed around the real needs of today's marketplace. Participants work with tools, materials, and equipment used by professionals, so they graduate confident, capable, and ready to start earning immediately.
                </p>
              </Card>
              <Card className="p-7 border-2 border-destructive/20 bg-background/80 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-destructive flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> From Training to Enterprise
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We don't stop at training. Participants receive entrepreneurship support, business development advice, and mentorship to help them start and grow their own enterprises, secure jobs, or build freelance careers.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= PROGRAMME CUSTOM FULL CONTENT (Admin Dashboard "Full Description") ================= */}
      {hasFullContent && (
        <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-primary/[0.02] border-y border-primary/10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
              <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">About This Programme</Badge>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Programme Details</h2>
                <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="p-6 sm:p-8 md:p-10 lg:p-12 bg-background border-2 border-primary/20 shadow-xl">
                  <div className="prose prose-stone dark:prose-invert max-w-none w-full
                    text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base md:text-lg"
                    style={{ lineHeight: 1.8 }}>
                    {activeProgramme.full_content}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ================= TRAINING PROGRAMMES AVAILABLE (MAIN 6) ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Main Programme Offerings</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Training Programmes Available</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                { icon: <BookOpen />, title: 'Computer & Phone Repairs', desc: 'Learn complete hardware and software repair techniques for laptops, desktops, smartphones, and tablets. Master diagnostics, component soldering, screen replacement, OS installations, firmware flashing, and customer support — so you can open your own repair shop or get employed immediately.' },
                { icon: <Palette />, title: 'Graphics Design', desc: 'From logo design and branding to flyers, posters, social media content, and full marketing collateral. Learn professional tools including CorelDRAW, Adobe Photoshop, Illustrator, and Canva. Build a portfolio and develop the client-facing skills to start earning from day one.' },
                { icon: <Camera />, title: 'Photography & Content Creation', desc: 'Train in both photography and videography with practical studio and outdoor sessions. Master camera operations, lighting, composition, photo editing, video editing, storytelling, and social media content creation — perfect for events, branding, weddings, and digital marketing.' },
                { icon: <Shirt />, title: 'Fashion Design', desc: 'Full training in fashion illustration, pattern drafting, cutting, sewing, garment finishing, and production. Participants learn to design and sew native wears, English wears, bridal dresses, uniforms, children clothes, and accessories for personal use, retail, or industrial production.' },
                { icon: <Award />, title: 'Shoe Making', desc: 'Complete shoe, bag, belt, and leather works programme. Learn pattern making, cutting, stitching, finishing, and quality production of men\'s shoes, ladies footwear, slippers, sandals, school sandals, leather bags, wallets, belts, and custom accessories.' },
                { icon: <CookingPot />, title: 'Catering & Baking', desc: 'Professional training in catering, baking, small chops production, chin-chin production, groundnut processing and packaging, cakes, pastries, confectionery, and event catering services. Includes costing, menu planning, food hygiene, and managing a profitable catering business.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="h-full p-7 hover:shadow-2xl transition-all hover:-translate-y-1 border border-primary/15 group">
                    <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center ${i % 2 === 0 ? 'bg-primary text-white' : 'bg-destructive text-white'} group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(item.icon, { className: 'w-7 h-7' })}
                    </div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MORE TRAINING OPPORTUNITIES ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-destructive/[0.04] border-y border-destructive/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Specialized Tracks</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">More Training Opportunities</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-destructive to-primary rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-8">
              {[
                { icon: <Leaf />, title: 'Agriculture', desc: 'Training in Farming, Poultry, Fishery, and Crop Production — including land preparation, nursery management, livestock handling, poultry setup, fish pond construction, feed formulation, harvest, and agribusiness management for profitable farming enterprises.' },
                { icon: <Sparkles />, title: 'Drawing & Painting', desc: 'Comprehensive training in Fine Arts, Drawing, Painting, and Arts and Crafts. Participants develop original artistic skills for illustration, murals, canvas art, portraits, textile design, crafts, and commercial artwork with opportunities for exhibitions and sales.' },
                { icon: <Star />, title: 'Event Decoration', desc: 'Event decoration and interior styling training — including balloon decor, floral design, backdrop setup, upholstery basics, wedding decoration, birthday events, corporate events, rental management, and building a successful event planning brand.' },
                { icon: <Heart />, title: 'Cosmetology', desc: 'Beauty and cosmetics training covering skin care, hairdressing, makeup, manicure, pedicure, treatments, and salon management. Participants learn to run beauty studios, work in spas and hotels, or build a personal brand as a makeup artist or beautician.' },
                { icon: <Trophy />, title: 'Batik and Tie & Dye', desc: 'Full training in textile production, Adire, tie and dye, batik, pattern creation, fabric dyeing techniques, and modern fashion textiles. Participants produce fabrics, fashion items, home decor, and branded materials for retail and export markets.' },
                { icon: <Briefcase />, title: 'Business & Entrepreneurship', desc: 'Dedicated training modules on Business Development, Entrepreneurship, Branding and Marketing, Digital Business Skills, Financial Literacy, and Record Keeping — essential tools for every participant to launch, grow, and sustain a profitable enterprise or career.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="h-full p-7 hover:shadow-2xl transition-all hover:-translate-y-1"
                    style={{ borderColor: i % 2 === 0 ? 'rgb(16 185 129 / 0.25)' : 'rgb(244 63 94 / 0.25)' }}>
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${i % 2 === 0 ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'}`}>
                      {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* STARTER PACK BANNER */}
            <motion.div variants={fadeInUp}>
              <Card className="p-6 md:p-10 bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl border-none">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-9 h-9" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2">Starter Pack</h3>
                    <p className="text-white/90 leading-relaxed">
                      At the end of the training, all candidates who successfully finish the programme and defend their projects will be entitled to a starter pack.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary bg-transparent font-bold rounded-xl whitespace-nowrap">
                    <a href={APPLY_LINK} target="_blank" rel="noreferrer">Apply Now</a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURE HIGHLIGHTS ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Why Choose Us</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Feature Highlights</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 md:p-10 bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl border-none h-full">
                  <CheckCircle className="w-10 h-10 mb-4" />
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">100% Practical Training</h3>
                  <p className="text-white/90 leading-relaxed text-lg">Learn by doing with hands-on projects and real-world applications. Every session is structured around practical, work-related tasks that build real skills from day one.</p>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="p-8 md:p-10 bg-gradient-to-br from-destructive to-destructive/80 text-white shadow-2xl border-none h-full">
                  <Award className="w-10 h-10 mb-4" />
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">Certificate of Participation</h3>
                  <p className="text-white/90 leading-relaxed text-lg">Receive official certification upon successful completion of your training. Recognized certificates valid for job applications, tenders, grants, and further admissions.</p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= WHY JOIN THIS PROGRAMME ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-primary/[0.04] border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">6 Reasons to Enroll Today</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Why Join This Programme</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                { title: 'FREE Professional Training', desc: 'The entire 6-month skills acquisition programme is 100% free for participants. Fully sponsored so that every committed young person, regardless of background, can access life-changing vocational training without financial barriers.', color: 'primary' },
                { title: 'Experienced Instructors', desc: 'Learn directly from industry experts, seasoned professionals, and master artisans who have built successful careers and businesses. Our instructors bring years of real-world experience and a commitment to mentoring the next generation.', color: 'destructive' },
                { title: 'Hands-on Practical Classes', desc: 'Classes are conducted in fully-equipped practical training environments. Every session prioritizes hands-on learning — students spend more time working on real projects and less time on theory-only lectures.', color: 'primary' },
                { title: 'Business & Entrepreneurship Support', desc: 'Every participant receives dedicated business development training, mentorship sessions, and guidance on starting and managing a successful enterprise — including branding, costing, pricing, marketing, and customer acquisition.', color: 'destructive' },
                { title: 'Career Development', desc: 'We support participants beyond graduation with career guidance, CV preparation, interview coaching, job placement support where available, and portfolio development to help them stand out to employers and clients.', color: 'primary' },
                { title: 'Networking Opportunities', desc: 'Join a vibrant community of young entrepreneurs, creatives, skilled artisans, industry professionals, mentors, and sponsors. Build networks that can lead to referrals, partnerships, mentorship, and life-long business relationships.', color: 'destructive' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="h-full p-7 bg-background hover:shadow-2xl transition-all hover:-translate-y-1 border"
                    style={{ borderColor: item.color === 'primary' ? 'rgb(16 185 129 / 0.3)' : 'rgb(244 63 94 / 0.3)' }}>
                    <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${item.color === 'primary' ? 'bg-primary text-white' : 'bg-destructive text-white'}`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className={`font-bold text-lg mb-3 ${item.color === 'primary' ? 'text-primary' : 'text-destructive'}`}>{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= WHO CAN APPLY ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Eligibility</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Who Can Apply</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-destructive to-primary rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
              {[
                { title: 'Youths', desc: 'Young people seeking to acquire practical skills for employment, empowerment, and economic independence.' },
                { title: 'Graduates', desc: 'University, polytechnic, and college graduates who want to add vocational skills for self-reliance or employment.' },
                { title: 'School Leavers', desc: 'Secondary school leavers and anyone who recently completed formal basic education and is ready to learn a trade.' },
                { title: 'Entrepreneurs', desc: 'Existing entrepreneurs who wish to upgrade their skills, expand their services, or add new product lines.' },
                { title: 'Artisans', desc: 'Skilled and semi-skilled artisans wanting to improve mastery, learn modern techniques, or earn certification.' },
                { title: 'Anyone Willing To Learn', desc: 'Any person regardless of age or background — as long as there is a genuine desire and willingness to learn and complete the programme.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="p-6 h-full border bg-background/80 hover:shadow-xl transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white ${i % 2 === 0 ? 'bg-primary' : 'bg-destructive'}`}>
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 md:p-8 bg-background border-2 border-dashed border-destructive/50 text-center">
                <div className="font-bold text-destructive text-lg md:text-2xl mb-2">No experience required.</div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  All you need is the desire to learn and the commitment to complete the 6-month programme.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= PROGRAMME IMAGES (SIMPLE GRID - NO LIGHTBOX) ================= */}
      <section id="programmes-section" className="py-14 sm:py-16 md:py-20 lg:py-24 bg-destructive/[0.04] border-y border-destructive/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Programme Pictures</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 sm:mb-5">Programme in Pictures</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Scenes from our practical skills training sessions, cohorts, and exhibitions.</p>
            </motion.div>

            {/* Simple responsive image grid */}
            <motion.div variants={fadeInUp}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {IMAGES.slice(0, 20).map((url, i) => (
                  <div key={i} className={`overflow-hidden rounded-xl border bg-background shadow-sm group`}
                    style={{
                      borderColor: i % 3 === 0 ? 'rgb(16 185 129 / 0.25)' : i % 3 === 1 ? 'rgb(244 63 94 / 0.25)' : 'rgb(24 24 27 / 0.15)'
                    }}>
                    <img
                      src={url}
                      alt={`Skill Acquisition Programme ${i + 1}`}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${[56, 64, 72, 80, 56, 72, 64, 80, 56, 72, 64, 56, 80, 72, 64, 56, 72, 80, 64, 56][i] ? `h-${[56, 64, 72, 80, 56, 72, 64, 80, 56, 72, 64, 56, 80, 72, 64, 56, 72, 80, 64, 56][i]}` : 'h-56'}`}
                      onError={(e) => { (e.currentTarget as any).style.background = '#111'; (e.currentTarget as any).style.color = '#fff'; (e.currentTarget as any).style.display = 'flex'; (e.currentTarget as any).style.alignItems = 'center'; (e.currentTarget as any).style.justifyContent = 'center'; }}
                      style={{ height: ['14rem','16rem','18rem','20rem','14rem','18rem','16rem','20rem','14rem','18rem','16rem','14rem','20rem','18rem','16rem','14rem','18rem','20rem','16rem','14rem'][i] }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= REGISTER TODAY ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={fadeInUp}>
              <Card className="relative overflow-hidden bg-background border-2 border-primary shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-destructive/5 pointer-events-none" />
                <div className="relative p-6 sm:p-8 md:p-10 lg:p-14">
                  <Badge className="bg-primary/15 text-primary border-primary/25 mb-4 sm:mb-5 uppercase tracking-widest text-[11px] sm:text-xs font-bold">Take the First Step</Badge>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Register Today</h2>
                  <div className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed mb-8 sm:mb-10">
                    <p className="text-base sm:text-lg">
                      Take the first step toward a brighter future. Join thousands of young people who have transformed their lives through our free skills acquisition programme. Whether you are a school leaver, graduate, unemployed youth, or aspiring entrepreneur, this programme is designed to give you the practical skills you need to succeed.
                    </p>
                    <p className="text-sm sm:text-base">
                      Registration is simple, transparent, and free. Submit your application today and take the first step on a journey that will equip you with real-world vocational skills, business knowledge, and the confidence to build a sustainable future for yourself, your family, and your community.
                    </p>
                  </div>

                  {/* Limited Spaces banner */}
                  <div className="border-2 border-destructive/40 bg-destructive/5 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10">
                    <div className="font-bold text-destructive text-lg sm:text-xl md:text-2xl mb-1">Limited Spaces Available!</div>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-1">Registration is first-come, first-served.</p>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Secure your spot before spaces fill up.</p>
                  </div>

                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-8 md:px-10 text-sm sm:text-base font-bold rounded-xl">
                    <a href={APPLY_LINK} target="_blank" rel="noreferrer">
                      Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= TUTORS / FACILITATORS ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-primary/[0.07] border-y border-primary/15">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={fadeInUp}>
              <Card className="p-6 sm:p-8 md:p-10 lg:p-14 text-center bg-background border-2 border-primary/30 shadow-2xl">
                <Badge className="bg-primary/15 text-primary border-primary/25 mb-4 sm:mb-6 uppercase tracking-widest text-[11px] sm:text-xs font-bold">Join Our Faculty</Badge>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Become a Tutor, Facilitator or Trainer</h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10">
                  {ORGANIZER} welcomes experienced professionals, skilled artisans, educators, entrepreneurs, and industry experts who are passionate about empowering others through practical skills development and mentorship.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold rounded-xl w-full sm:w-auto">
                  <a href={TUTOR_LINK} target="_blank" rel="noreferrer">
                    Apply as a Tutor <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= PROGRAMME HIGHLIGHTS ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">At a Glance</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Programme Highlights</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                '6 Months Intensive Training','100% FREE','Practical Learning','Modern Equipment','Expert Instructors',
                'Business & Entrepreneurship Training','Certificate Upon Completion','Career Support','Networking Opportunities','Post-Training Mentorship'
              ].map((h, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className={`p-4 sm:p-5 h-full flex items-center gap-3 border-2 hover:shadow-xl transition-all bg-background/80`}
                    style={{
                      borderColor: i % 3 === 0 ? 'rgb(16 185 129 / 0.35)' : i % 3 === 1 ? 'rgb(244 63 94 / 0.35)' : 'rgb(24 24 27 / 0.25)'
                    }}>
                    <Sparkles className={`w-5 h-5 flex-shrink-0 ${i % 3 === 0 ? 'text-primary' : i % 3 === 1 ? 'text-destructive' : 'text-foreground'}`} />
                    <p className="font-bold text-sm leading-snug">{h}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= QUICK APPLICATION PROCESS (TIMELINE) ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-destructive/[0.04] border-y border-destructive/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">4 Simple Steps</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Quick Application Process</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-destructive to-primary rounded-full" />
            </motion.div>

            <div className="relative space-y-6 sm:space-y-8 md:space-y-16">
              <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-destructive rounded-full hidden md:block" />
              {[
                { t: 'Choose your preferred course', d: 'Review the training programmes available and pick the skill track that best matches your interest, goals, and career aspirations.' },
                { t: 'Submit your application', d: 'Complete the free online application form with your details, background information, and preferred study track. No payment required.' },
                { t: 'Attend orientation session', d: 'Successful applicants are invited to a mandatory orientation session where you meet your facilitators, receive your timetable, and understand programme expectations.' },
                { t: 'Begin your training journey', d: 'Resumption! Start your classes, meet your cohort, and begin your 6-month intensive practical training and mentorship journey.' }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className={`relative flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`md:w-[calc(50%-2.5rem)] ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                    <Card className={`p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all inline-block text-left w-full bg-background/90 border-2`}
                      style={{ borderColor: i % 2 === 0 ? 'rgb(16 185 129 / 0.3)' : 'rgb(244 63 94 / 0.3)' }}>
                      <div className={`font-bold text-xl sm:text-2xl mb-2 ${i % 2 === 0 ? 'text-primary' : 'text-destructive'}`}>Step {i + 1}</div>
                      <h3 className="font-bold text-lg sm:text-xl mb-2">{item.t}</h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.d}</p>
                    </Card>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-background border-4 border-primary text-primary font-bold items-center justify-center shadow-xl z-10">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="md:hidden w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SPONSORS ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Our Sponsor</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Sponsors & Partners</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 sm:p-8 md:p-10 lg:p-14 text-center bg-background border-2 border-primary/40 shadow-2xl">
                <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2 sm:mb-3">Current Lead Sponsor</div>
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-52 lg:h-52 mx-auto rounded-2xl sm:rounded-3xl bg-white border-2 border-primary/20 p-2 sm:p-3 mb-4 sm:mb-6 overflow-hidden shadow-inner">
                  <img src={SPONSOR_LOGO} alt={SPONSOR_NAME} className="w-full h-full object-contain" onError={(e) => ((e.currentTarget as any).style.display='none')} />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">{SPONSOR_NAME}</h3>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  {isDefaultProgramme
                    ? `This programme is proudly sponsored by ${SPONSOR_NAME} in partnership with ${ORGANIZER} as part of their commitment to youth empowerment, vocational development, and sustainable socio-economic transformation across the Niger Delta region and Nigeria at large.`
                    : `This programme is proudly sponsored by ${SPONSOR_NAME} in partnership with ${ORGANIZER} as part of their commitment to youth empowerment, skills development, vocational training, and sustainable socio-economic transformation across communities in Nigeria and beyond.`
                  }
                </p>
                {activeProgramme.sponsor_website && (
                  <div className="mt-4 sm:mt-6">
                    <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                      <a href={normalizeUrl(activeProgramme.sponsor_website)} target="_blank" rel="noreferrer">
                        <Globe className="w-4 h-4 mr-2" /> Visit Sponsor Website
                      </a>
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTACT (NO GOOGLE MAP) ================= */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24 bg-primary/[0.04] border-y border-primary/10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-xs font-bold">Get in Touch</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5">Contact Us</h2>
              <div className="h-1 w-16 sm:w-20 md:w-24 mx-auto bg-gradient-to-r from-primary to-destructive rounded-full" />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 sm:p-8 md:p-10 lg:p-14 bg-background border-2 border-primary/30 shadow-2xl">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-primary">{ORGANIZER}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <a href="https://www.google.com/maps/search/Port+Harcourt+Rivers+State+Nigeria" target="_blank" rel="noreferrer" className="p-4 sm:p-5 md:p-6 rounded-xl border-2 border-primary/25 bg-primary/[0.03] hover:bg-primary/[0.07] transition-all group flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold mb-1">Location</div>
                      <p className="font-bold text-base sm:text-lg md:text-lg leading-tight">Port Harcourt, Rivers State, Nigeria</p>
                    </div>
                  </a>
                  <a href="tel:+2348103833239" className="p-4 sm:p-5 md:p-6 rounded-xl border-2 border-destructive/25 bg-destructive/[0.03] hover:bg-destructive/[0.07] transition-all group flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-destructive text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-destructive font-bold mb-1">Phone</div>
                      <p className="font-bold text-base sm:text-lg leading-tight">+234 810 383 3239</p>
                    </div>
                  </a>
                  <a href="mailto:worldthinkerscompetition@gmail.com" className="p-4 sm:p-5 md:p-6 rounded-xl border-2 border-destructive/25 bg-destructive/[0.03] hover:bg-destructive/[0.07] transition-all group flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-destructive text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-destructive font-bold mb-1">Email</div>
                      <p className="font-bold text-sm sm:text-base md:text-lg leading-tight break-all">worldthinkerscompetition@gmail.com</p>
                    </div>
                  </a>
                  <a href="http://www.thinkersproblemsolvers.com" target="_blank" rel="noreferrer" className="p-4 sm:p-5 md:p-6 rounded-xl border-2 border-primary/25 bg-primary/[0.03] hover:bg-primary/[0.07] transition-all group flex items-start gap-3 sm:gap-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="w-5 sm:w-6 h-5 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold mb-1">Website</div>
                      <p className="font-bold text-base sm:text-lg leading-tight">www.thinkersproblemsolvers.com</p>
                    </div>
                  </a>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-16 sm:py-18 md:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-destructive" />
        <div className="absolute -top-20 -left-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl relative">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={fadeInUp} className="text-center text-white">
              <Badge className="bg-white/15 text-white border-white/25 mb-4 sm:mb-6 uppercase tracking-widest text-[11px] sm:text-xs font-bold">Start Your Journey</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">Learn Today. Earn Tomorrow.<br className="hidden md:block" /> Build Your Future.</h2>
              <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
                Do not let this opportunity pass you by. Every expert you admire started as a beginner. Every successful business started with a single step. Today, take that step. Enrol in the FREE 6-month Skills Acquisition Programme sponsored by {SPONSOR_NAME} and organized by {ORGANIZER} — and begin building a future of skill, confidence, enterprise, and lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button asChild size="lg" className="bg-white hover:bg-white/90 text-primary h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold rounded-xl shadow-2xl w-full sm:w-auto">
                  <a href={APPLY_LINK} target="_blank" rel="noreferrer">
                    Apply Now <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary bg-transparent h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold rounded-xl shadow-xl bg-primary/20 w-full sm:w-auto">
                  <a href={TUTOR_LINK} target="_blank" rel="noreferrer">
                    Become a Tutor
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default SkillAcquisition;
