import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, GraduationCap, DollarSign, Activity, Check, Download, Trash2, Key, UploadCloud, Link as LinkIcon, Image as ImageIcon, Video, Plus, Database, Calendar, ArrowRight, BookOpen, Sparkles, MapPin, Palette } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAppStore } from '@/store'
import AdminLogin from './AdminLogin'
import { uploadFileToSupabase, supabase, saveToSupabaseTable, updateAdminPassword, deleteFromSupabaseTable, deleteFileFromSupabase, fetchWinnersArtwork, fetchActivities, fetchVideos, fetchArtworkGallery } from '@/lib/supabase'

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const handleFileUpload = async (file: File, bucket: string, path: string) => {
  if (file.size > 5242880) throw new Error('File must be less than 5MB');
  
  try {
    return await uploadFileToSupabase(file, bucket, path);
  } catch (e: any) {
    const msg: string = typeof e?.message === 'string' ? e.message : String(e ?? '');
    const isStorageFailure =
      /failed to fetch/i.test(msg) ||
      /storage/i.test(msg) ||
      /bucket/i.test(msg) ||
      /upload/i.test(msg) ||
      /network/i.test(msg);
    if (!isStorageFailure) {
      console.error('Supabase upload failed:', e);
      throw new Error(`Upload failed: ${msg}`);
    }
    try {
      const dataUrl = await fileToBase64(file);
      console.warn(`Supabase storage upload failed for ${file.name}, using inline base64 (${Math.round(dataUrl.length / 1024)}KB). Reason: ${msg}`);
      return dataUrl;
    } catch (fallbackErr: any) {
      const fbMsg = typeof fallbackErr?.message ?? String(fallbackErr);
      console.error('Supabase upload failed AND fallback encode also failed:', fallbackErr);
      throw new Error(`Upload failed: ${msg}. Fallback also failed: ${fbMsg}`);
    }
  }
}

const DEFAULT_ART_MATERIALS: any[] = [
  { title: 'ARTIST BOX, 150 ART SET', description: 'ARTIST BOX, 150 ART SET - N54,000', image_url: 'https://i.ibb.co/KpsrYSBk/IMG-20260728-WA0042.jpg', display_order: 1 },
  { title: 'Crayola 24 Mini Kids Maxi Wax Crayons', description: 'Crayola 24 Mini Kids Maxi Wax Crayons - Assorted Colors Brand: Crayola | Similar Products from Crayola N33,250', image_url: 'https://i.ibb.co/vCmsn7Y8/IMG-20260728-WA0043.jpg', display_order: 2 },
  { title: 'Monami 12 Color Poster Paint Set', description: 'Monami 12 Color Poster Paint Set - Premium Water-Based Art Colors with Portable Storage Case. Brand: Monami | Similar Products from Monami - N13,350', image_url: 'https://i.ibb.co/4nsb5R31/IMG-20260728-WA0044.jpg', display_order: 3 },
  { title: '12Pcs Artist Paint Brush Pen', description: '12Pcs Artist Paint Brush Pen for Acrylic, Oil Painting, Drawing - N17,500', image_url: 'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', display_order: 4 },
  { title: '32Pcs Oil Painting Brush Set', description: '32Pcs Oil Painting Brush Set, Nylon Hair Brush Set - N24,400', image_url: 'https://i.ibb.co/4Ljt1Xt/IMG-20260728-WA0045-1.jpg', display_order: 5 },
  { title: 'Paint Runner Roller Pro Kit', description: 'Paint Runner Roller Pro Rollers Wall Painting Kit, Walls Brush Handle Tool, Home Garden+Extension Pole Tube DIY - N55,450', image_url: 'https://i.ibb.co/ZyyccL4/IMG-20260728-WA0046.jpg', display_order: 6 },
  { title: '17 Holes Non-Stick Paint Palette', description: '17 Holes Non-Stick Paint Palette/Artist Paint Mixing Tray - N16,500', image_url: 'https://i.ibb.co/2bnNBcQ/IMG-20260728-WA0047.jpg', display_order: 7 },
  { title: '5 Painting Knives Stainless Spatula', description: '5 Painting Knives Stainless Spatula Palette Knife - N19,999', image_url: 'https://i.ibb.co/Tqbw1P5w/IMG-20260728-WA0048.jpg', display_order: 8 },
  { title: '35Pcs Professional Sketching Drawing Kit', description: '35Pcs Professional Sketching Drawing Artist Kit, Sketch Pencils, Charcoal Art Tools Set - N18,994', image_url: 'https://i.ibb.co/sdt2cZBX/IMG-20260728-WA0049.jpg', display_order: 9 },
  { title: 'Digabi 24 Colors Dual-Ended Colored Pencils', description: 'Digabi 12pcs/24 Colors Dual-Ended Water-Soluble Colored Pencils - 24 Vibrant Colors, Triangular Log Sketch Art Supplies, Suitable for Schools, Offices, And Artists, Office Art Supplies, Vivid Art Supplies, Durable Art Materials, Colored Pencil Set\nBrand: Digabi | Similar products from Digabi\n₦ 21,026', image_url: 'https://i.ibb.co/6J7fYgVQ/IMG-20260728-WA0050.jpg', display_order: 10 },
  { title: '72pcs Professional Drawing Artist Kit', description: '72pcs Professional Drawing Artist Kit Set Art & Bag\n₦ 32,984', image_url: 'https://i.ibb.co/tPN8VkQR/IMG-20260728-WA0051.jpg', display_order: 11 },
  { title: 'Early Education Kiddies Complete Artistic Set', description: 'Early Education Kiddies Complete Artistic set Drawing And Painting Art Kit With Colourful Pencils - 208 Pieces - Pink\n₦ 39,000', image_url: 'https://i.ibb.co/5hfkQh77/IMG-20260728-WA0052.jpg', display_order: 12 },
  { title: 'OVO TOUMI 80 Colors Art Markers', description: 'OVO TOUMI 80 Colors Art Markers Set Double Tip Broad Fine Point Marker Pen\nBrand: OVO TOUMI | Similar products from OVO TOUMI\n₦ 30,800', image_url: 'https://i.ibb.co/NdhV9yh4/IMG-20260728-WA0053.jpg', display_order: 13 },
  { title: '24-Color Oil-Based Colored Pencils', description: '24-Color Oil-Based Colored Pencils Set: Student/Kids Art Drawing Pencils (Thick Tip)\n₦ 8,880', image_url: 'https://i.ibb.co/wZ847gjc/IMG-20260728-WA0054.jpg', display_order: 14 },
  { title: 'OVO TOUMI 150pcs Art Drawing Set', description: 'OVO TOUMI 150pcs Art Drawing Set Painting Sketching Color Pen\nBrand: OVO TOUMI | Similar products from OVO TOUMI\n₦ 18,480 - N18,480', image_url: 'https://i.ibb.co/xrdzjcT/IMG-20260728-WA0055.jpg', display_order: 15 },
  { title: '14Pcs Professional Sketch Pencil Set', description: '14Pcs/Set Professional Sketch Pencil Set HB 2B Graphite Art Drawing Pencil School Stationery\n₦ 26,705', image_url: 'https://i.ibb.co/QvPXysVm/IMG-20260728-WA0056.jpg', display_order: 16 },
  { title: 'Poster Colours 60ml x12', description: 'Poster Colours 60ml x12 N18,450.00', image_url: 'https://i.ibb.co/yFJ0PxDt/IMG-20260728-WA0057.jpg', display_order: 17 },
  { title: 'Pure White Cotton Hankerchief 12 Pieces', description: 'Pure White Cotton Hankerchief I 12 Pieces\n₦ 6,700', image_url: 'https://i.ibb.co/ZRF5wFYZ/IMG-20260728-WA0058.jpg', display_order: 18 },
];

const openBase64InNewTab = async (dataUrl: string, title: string = 'Document') => {
  if (!dataUrl) return;
  
  if (dataUrl.startsWith('data:')) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch(e) {
      console.error(e);
      const w = window.open();
      if (w) {
         w.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
         w.document.title = title;
      }
    }
  } else {
    // If it's a real HTTP/HTTPS URL, just open it
    window.open(dataUrl, '_blank');
  }
};

