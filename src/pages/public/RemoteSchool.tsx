import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { normalizeUrl } from '@/lib/utils';
import {
  GraduationCap, Users, BookOpen, Clock, Shield, UserCheck,
  Monitor, CheckCircle2, ArrowRight, ExternalLink, Star,
  Languages, Calculator, FlaskConical, Calculator as CalcIcon,
  Palette, Music, Landmark, Leaf, Building2, Briefcase,
  Globe2, Zap, Target, Award, MessageCircle, Image as ImageIcon,
  X, ZoomIn
} from 'lucide-react';

const STUDENT_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdVSXi26Psdh3VORwNDZDyYu9gfDHkQulAjlEaK9cF2zo367Q/viewform?usp=publish-editor';
const TEACHER_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdVSXi26Psdh3VORwNDZDyYu9gfDHkQulAjlEaK9cF2zo367Q/viewform?usp=publish-editor';
const WHATSAPP_GROUP = 'https://chat.whatsapp.com/KY';
const FLYER_DEFAULT_CTA_URL = 'https://chat.whatsapp.com/KYSRJs7HR3rJ9fHMxr2cSj';
const FLYER_DEFAULT_CTA_TEXT = 'LEARN MORE';

// ============ SECTION A — 4 APPLY-AS-STUDENT / TEACHER FLYERS ============
// These 4 sit between the Info Banners and "How It Works" and each one
// carries a unique title + description matching its flyer content + the
// shared WhatsApp group CTA link below.
const DEFAULT_APPLY_FLYERS: any[] = [
  {
    id: 'default-apply-1',
    section: 'apply' as const,
    image_url: 'https://i.ibb.co/5XsXDJ63/1.jpg',
    title: 'Register as a Student',
    description: 'Kickstart your academic journey — sign up for personalized one-on-one or group lessons with our qualified teachers across Mathematics, Sciences, English, and more.',
    button_text: FLYER_DEFAULT_CTA_TEXT,
    button_url: FLYER_DEFAULT_CTA_URL,
    display_order: 1,
  },
  {
    id: 'default-apply-2',
    section: 'apply' as const,
    image_url: 'https://i.ibb.co/x8qqWj7b/2.jpg',
    title: 'Apply as a Teacher',
    description: 'Qualified educators and passionate tutors — join our team, share your expertise, and help students across every subject and level achieve excellence.',
    button_text: FLYER_DEFAULT_CTA_TEXT,
    button_url: FLYER_DEFAULT_CTA_URL,
    display_order: 2,
  },
  {
    id: 'default-apply-3',
    section: 'apply' as const,
    image_url: 'https://i.ibb.co/SX7L6Gnm/3.jpg',
    title: 'Flexible Online Learning',
    description: 'Anywhere, anytime. From Nursery to A-Level, WAEC, JAMB, NECO, IGCSE and Adult Education — our tutors meet you where you are on a schedule you choose.',
    button_text: FLYER_DEFAULT_CTA_TEXT,
    button_url: FLYER_DEFAULT_CTA_URL,
    display_order: 3,
  },
  {
    id: 'default-apply-4',
    section: 'apply' as const,
    image_url: 'https://i.ibb.co/dwx6jN61/4.jpg',
    title: 'Speak With Us on WhatsApp',
    description: 'Still have questions? Get our full programme details, price list, available subjects and tutors, and enrollment guidance directly in the WhatsApp group.',
    button_text: FLYER_DEFAULT_CTA_TEXT,
    button_url: FLYER_DEFAULT_CTA_URL,
    display_order: 4,
  },
];