export default function Dashboard() {
  const { 
    isAuthenticated, students, updateStudentStatus, removeStudent,
    winnersArtwork, addWinnerArtwork, removeWinnerArtwork,
    activities, addActivity, removeActivity,
    videos, addVideo, removeVideo,
    artworkGallery, addArtworkGallery, removeArtworkGallery,
    skillProgrammes, addSkillProgramme, updateSkillProgramme, removeSkillProgramme, setActiveSkillProgramme, replaceSkillProgrammes,
    artMaterials, addArtMaterial, updateArtMaterial, removeArtMaterial, replaceArtMaterials, replaceSkillGallery, replaceSkillHighlights,
    replaceWinnersArtwork, replaceActivities, replaceVideos, replaceArtworkGallery,
  } = useAppStore();
  
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  
  const handleDeleteStudent = async (item: any) => {
    // Only proceed to delete file if the student actually exists in Supabase and can be deleted
    let dbSuccess = false;
    if (item.registrationNumber) {
      const res = await deleteFromSupabaseTable('students', 'registration_number', item.registrationNumber);
      dbSuccess = res.success;
    } else {
      // Legacy student without registration number, just remove locally
      dbSuccess = true;
    }
    
    // Check if other students share the same receipt before deleting it
    const sameReceiptCount = students.filter(s => s.paymentProofUrl === item.paymentProofUrl).length;
    
    // Remove from local store
    removeStudent(item.id);
    
    // Only delete images if the DB row was deleted (or it's legacy) to avoid orphaned rows with 404 images
    if (dbSuccess) {
      if (item.passportUrl && !item.passportUrl.includes('placeholder')) {
        await deleteFileFromSupabase('tpsc-images', item.passportUrl);
      }
      if (item.paymentProofUrl && !item.paymentProofUrl.includes('placeholder') && sameReceiptCount <= 1) {
        await deleteFileFromSupabase('tpsc-images', item.paymentProofUrl);
      }
    }
  };

  const handleDeleteWinnerArtwork = async (item: any) => {
    const res = await deleteFromSupabaseTable('winner_artwork', 'title', item.title);
    removeWinnerArtwork(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };

  const handleDeleteActivity = async (item: any) => {
    const res = await deleteFromSupabaseTable('activities', 'title', item.title);
    removeActivity(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };

  const handleDeleteVideo = async (item: any) => {
    await deleteFromSupabaseTable('video_gallery', 'video_url', item.videoUrl);
    removeVideo(item.id);
  };

  const handleDeleteArtworkGallery = async (item: any) => {
    const res = await deleteFromSupabaseTable('artwork_gallery', 'title', item.title);
    removeArtworkGallery(item.id);
    if (res.success && item.imageUrl) await deleteFileFromSupabase('tpsc-images', item.imageUrl);
  };
  // Winners state
  const [winnerTitle, setWinnerTitle] = useState('');
  const [winnerProjectName, setWinnerProjectName] = useState('');
  const [winnerAge, setWinnerAge] = useState('');
  const [winnerPersonName, setWinnerPersonName] = useState('');
  const [winnerCountry, setWinnerCountry] = useState('');
  const [winnerType, setWinnerType] = useState<'GRAND_PRIZES'|'SPECIAL_AWARDS'|'BEST_FINALISTS'>('GRAND_PRIZES');
  const [winnerFile, setWinnerFile] = useState<File|null>(null);
  const [winnerImageUrls, setWinnerImageUrls] = useState('');
  const [isUploadingWinner, setIsUploadingWinner] = useState(false);
  
  // Activities state
  const [activityTitle, setActivityTitle] = useState('');
  const [activityCountry, setActivityCountry] = useState('');
  const [activityContestNumber, setActivityContestNumber] = useState('');
  const [activityFile, setActivityFile] = useState<File|null>(null);
  const [activityImageUrls, setActivityImageUrls] = useState('');
  const [isUploadingActivity, setIsUploadingActivity] = useState(false);
  
  // Video state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState<'youtube'|'drive'>('youtube');
  
  // Artwork Gallery state
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryProjectName, setGalleryProjectName] = useState('');
  const [galleryAge, setGalleryAge] = useState('');
  const [galleryPersonName, setGalleryPersonName] = useState('');
  const [galleryCountry, setGalleryCountry] = useState('');
  const [galleryFile, setGalleryFile] = useState<File|null>(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Upcoming Events state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState<'competition'|'festival'|'exhibition'>('competition');
  const [eventStatus, setEventStatus] = useState<'upcoming'|'ongoing'|'completed'|'cancelled'>('upcoming');
  const [eventFile, setEventFile] = useState<File|null>(null);
  const [eventImageUrls, setEventImageUrls] = useState('');
  const [eventButtonText, setEventButtonText] = useState('');
  const [eventButtonUrl, setEventButtonUrl] = useState('');
  const [isUploadingEvent, setIsUploadingEvent] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  const [contentError, setContentError] = useState('');

  // ============ SKILL PROGRAMME DYNAMIC FORM ============
  const DEFAULT_NDDC_IMAGES = [
    "https://i.ibb.co/4RPVsf0G/IMG-20260728-WA0000.jpg",
    "https://i.ibb.co/9998Kv0h/IMG-20260728-WA0001.jpg",
    "https://i.ibb.co/jk4NgqBs/IMG-20260728-WA0002.jpg",
    "https://i.ibb.co/WLRfBm5/IMG-20260728-WA0003.jpg",
    "https://i.ibb.co/G44WbqSv/IMG-20260728-WA0005.jpg",
    "https://i.ibb.co/dJjYK00X/IMG-20260728-WA0006.jpg",
    "https://i.ibb.co/0pgfPR6c/IMG-20260728-WA0007.jpg",
    "https://i.ibb.co/QvjK8ZFj/IMG-20260728-WA0008.jpg",
    "https://i.ibb.co/5xWfXfdF/IMG-20260728-WA0009.jpg",
    "https://i.ibb.co/4R64qydq/IMG-20260728-WA0010.jpg",
    "https://i.ibb.co/wF3tq9Tg/IMG-20260728-WA0011.jpg",
    "https://i.ibb.co/hxsKBBn6/IMG-20260728-WA0012.jpg",
    "https://i.ibb.co/R4QW43Mc/IMG-20260728-WA0013.jpg",
    "https://i.ibb.co/PGx16DZW/IMG-20260728-WA0014.jpg",
    "https://i.ibb.co/nsJJqJYW/IMG-20260728-WA0015.jpg",
    "https://i.ibb.co/nsqdVsMs/IMG-20260728-WA0016.jpg",
    "https://i.ibb.co/LzDwPyVP/IMG-20260728-WA0017.jpg",
    "https://i.ibb.co/F4v7qjXk/IMG-20260728-WA0018.jpg",
    "https://i.ibb.co/m5bcW7V0/IMG-20260728-WA0019.jpg",
    "https://i.ibb.co/LXKdXLRr/IMG-20260728-WA0020.jpg"
  ];
  const DEFAULT_NDDC_SKILLS = [
    "Farming", "Poultry", "Fishery", "Crop Production",
    "Graphic Design", "Photography", "Photo Editing", "Videography",
    "Leather Works", "Shoes", "Bags", "Belts", "Sandals",
    "Fashion Design", "Garment Making", "Sewing", "Tailoring",
    "Drawing", "Painting", "Arts and Crafts",
    "Catering Services", "Baking and Confectionery",
    "Chin-Chin Production", "Groundnut Processing and Packaging",
    "Small Chops Production", "Event Decoration", "Interior Styling",
    "Business Development", "Entrepreneurship", "Branding and Marketing",
    "Digital Business Skills", "Financial Literacy", "Record Keeping",
    "And Lots More"
  ];

  const [progEditingId, setProgEditingId] = useState<string|null>(null);
  const [progIsActive, setProgIsActive] = useState(true);
  const [progHeroTitle, setProgHeroTitle] = useState('FREE 6-Month Skills Acquisition Programme');
  const [progHeroSubtitle, setProgHeroSubtitle] = useState('Empower Your Future. Learn a Skill for Free.');
  const [progHeroDescription, setProgHeroDescription] = useState('Gain practical vocational and digital skills through our fully sponsored training programme designed to help you become financially independent. This comprehensive initiative brings together industry experts, modern training facilities, and real-world learning experiences to equip you with the tools you need to succeed in today\'s competitive marketplace.');
  const [progSkillsText, setProgSkillsText] = useState(DEFAULT_NDDC_SKILLS.join('\n'));
  const [progFullContent, setProgFullContent] = useState('');
  const [progSponsorName, setProgSponsorName] = useState('Niger Delta Development Commission (NDDC)');
  const [progSponsorLogoUrl, setProgSponsorLogoUrl] = useState('https://i.ibb.co/rKbYF43P/IMG-20260723-WA0036.jpg');
  const [progSponsorWebsite, setProgSponsorWebsite] = useState('');
  const [progOrganizerName, setProgOrganizerName] = useState('Thinkers and Problem Solvers');
  const [progApplyLink, setProgApplyLink] = useState('https://docs.google.com/forms/d/e/1FAIpQLSdIjaRrWNgnPhgdx1Na-IJf-Sv07tWtnAtnoMUp9ZI7lTmlxg/viewform');
  const [progTutorLink, setProgTutorLink] = useState('https://docs.google.com/forms/d/e/1FAIpQLSdVSXi26Psdh3VORwNDZDyYu9gfDHkQulAjlEaK9cF2zo367Q/viewform?usp=publish-editor');
  const [progImagesText, setProgImagesText] = useState(DEFAULT_NDDC_IMAGES.join('\n'));
  const [progDisplayOrder, setProgDisplayOrder] = useState(1);
  const [progSponsorLogoFile, setProgSponsorLogoFile] = useState<File|null>(null);
  const [progImagesFiles, setProgImagesFiles] = useState<FileList|null>(null);
  const [isUploadingProg, setIsUploadingProg] = useState(false);

  const resetProgrammeForm = () => {
    setProgEditingId(null);
    setProgIsActive(true);
    setProgHeroTitle('FREE 6-Month Skills Acquisition Programme');
    setProgHeroSubtitle('Empower Your Future. Learn a Skill for Free.');
    setProgHeroDescription('');
    setProgSkillsText('');
    setProgFullContent('');
    setProgSponsorName('');
    setProgSponsorLogoUrl('');
    setProgSponsorWebsite('');
    setProgOrganizerName('Thinkers and Problem Solvers');
    setProgApplyLink('');
    setProgTutorLink('');
    setProgImagesText('');
    setProgDisplayOrder(skillProgrammes.length + 1);
    setProgSponsorLogoFile(null);
    setProgImagesFiles(null);
  };

  const handleAddProgramme = async () => {
    setContentError('');
    if (!progHeroTitle.trim() || !progSponsorName.trim()) return setContentError('Programme Title and Sponsor Name are required.');
    setIsUploadingProg(true);
    try {
      // Sponsor logo: uploaded file overrides URL field
      let finalSponsorLogoUrl = progSponsorLogoUrl.trim();
      if (progSponsorLogoFile) {
        const sanitized = progSponsorLogoFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitized}`;
        finalSponsorLogoUrl = await handleFileUpload(progSponsorLogoFile, 'tpsc-images', `skill-programmes/${fileName}`);
      }

      // Programme images: upload picked files FIRST, then merge with any URL lines
      const skills = progSkillsText.split('\n').map(s => s.trim()).filter(Boolean);
      const urlLines = progImagesText.split('\n').map(s => s.trim()).filter(Boolean);
      const uploadedUrls: string[] = [];
      if (progImagesFiles && progImagesFiles.length > 0) {
        for (let i = 0; i < progImagesFiles.length; i++) {
          const f = progImagesFiles[i];
          const sanitized = f.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const fileName = `${Date.now()}_${i}_${sanitized}`;
          const u = await handleFileUpload(f, 'tpsc-images', `skill-programmes/images/${fileName}`);
          if (u) uploadedUrls.push(u);
        }
      }
      const allImages = [...uploadedUrls, ...urlLines]
        .filter(Boolean)
        .map(url => ({ image_url: url, title: '' }));

      const payload: any = {
        is_active: progIsActive,
        hero_title: progHeroTitle,
        hero_subtitle: progHeroSubtitle,
        hero_description: progHeroDescription,
        skills,
        full_content: progFullContent,
        sponsor_name: progSponsorName,
        sponsor_logo_url: finalSponsorLogoUrl,
        sponsor_website: progSponsorWebsite,
        organizer_name: progOrganizerName,
        apply_link: progApplyLink,
        tutor_link: progTutorLink,
        programme_images: allImages,
        display_order: Number(progDisplayOrder) || 1
      };

      if (progEditingId) {
        updateSkillProgramme(progEditingId, payload);
        saveToSupabaseTable('skill_programmes', { id: progEditingId, ...payload });
        if (payload.is_active) {
          // Single-active enforcement on edit: deactivate every other programme.
          const currentProgrammes = useAppStore.getState().skillProgrammes;
          for (const other of currentProgrammes) {
            if (other.id === progEditingId) continue;
            if (other.is_active) {
              updateSkillProgramme(other.id, { is_active: false });
              try { await saveToSupabaseTable('skill_programmes', { id: other.id, is_active: false }); } catch {}
            }
          }
        }
      } else {
        const newId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : (Date.now().toString(36) + Math.random().toString(36).substr(2, 9));
        const created = addSkillProgramme({ id: newId, ...payload });
        saveToSupabaseTable('skill_programmes', { id: created.id, ...payload });
        if (payload.is_active) {
          // Single-active enforcement on create: deactivate every other programme
          // (newly-created one is already active via payload).
          const currentProgrammes = useAppStore.getState().skillProgrammes;
          for (const other of currentProgrammes) {
            if (other.id === created.id) continue;
            if (other.is_active) {
              updateSkillProgramme(other.id, { is_active: false });
              try { await saveToSupabaseTable('skill_programmes', { id: other.id, is_active: false }); } catch {}
            }
          }
        }
      }
      resetProgrammeForm();
    } catch (e: any) {
      setContentError(e.message || 'Programme save/upload failed.');
    } finally {
      setIsUploadingProg(false);
    }
  };

  const handleEditProgramme = (p: any) => {
    setProgEditingId(p.id);
    setProgIsActive(!!p.is_active);
    setProgHeroTitle(p.hero_title || '');
    setProgHeroSubtitle(p.hero_subtitle || '');
    setProgHeroDescription(p.hero_description || '');
    setProgSkillsText(Array.isArray(p.skills) ? p.skills.join('\n') : '');
    setProgFullContent(p.full_content || '');
    setProgSponsorName(p.sponsor_name || '');
    setProgSponsorLogoUrl(p.sponsor_logo_url || '');
    setProgSponsorWebsite(p.sponsor_website || '');
    setProgOrganizerName(p.organizer_name || 'Thinkers and Problem Solvers');
    setProgApplyLink(p.apply_link || '');
    setProgTutorLink(p.tutor_link || '');
    setProgImagesText(Array.isArray(p.programme_images) ? p.programme_images.map((x:any) => x.image_url || '').filter(Boolean).join('\n') : '');
    setProgDisplayOrder(p.display_order || 1);
    setProgSponsorLogoFile(null);
    setProgImagesFiles(null);
  };

  const handleDeleteProgramme = (p: any) => {
    if (!window.confirm(`Are you SURE you want to DELETE the entire programme "${p.hero_title || p.sponsor_name}"?\n\nThis will remove all its content from the website (one-click delete).`)) return;
    removeSkillProgramme(p.id);
    deleteFromSupabaseTable('skill_programmes', 'id', p.id);
    if (progEditingId === p.id) resetProgrammeForm();
  };

  const handleActivateProgramme = async (p: any) => {
    const newState = !p.is_active;

    // SINGLE-ACTIVE ENFORCEMENT (mutual exclusivity):
    // When activating a programme, automatically deactivate every other programme
    // — in BOTH the zustand store AND Supabase — so that exactly one live
    // sponsor programme shows on the Skill Acquisition page at any time.
    // When deactivating (newState=false), simply flip that one off only —
    // this allows Admin to turn off everything and fall back to default NDDC.
    if (newState) {
      // Flip all others off in store
      const currentProgrammes = useAppStore.getState().skillProgrammes;
      for (const other of currentProgrammes) {
        if (other.id === p.id) continue;
        if (other.is_active) {
          updateSkillProgramme(other.id, { is_active: false });
          try { await saveToSupabaseTable('skill_programmes', { id: other.id, is_active: false }); } catch {}
        }
      }
      // Flip target on
      updateSkillProgramme(p.id, { is_active: true });
      try { await saveToSupabaseTable('skill_programmes', { id: p.id, is_active: true }); } catch {}
    } else {
      updateSkillProgramme(p.id, { is_active: false });
      try { await saveToSupabaseTable('skill_programmes', { id: p.id, is_active: false }); } catch {}
    }
  };

  // ============ ART MATERIALS STATE & HANDLERS ============
  const [artTitle, setArtTitle] = useState('');
  const [artDescription, setArtDescription] = useState('');
  const [artImageUrl, setArtImageUrl] = useState('');
  const [artFile, setArtFile] = useState<File|null>(null);
  const [artDisplayOrder, setArtDisplayOrder] = useState<number>(1);
  const [artEditingId, setArtEditingId] = useState<string|null>(null);
  const [isUploadingArt, setIsUploadingArt] = useState(false);

  const resetArtForm = () => {
    setArtTitle(''); setArtDescription(''); setArtImageUrl('');
    setArtFile(null); setArtEditingId(null);
    setArtDisplayOrder(artMaterials.length + 1);
  };

  const handleAddArtMaterial = async () => {
    setContentError('');
    if (!artTitle.trim() || !artDescription.trim()) return setContentError('Title and description are required.');
    if (!artImageUrl.trim() && !artFile) return setContentError('Please provide an image file or image URL.');
    setIsUploadingArt(true);
    try {
      let finalUrl = artImageUrl.trim();
      if (artFile) {
        const sanitizedFileName = artFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        finalUrl = await handleFileUpload(artFile, 'tpsc-images', `art-materials/${fileName}`);
      }
      const payload: any = {
        title: artTitle,
        description: artDescription,
        image_url: finalUrl || 'https://via.placeholder.com/300x300?text=Art+Material',
        display_order: Number(artDisplayOrder) || 1
      };
      if (artEditingId) {
        updateArtMaterial(artEditingId, payload);
        await saveToSupabaseTable('art_materials', { id: artEditingId, ...payload });
      } else {
        addArtMaterial(payload);
        await saveToSupabaseTable('art_materials', payload);
      }
      resetArtForm();
    } catch (e: any) {
      setContentError(e.message || 'Art material upload failed.');
    } finally {
      setIsUploadingArt(false);
    }
  };

  const handleEditArtMaterial = (m: any) => {
    setArtEditingId(m.id);
    setArtTitle(m.title || '');
    setArtDescription(m.description || '');
    setArtImageUrl(m.image_url || '');
    setArtFile(null);
    setArtDisplayOrder(m.display_order || 1);
  };

  const handleDeleteArtMaterial = async (m: any) => {
    if (!window.confirm(`Delete art material "${m.title}"?`)) return;
    removeArtMaterial(m.id);
    await deleteFromSupabaseTable('art_materials', 'id', m.id);
    if (m.image_url && !m.image_url.includes('placeholder')) await deleteFileFromSupabase('tpsc-images', m.image_url);
    if (artEditingId === m.id) resetArtForm();
  };

  const handleAddWinner = async () => {
    setContentError('');
    if (!winnerTitle || !winnerProjectName || !winnerAge || !winnerPersonName || !winnerCountry) return setContentError('Please fill all fields.');
    if (!winnerFile && !winnerImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingWinner(true);
    try {
      if (winnerFile) {
        const sanitizedFileName = winnerFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(winnerFile, 'tpsc-images', `winners/${fileName}`);
        
        const payload = { 
          title: winnerTitle, 
          project_name: winnerProjectName,
          age: winnerAge,
          person_name: winnerPersonName,
          country: winnerCountry,
          type: winnerType, 
          image_url: imageUrl 
        };
        
        const dbRes = await saveToSupabaseTable('winner_artwork', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addWinnerArtwork({
          title: winnerTitle, 
          projectName: winnerProjectName,
          age: winnerAge,
          personName: winnerPersonName,
          country: winnerCountry,
          type: winnerType, 
          imageUrl 
        });
      }

      if (winnerImageUrls.trim()) {
        const urls = winnerImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: winnerTitle, 
            project_name: winnerProjectName,
            age: winnerAge,
            person_name: winnerPersonName,
            country: winnerCountry,
            type: winnerType, 
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('winner_artwork', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addWinnerArtwork({
            title: winnerTitle, 
            projectName: winnerProjectName,
            age: winnerAge,
            personName: winnerPersonName,
            country: winnerCountry,
            type: winnerType, 
            imageUrl: url 
          });
        }
      }
      setWinnerTitle(''); setWinnerProjectName(''); setWinnerAge(''); setWinnerPersonName(''); setWinnerCountry(''); setWinnerFile(null); setWinnerImageUrls('');
    } catch (e: any) {
      setContentError(`Error adding winner: ${e.message}`);
    } finally {
      setIsUploadingWinner(false);
    }
  };

  const handleAddActivity = async () => {
    setContentError('');
    if (!activityTitle || !activityCountry || !activityContestNumber) return setContentError('Please fill all fields.');
    if (!activityFile && !activityImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingActivity(true);
    try {
      if (activityFile) {
        const sanitizedFileName = activityFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(activityFile, 'tpsc-images', `activities/${fileName}`);
        
        const payload = { 
          title: activityTitle, 
          country: activityCountry,
          contest_number: activityContestNumber,
          image_url: imageUrl 
        };
        const dbRes = await saveToSupabaseTable('activities', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addActivity({ 
          title: activityTitle, 
          country: activityCountry,
          contestNumber: activityContestNumber,
          imageUrl 
        });
      }

      if (activityImageUrls.trim()) {
        const urls = activityImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: activityTitle, 
            country: activityCountry,
            contest_number: activityContestNumber,
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('activities', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addActivity({ 
            title: activityTitle, 
            country: activityCountry,
            contestNumber: activityContestNumber,
            imageUrl: url 
          });
        }
      }
      setActivityTitle(''); setActivityCountry(''); setActivityContestNumber(''); setActivityFile(null); setActivityImageUrls('');
    } catch (e: any) {
      setContentError(`Error adding activities: ${e.message}`);
    } finally {
      setIsUploadingActivity(false);
    }
  };

  const handleAddVideo = async () => {
    setContentError('');
    if (!videoTitle || !videoUrl) return setContentError('Please provide a title and URL.');
    
    const dbRes = await saveToSupabaseTable('video_gallery', {
      title: videoTitle,
      video_url: videoUrl,
      platform: videoType
    });
    if (!dbRes.success) return setContentError(dbRes.error);
    
    addVideo({ title: videoTitle, videoUrl, type: videoType });
    setVideoTitle(''); setVideoUrl('');
  };

  const handleAddGallery = async () => {
    setContentError('');
    if (!galleryTitle || !galleryProjectName || !galleryAge || !galleryPersonName || !galleryCountry) return setContentError('Please fill all fields.');
    if (!galleryFile && !galleryImageUrls.trim()) return setContentError('Please provide an image file or at least one image URL.');
    setIsUploadingGallery(true);
    try {
      if (galleryFile) {
        const sanitizedFileName = galleryFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const imageUrl = await handleFileUpload(galleryFile, 'tpsc-images', `gallery/${fileName}`);
        
        const payload = { 
          title: galleryTitle, 
          project_name: galleryProjectName,
          age: galleryAge,
          person_name: galleryPersonName,
          country: galleryCountry,
          image_url: imageUrl 
        };
        const dbRes = await saveToSupabaseTable('artwork_gallery', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
  
        addArtworkGallery({ 
          title: galleryTitle, 
          projectName: galleryProjectName,
          age: galleryAge,
          personName: galleryPersonName,
          country: galleryCountry,
          imageUrl 
        });
      }

      if (galleryImageUrls.trim()) {
        const urls = galleryImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { 
            title: galleryTitle, 
            project_name: galleryProjectName,
            age: galleryAge,
            person_name: galleryPersonName,
            country: galleryCountry,
            image_url: url 
          };
          const dbRes = await saveToSupabaseTable('artwork_gallery', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
    
          addArtworkGallery({ 
            title: galleryTitle, 
            projectName: galleryProjectName,
            age: galleryAge,
            personName: galleryPersonName,
            country: galleryCountry,
            imageUrl: url 
          });
        }
      }
      setGalleryTitle(''); setGalleryProjectName(''); setGalleryAge(''); setGalleryPersonName(''); setGalleryCountry(''); setGalleryFile(null); setGalleryImageUrls('');
    } catch(e: any) {
      setContentError(`Error adding gallery artwork: ${e.message}`);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAddEvent = async () => {
    setContentError('');
    if (!eventTitle || !eventDescription) return setContentError('Please fill in title and description.');
    if (!eventFile && !eventImageUrls.trim()) return setContentError('Please provide a flyer image file or URL.');
    
    setIsUploadingEvent(true);
    try {
      let uploadedUrl = '';

      const commonPayload = {
        title: eventTitle,
        description: eventDescription,
        event_type: eventType,
        status: eventStatus,
        button_text: eventButtonText.trim() || '',
        button_url: eventButtonUrl.trim() || ''
      };
      
      if (eventFile) {
        const sanitizedFileName = eventFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        uploadedUrl = await handleFileUpload(eventFile, 'tpsc-images', `events/${fileName}`);
        
        const payload = { ...commonPayload, flyer_url: uploadedUrl };
        
        const dbRes = await saveToSupabaseTable('upcoming_events', payload);
        if (!dbRes.success) throw new Error(dbRes.error);
        
        setUpcomingEvents([...upcomingEvents, { ...payload }]);
      }

      if (eventImageUrls.trim()) {
        const urls = eventImageUrls.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        for (const url of urls) {
          const payload = { ...commonPayload, flyer_url: url };
          
          const dbRes = await saveToSupabaseTable('upcoming_events', payload);
          if (!dbRes.success) throw new Error(dbRes.error);
          
          setUpcomingEvents(prev => [...prev, { ...payload }]);
        }
      }

      setEventTitle(''); setEventDescription(''); setEventFile(null); setEventImageUrls(''); setEventStatus('upcoming'); setEventButtonText(''); setEventButtonUrl('');
    } catch (e: any) {
      setContentError(`Error adding event: ${e.message}`);
    } finally {
      setIsUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (event: any) => {
    try {
      const res = await deleteFromSupabaseTable('upcoming_events', 'title', event.title);
      if (res.success) {
        setUpcomingEvents(upcomingEvents.filter(e => e.title !== event.title));
      }
    } catch (e: any) {
      setContentError(`Error deleting event: ${e.message}`);
    }
  };

  // Load upcoming events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase.from('upcoming_events').select('*');
        if (error) throw error;
        setUpcomingEvents(data || []);
      } catch (e) {
        console.error('Failed to load events:', e);
      }
    };
    loadEvents();
  }, []);

  const _hasHydratedStore = useAppStore((s: any) => s._hasHydrated);

  // ---------------------------------------------------------------------------
  //  HYDRATE ALL LIVE_FIELDS FROM SUPABASE ON MOUNT (authoritative refresh).
  //  ALL of the following are LIVE_FIELDs (excluded from persist / IndexedDB
  //  by the partialize config in store.ts) — meaning after a Ctrl+R page
  //  refresh they would re-initialize as empty arrays unless we reload them
  //  from Supabase here.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!_hasHydratedStore) return;
    const loadAll = async () => {
      // 1. Winners artwork
      try {
        const rows = await fetchWinnersArtwork();
        if (Array.isArray(rows) && rows.length > 0) replaceWinnersArtwork(rows as any);
      } catch (e) { console.error('Load winnersArtwork failed:', e); }

      // 2. Activities
      try {
        const rows = await fetchActivities();
        if (Array.isArray(rows) && rows.length > 0) replaceActivities(rows as any);
      } catch (e) { console.error('Load activities failed:', e); }

      // 3. Video gallery
      try {
        const rows = await fetchVideos();
        if (Array.isArray(rows) && rows.length > 0) replaceVideos(rows as any);
      } catch (e) { console.error('Load videos failed:', e); }

      // 4. Artwork gallery
      try {
        const rows = await fetchArtworkGallery();
        if (Array.isArray(rows) && rows.length > 0) replaceArtworkGallery(rows as any);
      } catch (e) { console.error('Load artworkGallery failed:', e); }

      // 5. Skill programmes (with JSONB parsing)
      try {
        const { data, error } = await supabase.from('skill_programmes').select('*');
        if (error) throw error;
        if (Array.isArray(data)) {
          const normalized: any[] = data.map(row => ({
            ...row,
            skills: typeof row.skills === 'string' ? JSON.parse(row.skills || '[]') : (row.skills ?? []),
            programme_images: typeof row.programme_images === 'string' ? JSON.parse(row.programme_images || '[]') : (row.programme_images ?? [])
          }));
          replaceSkillProgrammes(normalized);
        }
      } catch (e) { console.error('Load skillProgrammes failed:', e); }

      // 6. Art materials (has its own DEFAULT_ART_MATERIALS fallback — only
      //    hydrate if there are actual rows in Supabase, otherwise we keep
      //    DEFAULT_ART_MATERIALS added by the legacy loader below.)
      try {
        const { data, error } = await supabase.from('art_materials').select('*').order('display_order', { ascending: true, nullsFirst: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          const normalized: any[] = data.map(row => ({
            id: row.id ?? Math.random().toString(36).slice(2, 11),
            title: row.title ?? '',
            description: row.description ?? '',
            image_url: row.image_url ?? '',
            display_order: Number(row.display_order) || 0,
          }));
          replaceArtMaterials(normalized);
        }
      } catch (e) { console.error('Load artMaterials failed:', e); }

      // 7. Skill gallery (INACTIVE TABLE — Dashboard UI says REMOVED.
      //    Hydrate anyway if rows exist.)
      try {
        const { data, error } = await supabase.from('skill_gallery').select('*').order('display_order', { ascending: true, nullsFirst: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          replaceSkillGallery(data.map((row: any) => ({
            id: row.id, image_url: row.image_url ?? '',
            title: row.title ?? '', display_order: Number(row.display_order) || 0
          })) as any);
        }
      } catch { /* ignore — table may not exist yet */ }

      // 8. Skill highlights (INACTIVE TABLE — Dashboard UI says REMOVED.)
      try {
        const { data, error } = await supabase.from('skill_highlights').select('*').order('display_order', { ascending: true, nullsFirst: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          replaceSkillHighlights(data.map((row: any) => ({
            id: row.id, text: row.text ?? '', display_order: Number(row.display_order) || 0
          })) as any);
        }
      } catch { /* ignore — table may not exist yet */ }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydratedStore]);

  useEffect(() => {
    if (!_hasHydratedStore) return;
    const existingTitles = new Set(
      artMaterials.map((m: any) => m.title?.trim().toLowerCase())
    );
    const missingDefaults = DEFAULT_ART_MATERIALS.filter(
      (d) => !existingTitles.has(d.title.trim().toLowerCase())
    );
    if (missingDefaults.length > 0) {
      missingDefaults.forEach((m) => addArtMaterial(m));
    }
  }, [_hasHydratedStore, artMaterials, addArtMaterial]);

  const effectiveArtMaterials = artMaterials.length > 0
    ? [...artMaterials].sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
    : [...DEFAULT_ART_MATERIALS];

  const totalRegistered = students.length;
  const uniqueSchools = new Set(students.map(s => s.schoolName)).size;
  const verifiedCount = students.filter(s => s.status === 'Verified').length;
  const pendingCount = students.filter(s => s.status === 'Pending').length;

  const schoolsGroups = React.useMemo(() => {
    const map = new Map<string, typeof students>();
    students.forEach(s => {
      if (!map.has(s.schoolName)) {
        map.set(s.schoolName, []);
      }
      map.get(s.schoolName)!.push(s);
    });
    return Array.from(map.entries()).map(([schoolName, studentsList]) => ({
      schoolName,
      country: studentsList[0].country,
      state: studentsList[0].state,
      paymentProofUrl: studentsList[0].paymentProofUrl,
      students: studentsList,
      verifiedCount: studentsList.filter(s => s.status === 'Verified').length
    }));
  }, [students]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('adminPassword') || 'Thinkers123';
    if (stored !== oldPassword) {
      setPwdMsg('Old password incorrect!');
      return;
    }
    
    // Save to local storage 
    localStorage.setItem('adminPassword', newPassword);

    // Save to Supabase as requested
    const res = await updateAdminPassword(newPassword);
    if (!res.success && res.error !== 'missing credentials') {
       // if we have credentials but it failed, notify
       setPwdMsg('Saved locally, but Supabase update failed: ' + res.error);
    } else {
       setPwdMsg('Password updated successfully!');
    }

    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage registrations and website settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="transition-all hover:scale-105 active:scale-95 shadow-sm" onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="skill-acquisition">Skill Acquisition</TabsTrigger>
          <TabsTrigger value="art-materials">Art Materials</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistered}</div>
                <p className="text-xs text-muted-foreground">students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools Participating</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueSchools}</div>
                <p className="text-xs text-muted-foreground">institutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Verifications</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedCount}</div>
                <p className="text-xs text-muted-foreground">approved students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-amber-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Action required</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest students who registered via the website.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reg Number</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Country/State</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs">{item.registrationNumber}</TableCell>
                          <TableCell className="font-medium">{item.fullName}</TableCell>
                          <TableCell>{item.schoolName}</TableCell>
                          <TableCell>{item.registrationCategory}</TableCell>
                          <TableCell>{item.level}</TableCell>
                          <TableCell>{item.country}{item.state && ` / ${item.state}`}</TableCell>
                          <TableCell className="text-right">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${item.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No registrations yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          {schoolsGroups.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No schools or students registered yet.
              </CardContent>
            </Card>
          ) : schoolsGroups.map((group) => (
            <Card key={group.schoolName} className="overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-4 pt-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-serif">
                       <GraduationCap className="h-5 w-5 text-primary" />
                       {group.schoolName}
                    </CardTitle>
                    <CardDescription className="mt-1.5 flex items-center gap-2">
                       <span className="font-medium text-foreground/80">{group.state}, {group.country}</span>
                       <span>•</span>
                       <span>{group.students.length} Student{group.students.length > 1 ? 's' : ''}</span>
                       <span>•</span>
                       <span className={group.verifiedCount === group.students.length ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                         {group.verifiedCount} Verified
                       </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                     {group.paymentProofUrl && (
                       <a href={group.paymentProofUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
                         <Download className="w-4 h-4 mr-2" /> View Payment Receipt
                       </a>
                     )}
                     {group.verifiedCount < group.students.length && (
                       <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105 active:scale-95 shadow-sm" onClick={() => {
                          const conf = window.confirm(`Are you sure you want to verify all ${group.students.length - group.verifiedCount} pending student(s) for ${group.schoolName}?`);
                          if(conf) {
                             group.students.forEach(s => {
                               if (s.status === 'Pending') updateStudentStatus(s.id, 'Verified')
                             })
                          }
                       }}>
                         <Check className="w-4 h-4 mr-1.5" /> Verify All Pending
                       </Button>
                     )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                   <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="pl-6">Reg Number</TableHead>
                          <TableHead>Student Details</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Level & Class</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.students.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs pl-6">{item.registrationNumber}</TableCell>
                            <TableCell>
                               <div className="font-medium flex items-center gap-2">
                                 {item.fullName}
                                 {item.status === 'Verified' && <Check className="w-3.5 h-3.5 text-green-600" />}
                               </div>
                               <div className="text-xs text-muted-foreground capitalize mt-0.5">{item.gender} • {item.dob}</div>
                               <div className="flex gap-2">
                                 {item.passportUrl && (
                                    <a href={item.passportUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-1 text-[10px] inline-flex items-center">
                                      View Passport
                                    </a>
                                 )}
                                 {item.paymentProofUrl && (
                                    <a href={item.paymentProofUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-1 text-[10px] inline-flex items-center">
                                      View Receipt
                                    </a>
                                 )}
                               </div>
                            </TableCell>
                            <TableCell>
                               <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-muted/30">
                                 {item.registrationCategory}
                               </span>
                            </TableCell>
                            <TableCell>
                               <div className="text-sm font-medium">{item.level}</div>
                               <div className="text-xs text-muted-foreground">{item.studentClass}</div>
                            </TableCell>
                            <TableCell>
                               <div className="text-sm">{item.country}</div>
                               <div className="text-xs text-muted-foreground">{item.state}{item.lga && ` / ${item.lga}`}</div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                               <div className="flex justify-end items-center gap-2">
                                 {item.status === 'Pending' ? (
                                   <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 h-8 transition-all shadow-sm hover:scale-105 active:scale-95" onClick={() => updateStudentStatus(item.id, 'Verified')}>
                                      Verify
                                   </Button>
                                 ) : (
                                   <span className="inline-flex h-7 items-center rounded-md px-2.5 text-[10px] font-medium bg-green-100/80 text-green-700 uppercase tracking-widest">Verified</span>
                                 )}
                                 <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive transition-all hover:scale-110 active:scale-90" onClick={() => handleDeleteStudent(item)}>
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {contentError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
               {contentError}
               <Button variant="ghost" size="sm" onClick={() => setContentError('')} className="h-6 w-6 p-0 hover:bg-destructive/20"><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Winner's Artwork</CardTitle>
                <CardDescription>Upload images for the Winner's Artwork section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., 1st Place Winner" value={winnerTitle} onChange={e => setWinnerTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Project Name</Label>
                       <Input placeholder="E.g., Peace Dove" value={winnerProjectName} onChange={e => setWinnerProjectName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Age</Label>
                       <Input type="number" placeholder="E.g., 12" value={winnerAge} onChange={e => setWinnerAge(e.target.value)} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Name of Person</Label>
                       <Input placeholder="E.g., John Doe" value={winnerPersonName} onChange={e => setWinnerPersonName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., UK" value={winnerCountry} onChange={e => setWinnerCountry(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Category</Label>
                     <Select value={winnerType} onValueChange={(val: any) => setWinnerType(val)}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select a category" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="GRAND_PRIZES">Grand Prizes</SelectItem>
                         <SelectItem value="SPECIAL_AWARDS">Special Awards</SelectItem>
                         <SelectItem value="BEST_FINALISTS">Best Finalists</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label>Artwork Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {winnerFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{winnerFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setWinnerFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setWinnerFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={winnerImageUrls} onChange={e => setWinnerImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddWinner} className="w-full" disabled={isUploadingWinner}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingWinner ? 'Uploading...' : "Add Winner's Artwork"}
                   </Button>
                </div>
                
                {winnersArtwork.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2">
                       {winnersArtwork.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground">{item.type.replace('_',' ')}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteWinnerArtwork(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Artwork Gallery</CardTitle>
                <CardDescription>Upload images for the main Artwork Gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., Beautiful landscape by Sarah" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Project Name</Label>
                       <Input placeholder="E.g., Summer Vibe" value={galleryProjectName} onChange={e => setGalleryProjectName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Age</Label>
                       <Input type="number" placeholder="E.g., 15" value={galleryAge} onChange={e => setGalleryAge(e.target.value)} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Name of Person</Label>
                       <Input placeholder="E.g., Sarah" value={galleryPersonName} onChange={e => setGalleryPersonName(e.target.value)} />
                     </div>
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., Canada" value={galleryCountry} onChange={e => setGalleryCountry(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Artwork Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {galleryFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{galleryFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setGalleryFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setGalleryFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={galleryImageUrls} onChange={e => setGalleryImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddGallery} className="w-full" disabled={isUploadingGallery}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingGallery ? 'Uploading...' : 'Add to Gallery'}
                   </Button>
                </div>
                
                {artworkGallery.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {artworkGallery.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteArtworkGallery(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Activities</CardTitle>
                <CardDescription>Upload photos of activities happening across different countries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Title / Caption</Label>
                     <Input placeholder="E.g., Exhibition event" value={activityTitle} onChange={e => setActivityTitle(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Country</Label>
                       <Input placeholder="E.g., France" value={activityCountry} onChange={e => setActivityCountry(e.target.value)} />
                     </div>
                     <div>
                       <Label>Contest Number</Label>
                       <Input placeholder="E.g., 5" value={activityContestNumber} onChange={e => setActivityContestNumber(e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <Label>Activity Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {activityFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{activityFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setActivityFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Pick Image
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setActivityFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                       <div>
                         <Label className="text-xs text-muted-foreground mb-1 block">Or paste Image URLs</Label>
                         <textarea 
                           className="w-full min-h-[100px] flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                           placeholder="https://... (Separate multiple URLs with newlines or commas)" value={activityImageUrls} onChange={e => setActivityImageUrls(e.target.value)} 
                         />
                       </div>
                     </div>
                   </div>
                   <Button onClick={handleAddActivity} className="w-full" disabled={isUploadingActivity}>
                     <Plus className="w-4 h-4 mr-2"/> {isUploadingActivity ? 'Uploading...' : 'Add Activity'}
                   </Button>
                </div>
                
                {activities.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {activities.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded" />
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteActivity(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5" /> Video Gallery</CardTitle>
                <CardDescription>Add video links for the Video Gallery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Video Title</Label>
                     <Input placeholder="E.g., 2025 Finals Highlight" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} />
                   </div>
                   <div>
                     <Label>Platform</Label>
                     <Select value={videoType} onValueChange={(val: any) => setVideoType(val)}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="youtube">YouTube</SelectItem>
                         <SelectItem value="drive">Google Drive</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label>Video URL</Label>
                     <Input placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                   </div>
                   
                   <Button onClick={handleAddVideo} className="w-full"><Plus className="w-4 h-4 mr-2"/> Add Video</Button>
                </div>
                
                {videos.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Entries</h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                       {videos.map(item => (
                         <div key={item.id} className="flex items-center gap-3 border p-2 rounded bg-muted/20">
                           <div className="flex-1 overflow-hidden">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                             <p className="text-[10px] text-muted-foreground truncate">{item.videoUrl}</p>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleDeleteVideo(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Upcoming Events</CardTitle>
                <CardDescription>Add event flyers and manage upcoming competitions, festivals, and exhibitions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                   <div>
                     <Label>Event Title</Label>
                     <Input placeholder="E.g., International Contest 2026" value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
                   </div>
                   <div>
                     <Label>Description</Label>
                     <textarea 
                       placeholder="Brief description of the event..." 
                       value={eventDescription} 
                       onChange={e => setEventDescription(e.target.value)}
                       className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                       rows={3}
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <Label>Event Type</Label>
                       <Select value={eventType} onValueChange={(val: any) => setEventType(val)}>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="competition">Competition</SelectItem>
                           <SelectItem value="festival">Festival</SelectItem>
                           <SelectItem value="exhibition">Exhibition</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div>
                       <Label>Status</Label>
                       <Select value={eventStatus} onValueChange={(val: any) => setEventStatus(val)}>
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="upcoming">Upcoming</SelectItem>
                           <SelectItem value="ongoing">Ongoing</SelectItem>
                           <SelectItem value="completed">Completed</SelectItem>
                           <SelectItem value="cancelled">Cancelled</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                   <div>
                     <Label>Event Flyer Image (Max 5MB)</Label>
                     <div className="mt-1 space-y-3">
                       {eventFile ? (
                          <div className="flex items-center gap-2 text-sm border p-2 rounded">
                            <span className="truncate flex-1">{eventFile.name}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setEventFile(null)}><Trash2 className="w-4 h-4"/></Button>
                          </div>
                       ) : (
                          <Label className="flex items-center justify-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                            <UploadCloud className="w-4 h-4" /> Upload Flyer
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              if(e.target.files && e.target.files[0]) setEventFile(e.target.files[0]);
                            }} />
                          </Label>
                       )}
                     </div>
                   </div>
                   <div>
                     <Label>Or Paste Image URLs (one per line)</Label>
                     <textarea 
                       placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" 
                       value={eventImageUrls} 
                       onChange={e => setEventImageUrls(e.target.value)}
                       className="w-full px-3 py-2 border rounded-md text-sm bg-background font-mono"
                       rows={3}
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <div>
                       <Label>Button Text <span className="text-muted-foreground text-[11px]">(Optional)</span></Label>
                       <Input
                         placeholder="Leave empty → default: REGISTER NOW"
                         value={eventButtonText}
                         onChange={e => setEventButtonText(e.target.value)}
                       />
                     </div>
                     <div>
                       <Label>Button Link / URL <span className="text-muted-foreground text-[11px]">(Optional)</span></Label>
                       <Input
                         placeholder="e.g. forms.google.com/xxx or example.com"
                         value={eventButtonUrl}
                         onChange={e => setEventButtonUrl(e.target.value)}
                       />
                     </div>
                   </div>
                   <p className="text-[11px] text-muted-foreground -mt-1">
                     If you leave both empty, the flyer modal will show the standard "Register Now" button pointing to your website&apos;s registration page. Fill in both for flyers that need an external link (forms, event pages, sponsor links, etc.).
                   </p>
                   
                   <Button onClick={handleAddEvent} disabled={isUploadingEvent} className="w-full"><Plus className="w-4 h-4 mr-2"/> {isUploadingEvent ? 'Adding...' : 'Add Event'}</Button>
                </div>
                
                {upcomingEvents.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Saved Events ({upcomingEvents.length})</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                       {upcomingEvents.map((item, idx) => (
                         <div key={idx} className="flex items-start gap-3 border p-3 rounded bg-muted/20">
                           {item.flyer_url && (
                             <img src={item.flyer_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                           )}
                           <div className="flex-1 overflow-hidden min-w-0">
                             <p className="text-sm font-medium truncate">{item.title}</p>
                             <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                             <div className="flex gap-2 mt-1">
                               <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">{item.event_type}</span>
                               <span className="text-xs bg-blue-600/10 px-2 py-0.5 rounded text-blue-600">{item.status}</span>
                             </div>
                           </div>
                           <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive shrink-0" onClick={() => handleDeleteEvent(item)}><Trash2 className="w-4 h-4" /></Button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        <TabsContent value="skill-acquisition" className="space-y-4">
          {contentError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
               {contentError}
               <Button variant="ghost" size="sm" onClick={() => setContentError('')} className="h-6 w-6 p-0 hover:bg-destructive/20"><Trash2 className="w-4 h-4" /></Button>
            </div>
          )}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Skill Acquisition Programme Management</h3>
              <p className="text-muted-foreground">Create, activate, and DELETE entire skill acquisition programmes. Only the ACTIVE programme displays on the website. Remove NDDC or any future sponsor with ONE CLICK.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.open('/skill-acquisition', '_blank')}>
                View Live Page <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* ============ SECTION 1: SPONSORS, PARTNERS, COURSES, GALLERY, HIGHLIGHTS ============ */}
          {/* (REMOVED — Sponsors/Partners/Courses are per-Programme fields now) */}

          {/* ACTIVE PROGRAMMES BANNER */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" /> Currently Live on Website <Badge className="bg-primary ml-1">{skillProgrammes.filter(p => p.is_active).length}</Badge>
              </CardTitle>
              <CardDescription>All programmes with ACTIVE checked below will appear in the Programme Switcher on the public /skill-acquisition page. Visitors can switch between them instantly.</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const actives = skillProgrammes.filter(p => p.is_active).sort((a,b) => (a.display_order||0) - (b.display_order||0));
                if (actives.length > 0) {
                  return (
                    <div className="grid md:grid-cols-2 gap-3">
                      {actives.map((active: any) => (
                        <div key={active.id} className="flex flex-col sm:flex-row sm:items-center gap-3 border rounded-lg p-3 bg-background/70 hover:bg-primary/5 transition-colors">
                          <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg bg-muted overflow-hidden border flex-shrink-0">
                            {active.sponsor_logo_url
                              ? <img src={active.sponsor_logo_url} alt="Sponsor" className="w-full h-full object-contain p-2" />
                              : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Logo</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">LIVE</div>
                            <div className="font-bold text-sm md:text-base truncate">{active.hero_title}</div>
                            <div className="text-muted-foreground text-xs truncate">{active.sponsor_name} {active.organizer_name ? `• ${active.organizer_name}` : ''}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{active.skills?.length || 0} skills • {active.programme_images?.length || 0} images</div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center">
                            <Button variant="outline" size="sm" onClick={() => handleEditProgramme(active)}>Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteProgramme(active)}><Trash2 className="w-3.5 h-3.5 mr-1"/>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div className="text-center py-6 text-muted-foreground">
                    <Database className="w-10 h-10 mx-auto mb-2 opacity-40"/>
                    <div className="font-semibold mb-1">No Programme Active</div>
                    <div className="text-sm">Tick the ACTIVE checkbox on any saved programme(s) below (multi-select allowed). The default NDDC template is rendered if none are marked active.</div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* ADD/EDIT FORM */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {progEditingId ? 'Edit Programme' : 'Create New Programme'}
              </CardTitle>
              <CardDescription>
                For future sponsors — fill Programme Hero Title, Sub Caption, Skills to Learn, Description, Sponsor Logo, Image URLs, and Registration/Tutor Links. Tick ACTIVE to show in the public website Programme Switcher (multi-select allowed).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center gap-3 bg-muted/30 p-3 rounded-lg border">
                  <Checkbox id="prog_active_check" checked={progIsActive} onCheckedChange={(v:any) => setProgIsActive(!!v)} />
                  <div>
                    <Label htmlFor="prog_active_check" className="cursor-pointer font-semibold">ACTIVE — include in the public website Programme Switcher</Label>
                    <div className="text-xs text-muted-foreground">MULTIPLE programmes can be active at once. Visitors can switch between sponsors on /skill-acquisition.</div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Programme Hero Title *</Label>
                  <Input value={progHeroTitle} onChange={e => setProgHeroTitle(e.target.value)} placeholder="e.g. FREE 6-Month Skills Acquisition Programme" />
                </div>
                <div>
                  <Label>Programme Hero Sub Caption</Label>
                  <Input value={progHeroSubtitle} onChange={e => setProgHeroSubtitle(e.target.value)} placeholder="e.g. Empower Your Future. Learn a Skill for Free." />
                </div>
              </div>
              <div>
                <Label>Hero / Programme Description</Label>
                <textarea rows={4} className="w-full px-3 py-2 border rounded-md text-sm bg-background font-sans" value={progHeroDescription} onChange={e => setProgHeroDescription(e.target.value)} placeholder="Full description displayed under hero..." />
              </div>
              <div>
                <Label>Skills Available to Learn <span className="text-xs text-muted-foreground">(one skill per line)</span></Label>
                <textarea rows={6} className="w-full px-3 py-2 border rounded-md text-sm bg-background font-sans" value={progSkillsText} onChange={e => setProgSkillsText(e.target.value)} placeholder={'Farming\nPoultry\nFishery\nGraphic Design\nPhotography\nFashion Design\nCatering\n...'} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Organizer</Label>
                  <Input value={progOrganizerName} onChange={e => setProgOrganizerName(e.target.value)} placeholder="Thinkers and Problem Solvers" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={String(progDisplayOrder)} onChange={e => setProgDisplayOrder(Number(e.target.value))} />
                </div>
              </div>

              <Separator />
              <div className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Sponsor / Branding</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Sponsor Name *</Label><Input value={progSponsorName} onChange={e => setProgSponsorName(e.target.value)} placeholder="e.g. Niger Delta Development Commission (NDDC)" /></div>
                <div><Label>Sponsor Website</Label><Input value={progSponsorWebsite} onChange={e => setProgSponsorWebsite(e.target.value)} placeholder="https://..." /></div>
              </div>
              <div className="space-y-3">
                <Label>Sponsor Logo (Upload from gallery — OR — Paste URL)</Label>
                <div className="grid md:grid-cols-[1fr_auto] gap-3 items-start">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Option A: Upload image from your device</Label>
                      {progSponsorLogoFile ? (
                        <div className="flex items-center gap-2 text-sm border p-2 rounded bg-muted/30">
                          <span className="truncate flex-1 font-medium">{progSponsorLogoFile.name}</span>
                          <span className="text-[10px] text-muted-foreground mr-2">({Math.round(progSponsorLogoFile.size/1024)} KB)</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setProgSponsorLogoFile(null)}><Trash2 className="w-3.5 h-3.5"/></Button>
                        </div>
                      ) : (
                        <Label className="flex items-center justify-center gap-2 border border-dashed bg-background hover:bg-accent/40 hover:text-accent-foreground h-11 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                          <UploadCloud className="w-4 h-4" /> Pick Logo from Gallery / Device
                          <input type="file" accept="image/*" className="hidden" onChange={e => {
                            if(e.target.files && e.target.files[0]) setProgSponsorLogoFile(e.target.files[0]);
                          }} />
                        </Label>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Option B: Or paste a logo URL</Label>
                      <Input value={progSponsorLogoUrl} onChange={e => setProgSponsorLogoUrl(e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="md:w-44 flex flex-col items-center gap-1">
                    <Label className="text-xs text-muted-foreground self-start">Preview</Label>
                    <div className="w-full h-20 md:h-24 border rounded-md bg-muted overflow-hidden flex items-center justify-center p-2">
                      {(progSponsorLogoUrl || progSponsorLogoFile) ? (
                        <img
                          src={progSponsorLogoFile ? URL.createObjectURL(progSponsorLogoFile) : progSponsorLogoUrl}
                          className="h-full w-full object-contain"
                          alt="logo preview"
                          onError={(e:any) => { e.currentTarget.style.display='none'; }}
                        />
                      ) : <span className="text-[10px] text-muted-foreground text-center">Logo Preview</span>}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              <div className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Registration Links</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Apply / Registration Link</Label>
                  <Input value={progApplyLink} onChange={e => setProgApplyLink(e.target.value)} placeholder="https://docs.google.com/forms/..." />
                </div>
                <div>
                  <Label>Become a Tutor Link</Label>
                  <Input value={progTutorLink} onChange={e => setProgTutorLink(e.target.value)} placeholder="https://docs.google.com/forms/..." />
                </div>
              </div>

              <Separator />
              <div className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Programme Images</div>
              <div className="space-y-3">
                <Label>Upload multiple images from your gallery — AND / OR — paste image URLs (one per line)</Label>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Option A: Multi-select images from device</Label>
                  {progImagesFiles && progImagesFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2 border p-3 rounded bg-muted/30 items-center">
                      {Array.from(progImagesFiles).slice(0, 12).map((f, i) => (
                        <div key={i} className="relative w-14 h-14 rounded overflow-hidden border bg-background">
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          {i === 11 && progImagesFiles.length > 12 && (
                            <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs font-bold">+{progImagesFiles.length - 12}</div>
                          )}
                        </div>
                      ))}
                      <div className="flex flex-col items-start justify-center text-xs ml-2">
                        <div className="font-medium">{progImagesFiles.length} file{progImagesFiles.length !== 1 ? 's' : ''} picked</div>
                        <div className="text-muted-foreground">{(Array.from(progImagesFiles).reduce((a,f) => a + f.size, 0)/1024).toFixed(0)} KB total</div>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto text-destructive h-8" onClick={() => setProgImagesFiles(null)}><Trash2 className="w-4 h-4 mr-1"/> Clear</Button>
                    </div>
                  ) : (
                    <Label className="flex items-center justify-center gap-2 border border-dashed bg-background hover:bg-accent/40 hover:text-accent-foreground h-14 px-4 rounded-md text-sm font-medium cursor-pointer shadow-sm transition-colors">
                      <ImageIcon className="w-4 h-4" /> Pick Multiple Images from Gallery / Device
                      <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                        if(e.target.files && e.target.files.length > 0) setProgImagesFiles(e.target.files);
                      }} />
                    </Label>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Option B: Or paste image URLs — one per line</Label>
                  <textarea rows={7} className="w-full px-3 py-2 border rounded-md text-sm bg-background font-mono" value={progImagesText} onChange={e => setProgImagesText(e.target.value)} placeholder={'https://i.ibb.co/...\nhttps://i.ibb.co/...\nhttps://i.ibb.co/...'} />
                  <div className="text-xs text-muted-foreground mt-1">Tip: For the NDDC programme, 20 pre-filled URLs are already loaded below. Simply upload more photos to append them, then Save.</div>
                </div>
              </div>

              <Separator />
              <div className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Additional / Future Details</div>
              <div>
                <Label>Full Custom Content (Optional — for any other specific required details)</Label>
                <textarea rows={6} className="w-full px-3 py-2 border rounded-md text-sm bg-background font-sans" value={progFullContent} onChange={e => setProgFullContent(e.target.value)} placeholder={'Any specific details, programme highlights, eligibility requirements, etc. — will be rendered as an additional section.'} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={handleAddProgramme} className="shadow" disabled={isUploadingProg}>
                  <Plus className="w-4 h-4 mr-2"/>
                  {isUploadingProg ? 'Saving & Uploading…' : (progEditingId ? 'Update Programme' : 'Add & Save Programme')}
                </Button>
                {progEditingId && <Button variant="outline" onClick={resetProgrammeForm}>Cancel Edit</Button>}
              </div>
            </CardContent>
          </Card>

          {/* PROGRAMMES LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Saved Programmes ({skillProgrammes.length}) <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary ml-1">{skillProgrammes.filter(p=>p.is_active).length} LIVE</Badge></CardTitle>
              <CardDescription>Multi-ACTIVE allowed. Click "Toggle Live" to show/hide a sponsor programme from the public Programme Switcher. Any programme can be DELETED in one click when its term ends.</CardDescription>
            </CardHeader>
            <CardContent>
              {skillProgrammes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-10 h-10 mx-auto mb-2 opacity-30"/>
                  <div className="text-sm">No saved programmes yet. The default NDDC programme is used on the site. Click "Add &amp; Save Programme" above to save/create the current one and enable deletion in future.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...skillProgrammes].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map(p => (
                    <div key={p.id} className={`flex flex-col md:flex-row md:items-center gap-3 border p-4 rounded-lg ${p.is_active ? 'border-primary bg-primary/5' : 'bg-muted/20'}`}>
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden border flex-shrink-0">
                        {p.sponsor_logo_url
                          ? <img src={p.sponsor_logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                          : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Logo</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.is_active && <Badge variant="default" className="bg-primary">LIVE ON WEBSITE</Badge>}
                          {!p.is_active && <Badge variant="outline" className="bg-muted/70 text-muted-foreground">Hidden</Badge>}
                          <span className="font-bold truncate">{p.hero_title || 'Untitled Programme'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">Sponsor: {p.sponsor_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.skills?.length || 0} skills • {p.programme_images?.length || 0} images • created {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant={p.is_active ? "secondary" : "default"} size="sm" onClick={() => handleActivateProgramme(p)}><Sparkles className="w-3.5 h-3.5 mr-1"/>{p.is_active ? 'Hide from Site' : 'Show on Site'}</Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditProgramme(p)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm"><Trash2 className="w-3.5 h-3.5 mr-1"/>Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>One-Click Programme Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you SURE you want to permanently delete the entire programme <strong>{p.hero_title || p.sponsor_name}</strong>?
                                <br /><br />
                                This removes it from the public Programme Switcher instantly (Hero, Skills, Sponsor, Images, Registration Links all gone).
                                <br /><br />
                                If the website reloads and nothing else is active, the default NDDC template is used as fallback.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProgramme(p)} className="bg-destructive hover:bg-destructive/90">Yes, Delete Permanently</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="art-materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> {artEditingId ? 'Edit Art Material' : 'Add New Art Material'}</CardTitle>
              <CardDescription>Upload an image (or provide a URL) with title + description for the ART MATERIALS section on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={artTitle} onChange={e => setArtTitle(e.target.value)} placeholder="e.g. Artist Box, 150 Art Set" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" value={String(artDisplayOrder)} onChange={e => setArtDisplayOrder(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <Label>Description *</Label>
                <textarea rows={3} className="w-full px-3 py-2 border rounded-md text-sm bg-background font-sans" value={artDescription} onChange={e => setArtDescription(e.target.value)} placeholder="e.g. ARTIST BOX, 150 ART SET - N54,000" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Image URL</Label>
                  <Input value={artImageUrl} onChange={e => setArtImageUrl(e.target.value)} placeholder="https://i.ibb.co/...jpg" />
                </div>
                <div>
                  <Label>Or upload image file</Label>
                  <div className="flex items-center gap-3">
                    <Input type="file" accept="image/*" onChange={e => setArtFile(e.target.files ? e.target.files[0] : null)} />
                    <Button variant="outline" type="button" size="sm" onClick={() => setArtFile(null)} disabled={!artFile}>Clear</Button>
                  </div>
                  {artFile && <div className="text-xs text-muted-foreground mt-1">File: {artFile.name} ({(artFile.size/1024).toFixed(1)} KB)</div>}
                </div>
              </div>
              {artImageUrl && !artFile && (
                <div className="rounded-lg border p-3 bg-muted/20 flex gap-3 items-center">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img src={artImageUrl} onError={(e:any) => { e.currentTarget.style.display='none'; }} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">Preview: {artImageUrl}</div>
                </div>
              )}
              {artEditingId && (
                <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded border">
                  Currently editing: <span className="font-semibold text-foreground">{artTitle || '(unsaved changes)'}</span>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                <Button disabled={isUploadingArt} onClick={handleAddArtMaterial}>
                  {isUploadingArt ? 'Saving...' : (artEditingId ? 'Update Art Material' : 'Add Art Material')}
                </Button>
                {artEditingId && (
                  <Button variant="ghost" type="button" onClick={resetArtForm}>Cancel Edit</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2"><Database className="w-5 h-5" /> Art Materials Inventory ({effectiveArtMaterials.length})</div>
                <div className="text-xs text-muted-foreground">Drag list below to re-order — or use Display Order field in the form above.</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {effectiveArtMaterials.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  <Palette className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No art materials yet.</p>
                  <p className="text-xs">Add materials in the form above to start populating the "ART MATERIALS & COLORS AVAILABLE" homepage section.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {effectiveArtMaterials.map((m: any) => (
                    <div key={m.id || `${m.title}-${m.display_order}`} className="rounded-xl border bg-background shadow-sm overflow-hidden flex flex-col">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img src={m.image_url} onError={(e:any) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Art+Material'; }} alt={m.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm leading-tight">{m.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-medium">#{m.display_order}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-5">{m.description}</p>
                        </div>
                        <div className="mt-auto flex gap-2 pt-2 border-t">
                          {m.id ? (
                            <>
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditArtMaterial(m)}>Edit</Button>
                              <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteArtMaterial(m)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                              </Button>
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic w-full text-center pt-1">Default item — add new items to manage via store</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Change Password</CardTitle>
                  <CardDescription>Update your admin dashboard access password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <Button type="submit">Change Password</Button>
                    {pwdMsg && <p className={`text-sm ${pwdMsg.includes('success') ? 'text-green-600' : 'text-destructive'}`}>{pwdMsg}</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}