// ============ SECTION B — 9 FLYERS AFTER "WHY CHOOSE US?" ============
// Large-format promotional flyers rendered as a 3-column image grid with
// the same shared WhatsApp CTA link. Title/description are optional — the
// flyers speak for themselves. Admin Dashboard can override both CTA fields.
const DEFAULT_GALLERY_FLYERS: any[] = [
  { id: 'default-gallery-1', section: 'gallery' as const, image_url: 'https://i.ibb.co/zH04mwmn/photo-1-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 1 },
  { id: 'default-gallery-2', section: 'gallery' as const, image_url: 'https://i.ibb.co/TxJtDCfZ/photo-2-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 2 },
  { id: 'default-gallery-3', section: 'gallery' as const, image_url: 'https://i.ibb.co/5X09d8Zx/photo-3-2026-07-31-12-41-19.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 3 },
  { id: 'default-gallery-4', section: 'gallery' as const, image_url: 'https://i.ibb.co/QvSb7MsH/photo-4-2026-07-31-12-41-19.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 4 },
  { id: 'default-gallery-5', section: 'gallery' as const, image_url: 'https://i.ibb.co/twCPM2h8/photo-5-2026-07-31-12-41-19.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 5 },
  { id: 'default-gallery-6', section: 'gallery' as const, image_url: 'https://i.ibb.co/XfrKhSTP/photo-6-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 6 },
  { id: 'default-gallery-7', section: 'gallery' as const, image_url: 'https://i.ibb.co/MDFLXK9g/photo-7-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 7 },
  { id: 'default-gallery-8', section: 'gallery' as const, image_url: 'https://i.ibb.co/Rkx5y4XH/photo-8-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 8 },
  { id: 'default-gallery-9', section: 'gallery' as const, image_url: 'https://i.ibb.co/RpPPbJcF/photo-9-2026-07-31-12-38-51.jpg', title: '', description: '', button_text: FLYER_DEFAULT_CTA_TEXT, button_url: FLYER_DEFAULT_CTA_URL, display_order: 9 },
];

// Rendered flyer card — shared by both sections. Accepts `layout` to pick
// "apply" (tall card with image + title + description + CTA + click-to-zoom modal
// vs "gallery" (static large image, NO buttons — purely decorative gallery.
function FlyerCard({ flyer, layout, idx, onOpenApply }: { flyer: any; layout: 'apply' | 'gallery'; idx: number; onOpenApply?: (f: any) => void }) {
  const customText = (flyer.button_text || '').trim();
  const customUrl = (flyer.button_url || '').trim();
  const label = customText || FLYER_DEFAULT_CTA_TEXT;
  const hrefRaw = customUrl || FLYER_DEFAULT_CTA_URL;
  const href = normalizeUrl(hrefRaw);
  const isExternal = /^https?:\/\//i.test(href);
  const ctaIcon = isExternal ? <ExternalLink className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />;
  const hasTitle = (flyer.title || '').trim().length > 0;
  const hasDesc = (flyer.description || '').trim().length > 0;

  if (layout === 'apply') {
    return (
      <motion.div
        key={flyer.id || `${flyer.image_url}-${idx}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(idx * 0.08, 0.32) }}
        className="h-full flex flex-col"
      >
        <Card
          className="rounded-2xl sm:rounded-3xl h-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border-none group flex flex-col cursor-pointer"
          onClick={() => onOpenApply && onOpenApply(flyer)}
        >
          <div className="relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-muted flex-shrink-0">
            <img
              src={flyer.image_url}
              alt={flyer.title || `Remote School Apply Flyer ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Apply+Flyer'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 rounded-full bg-black/55 backdrop-blur px-2 py-1 sm:px-2.5 sm:py-1.5 text-white text-[9px] sm:text-[10px] md:text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Tap to view
            </div>
          </div>
          <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col gap-2 sm:gap-3 flex-1">
            <div>
              <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold leading-snug mb-1.5 sm:mb-2">
                {hasTitle ? flyer.title : 'Apply & Enroll Today'}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                {hasDesc ? flyer.description : 'Join our WhatsApp group to get full enrollment details, pricing, and available tutor schedules.'}
              </p>
            </div>
            <div className="mt-auto pt-2 sm:pt-3 border-t border-border/60">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={buttonVariants({ className: "w-full rounded-full text-xs sm:text-sm font-bold py-4 sm:py-5 md:py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all h-auto" })}
              >
                {label}
                {ctaIcon}
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ---- Gallery (post-Why-Choose-Us) layout — STATIC IMAGES, NO BUTTONS ----
  return (
    <motion.div
      key={flyer.id || `${flyer.image_url}-${idx}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(idx * 0.06, 0.4) }}
      className="h-full flex flex-col"
    >
      <Card className="rounded-2xl sm:rounded-3xl h-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border-none group bg-card flex flex-col">
        <div className="relative w-full overflow-hidden bg-muted aspect-[4/5] md:aspect-[3/4] flex-shrink-0 flex-1">
          <img
            src={flyer.image_url}
            alt={flyer.title || `Remote School Flyer ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Flyer+Image'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {hasTitle && (
          <CardContent className="p-3 sm:p-4 md:p-5">
            <h4 className="font-bold text-xs sm:text-sm md:text-base leading-snug">{flyer.title}</h4>
            {hasDesc && (
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-4">{flyer.description}</p>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

export default function RemoteSchool() {
  const [applyFlyers, setApplyFlyers] = useState<any[]>(DEFAULT_APPLY_FLYERS);
  const [galleryFlyers, setGalleryFlyers] = useState<any[]>(DEFAULT_GALLERY_FLYERS);
  const [isLoadingFlyers, setIsLoadingFlyers] = useState(true);
  const [openApplyFlyer, setOpenApplyFlyer] = useState<any>(null);

  useEffect(() => {
    const loadFlyers = async () => {
      try {
        const { data, error } = await supabase
          .from('remote_school_flyers')
          .select('*')
          .eq('status', 'active')
          .order('display_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (Array.isArray(data) && data.length > 0) {
          const apply = data.filter((r: any) => !r.section || r.section === 'apply' || r.section === null);
          if (apply.length > 0) setApplyFlyers(apply);
        }
      } catch (err) {
        // Table may not exist yet — keep defaults.
      } finally {
        setIsLoadingFlyers(false);
      }
    };
    loadFlyers();
  }, []);

  useEffect(() => {
    if (openApplyFlyer) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenApplyFlyer(null); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [openApplyFlyer]);

  // Section numbering — referenced in heading comments.
  // 1. Hero
  // 2. Quick Info Banners
  // 3. APPLY FLYERS (NEW — 4 images, each with title + desc)
  // 4. How It Works
  // 5. Subjects We Offer
  // 6. Levels We Teach
  // 7. Why Choose Us?
  // 8. GALLERY FLYERS (9 images after "Why Choose Us")
  // 9. Become a Teacher CTA
  // 10. Final Student CTA Strip

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#D32F2F40,transparent_50%),radial-gradient(circle_at_80%_30%,#F57F1740,transparent_50%),radial-gradient(circle_at_50%_80%,#388E3C40,transparent_50%)]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 md:py-28 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center max-w-4xl bg-background/95 p-5 sm:p-6 md:p-8 lg:p-12 xl:p-14 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-black/20 border border-white/10 dark:border-white/10"
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-5 bg-gradient-to-r from-[#1e40af] via-[#7c3aed] to-[#D32F2F] text-white rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-md">
              <Globe2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="whitespace-normal">Online / Remote Learning — Anywhere, Anytime</span>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.15] sm:leading-[1.1] md:leading-[0.95] tracking-tight mb-3 sm:mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-[#1e40af] via-[#7c3aed] to-[#D32F2F] bg-clip-text text-transparent pb-1 sm:pb-2 inline-block">
                World Thinkers and Problem Solvers Online School
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-foreground font-serif italic max-w-3xl mx-auto mb-2 sm:mb-3 leading-snug sm:leading-normal">
              "Connecting Students with Qualified Teachers for Quality Learning Anywhere, Anytime."
            </p>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you need academic support, exam preparation, or one-on-one tutoring, we&apos;re here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <a
                href={STUDENT_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ className: "rounded-full text-sm md:text-base px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto font-bold shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 transition-all bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white" })}
              >
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Register as a Student
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              </a>
              <a
                href={TEACHER_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", className: "rounded-full text-sm md:text-base px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto font-bold bg-background hover:bg-primary/5 border-2" })}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Apply as a Teacher
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 2. QUICK INFO BANNERS ==================== */}
      <section className="py-10 sm:py-12 md:py-20 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-indigo-950/20 dark:via-background dark:to-violet-950/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
              <Card className="rounded-2xl sm:rounded-3xl h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all border-t-4 border-t-indigo-500">
                <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">Register as a Student</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">Sign up for personalized one-on-one or group lessons tailored to your curriculum, pace, and goals.</p>
                  <a href={STUDENT_FORM} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "rounded-full justify-center font-semibold bg-indigo-600 hover:bg-indigo-700 text-white w-full text-sm sm:text-base h-11 sm:h-12" })}>
                    Student Registration <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card className="rounded-2xl sm:rounded-3xl h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all border-t-4 border-t-emerald-500">
                <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">Register as a Teacher</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">Are you a passionate and qualified teacher? Join our team and get connected with students who need your expertise.</p>
                  <a href={TEACHER_FORM} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "rounded-full justify-center font-semibold bg-emerald-600 hover:bg-emerald-700 text-white w-full text-sm sm:text-base h-11 sm:h-12" })}>
                    Teacher Application <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <Card className="rounded-2xl sm:rounded-3xl h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all border-t-4 border-t-amber-500 md:col-span-2 lg:col-span-1">
                <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">Hear More From Us</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">Join our WhatsApp group to hear more about the Online/Remote School programme, updates, and announcements.</p>
                  <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "rounded-full justify-center font-semibold w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-md shadow-green-500/30 text-sm sm:text-base h-11 sm:h-12" })}>
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Join WhatsApp <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 3. APPLY AS STUDENT / TEACHER FLYERS ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-white via-sky-50/40 to-white dark:from-background dark:via-sky-950/10 dark:to-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-sky-600/10 text-sky-700 dark:text-sky-300 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest whitespace-normal text-center">
              <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Apply as Student / Teacher
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Apply as a Student or Teacher Today
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-1">
              Explore our detailed programme flyers below. Every flyer carries the full enrollment details — plus a quick <strong>LEARN MORE</strong> button that takes you straight to our WhatsApp group for pricing, schedule information, and one-on-one guidance.
            </p>
          </div>

          {isLoadingFlyers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 md:gap-7">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl sm:rounded-3xl overflow-hidden bg-muted animate-pulse h-[440px] sm:h-[480px] md:h-[560px]" />
              ))}
            </div>
          ) : applyFlyers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {applyFlyers.map((f, i) => (
                <FlyerCard key={f.id || `apply-${i}`} flyer={f} layout="apply" idx={i} onOpenApply={setOpenApplyFlyer} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ==================== 4. HOW IT WORKS ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-primary/10 text-primary text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Simple Process
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">How It Works</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Two streamlined paths — one for eager learners and one for dedicated educators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl sm:rounded-3xl p-1 shadow-xl">
                <div className="bg-background rounded-[1.2rem] sm:rounded-[1.4rem] p-5 sm:p-6 md:p-8 h-full">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">For Students</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { step: 1, title: 'Register Online', desc: 'Fill out the quick student registration form and tell us about your learning needs.' },
                      { step: 2, title: 'Review Your Learning Needs', desc: 'Our team evaluates your curriculum, target subjects, and preferred schedule.' },
                      { step: 3, title: 'A Qualified Teacher Is Assigned', desc: 'We match you with a verified teacher whose expertise fits your requirements perfectly.' },
                      { step: 4, title: 'Start Your Lessons', desc: 'Begin interactive online lessons — one-on-one or in small groups.' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-sm sm:shadow-md text-sm sm:text-base">{item.step}</div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 leading-snug">{item.title}</h4>
                          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl sm:rounded-3xl p-1 shadow-xl">
                <div className="bg-background rounded-[1.2rem] sm:rounded-[1.4rem] p-5 sm:p-6 md:p-8 h-full">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">For Teachers</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { step: 1, title: 'Complete the Application', desc: 'Submit the teacher application form with your background, specialties, and availability.' },
                      { step: 2, title: 'Upload Credentials', desc: 'Share your certificates, teaching qualifications, and proof of experience.' },
                      { step: 3, title: 'Pass Our Verification Process', desc: 'Our team reviews your credentials and conducts a brief screening interview.' },
                      { step: 4, title: 'Receive Student Assignments', desc: 'Get matched with students based on your subject expertise, level, and availability.' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center font-bold shadow-sm sm:shadow-md text-sm sm:text-base">{item.step}</div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 leading-snug">{item.title}</h4>
                          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== 5. SUBJECTS WE OFFER ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900/40 dark:to-indigo-950/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-accent/10 text-accent text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Comprehensive Curriculum
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">Subjects We Offer</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Across every discipline — from the sciences to the arts and humanities — we&apos;ve got expert teachers ready to guide you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {[
              { name: 'Mathematics', icon: Calculator },
              { name: 'English Language', icon: Languages },
              { name: 'Physics', icon: CalcIcon },
              { name: 'Chemistry', icon: FlaskConical },
              { name: 'Biology', icon: Leaf },
              { name: 'Economics', icon: Briefcase },
              { name: 'Government', icon: Building2 },
              { name: 'Literature', icon: BookOpen },
              { name: 'Computer Studies', icon: Monitor },
              { name: 'French', icon: Languages },
              { name: 'Accounting', icon: Calculator },
              { name: 'Civic Education', icon: Landmark },
              { name: 'Agricultural Science', icon: Leaf },
              { name: 'Further Mathematics', icon: Calculator },
              { name: 'And more...', icon: Star }
            ].map((subject, idx) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card className="rounded-xl sm:rounded-2xl h-full bg-background border hover:border-primary/30 hover:shadow-lg transition-all overflow-hidden group">
                    <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col items-center text-center gap-1.5 sm:gap-2 h-full">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all group-hover:scale-110 group-hover:from-indigo-500/20 group-hover:to-violet-500/20">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h4 className="font-semibold text-[11px] sm:text-xs md:text-sm leading-snug text-center">{subject.name}</h4>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 6. LEVELS WE TEACH ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-destructive/10 text-destructive text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest">
              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> For Every Stage of Learning
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">Levels We Teach</h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              From early foundation years to adult continuing education — every learner is welcome.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {[
              { level: 'Nursery', accent: 'from-pink-500 to-rose-500', icon: Palette },
              { level: 'Primary', accent: 'from-amber-500 to-orange-500', icon: Star },
              { level: 'Junior Secondary', accent: 'from-emerald-500 to-green-500', icon: BookOpen },
              { level: 'Senior Secondary', accent: 'from-teal-500 to-cyan-500', icon: Calculator },
              { level: 'WAEC', accent: 'from-indigo-500 to-blue-500', icon: Award },
              { level: 'NECO', accent: 'from-violet-500 to-purple-500', icon: Award },
              { level: 'JAMB', accent: 'from-fuchsia-500 to-pink-500', icon: Award },
              { level: 'IGCSE', accent: 'from-red-500 to-rose-500', icon: Globe2 },
              { level: 'A-Level', accent: 'from-blue-600 to-indigo-600', icon: Award },
              { level: 'Adult Education', accent: 'from-slate-600 to-slate-700', icon: Users }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.level}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-br ${item.accent} shadow-md hover:shadow-xl transition-all h-full`}>
                    <div className="bg-background rounded-[0.7rem] sm:rounded-[0.9rem] p-4 sm:p-5 md:p-6 h-full flex flex-col items-center text-center gap-1.5 sm:gap-2">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm md:text-base leading-tight text-center">{item.level}</h4>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 7. WHY CHOOSE US? ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-6 sm:top-10 -left-10 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-6 sm:bottom-10 -right-10 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-white/10 text-white/90 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest border border-white/20">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Trusted Excellence
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">Why Choose Us?</h2>
            <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              A thoughtful, student-first approach to remote education — backed by experienced educators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { icon: UserCheck, title: 'Qualified & Verified Teachers', desc: 'Every educator on our platform is screened, credential-verified, and experienced.' },
              { icon: Clock, title: 'Flexible Schedules', desc: 'Choose lesson times that fit your timetable — weekdays, evenings, or weekends.' },
              { icon: Users, title: '1-on-1 & Group Classes', desc: 'Learn in focused private sessions or collaborative small-group settings.' },
              { icon: Zap, title: 'Affordable Tuition', desc: 'Quality learning at prices families can afford, with flexible payment options.' },
              { icon: Monitor, title: 'Interactive Online Lessons', desc: 'Engaging live sessions with modern digital tools and interactive materials.' },
              { icon: Target, title: 'Progress Monitoring', desc: 'Track student improvement with regular assessments, feedback, and reports.' },
              { icon: Shield, title: 'Safe & Secure Environment', desc: 'All lessons happen in a moderated, safe, and private learning space.' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className={idx === 6 ? 'sm:col-span-2 lg:col-span-1' : ''}
                >
                  <Card className="rounded-2xl sm:rounded-3xl h-full bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all hover:bg-white/10">
                    <CardContent className="p-5 sm:p-6 md:p-7 flex flex-col gap-2.5 sm:gap-3 h-full">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-white">{item.title}</h3>
                      <p className="text-white/70 text-sm sm:text-base leading-relaxed flex-1">{item.desc}</p>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-auto" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 8. LARGE FLYER GALLERY (AFTER WHY CHOOSE US) ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-white via-indigo-50/40 to-white dark:from-background dark:via-indigo-950/10 dark:to-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <div className="mb-3 inline-flex items-center gap-1.5 sm:gap-2 py-1 px-3 sm:px-4 rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-widest">
              <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Photo Gallery
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Our Online School in Pictures
            </h2>
          </div>

          {isLoadingFlyers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 md:gap-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl sm:rounded-3xl overflow-hidden bg-muted animate-pulse h-[420px] sm:h-[460px] md:h-[520px]" />
              ))}
            </div>
          ) : galleryFlyers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {galleryFlyers.map((f, i) => (
                <FlyerCard key={f.id || `gallery-${i}`} flyer={f} layout="gallery" idx={i} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ==================== 9. BECOME A TEACHER CTA ==================== */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-emerald-950/20 dark:via-background dark:to-green-950/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative p-5 sm:p-6 md:p-8 lg:p-12 xl:p-16 text-center text-white">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-xl sm:rounded-2xl bg-white/15 border border-white/20 backdrop-blur flex items-center justify-center mb-4 sm:mb-6 shadow-lg shrink-0">
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">Become a Teacher</h2>
                <p className="text-sm sm:text-base md:text-xl text-white/90 max-w-3xl mx-auto mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                  Passionate educators are the heart of everything we do. If you are a qualified, dedicated teacher looking to connect with motivated students, we&apos;d love to hear from you.
                </p>
                <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                  Share your expertise, set your own schedule, and help shape bright futures — one lesson at a time.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                  <a href={TEACHER_FORM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 rounded-full text-xs sm:text-sm md:text-base font-bold bg-white text-emerald-700 hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] w-full sm:w-auto">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Apply to Teach <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                  </a>
                  <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 rounded-full text-xs sm:text-sm md:text-base font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all w-full sm:w-auto backdrop-blur">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Learn More on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 10. FINAL STUDENT CTA STRIP ==================== */}
      <section className="py-10 sm:py-12 md:py-16 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl text-center">
          <h3 className="font-serif text-xl sm:text-2xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">Ready to Start Learning?</h3>
          <p className="text-background/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Your journey to academic success begins with a single step. Register today and let&apos;s learn together.
          </p>
          <a href={STUDENT_FORM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 sm:h-12 px-8 sm:px-10 rounded-full text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white shadow-2xl hover:shadow-[0_0_60px_rgba(99,102,241,0.4)] hover:scale-[1.02] transition-all w-full sm:w-auto">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" /> Register as a Student <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          </a>
        </div>
      </section>

      {/* ==================== LIGHTBOX MODAL (Apply Flyer Full-View) ==================== */}
      {openApplyFlyer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-10 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpenApplyFlyer(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col md:flex-row rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-background border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close flyer preview"
              onClick={() => setOpenApplyFlyer(null)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-sm"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="relative flex-1 bg-muted min-h-[260px] sm:min-h-[320px] md:min-h-[600px] max-h-[55vh] sm:max-h-[60vh] md:max-h-[85vh] overflow-auto flex items-center justify-center">
              <img
                src={openApplyFlyer.image_url}
                alt={openApplyFlyer.title || 'Full-size flyer'}
                className="w-full h-full object-contain bg-black"
                onError={(e: any) => { e.currentTarget.src = 'https://via.placeholder.com/800x1000?text=Flyer'; }}
              />
            </div>
            <div className="w-full md:w-[320px] lg:w-[340px] shrink-0 flex flex-col p-4 sm:p-5 md:p-6 lg:p-7 gap-4 sm:gap-5 border-t md:border-t-0 md:border-l border-border/60 bg-gradient-to-b from-background to-muted/30 max-h-[40vh] sm:max-h-none">
              <div className="flex-1 min-h-0 overflow-auto pr-1">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-sky-600 dark:text-sky-400 font-bold mb-2">Apply Flyer</div>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2 sm:mb-3">
                  {openApplyFlyer.title || 'Apply & Enroll Today'}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {openApplyFlyer.description || 'Join our WhatsApp group to get full enrollment details, pricing, and available tutor schedules.'}
                </p>
              </div>
              <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-border/60 shrink-0">
                <a
                  href={normalizeUrl(openApplyFlyer.button_url || FLYER_DEFAULT_CTA_URL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ className: "w-full rounded-full font-bold py-4 sm:py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all h-auto text-xs sm:text-sm" })}
                >
                  {openApplyFlyer.button_text || FLYER_DEFAULT_CTA_TEXT}
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                </a>
                <p className="text-[10px] sm:text-[11px] text-center text-muted-foreground leading-relaxed px-1 sm:px-2">
                  Tap the button above for full details on WhatsApp. Press Esc or tap outside to close.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
