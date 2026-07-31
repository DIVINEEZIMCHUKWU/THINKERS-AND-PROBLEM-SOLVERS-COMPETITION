import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`) : '';
try {
  if (supabaseUrl) {
    const urlObj = new URL(supabaseUrl);
    supabaseUrl = urlObj.origin;
  }
} catch (e) {
  console.warn('Could not parse Supabase URL:', e);
}
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please set them in your environment variables.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

export const saveToSupabaseTable = async (tableName: string, data: any, options?: { omitIdForInsert?: boolean }) => {
  if (!supabaseUrl || !supabaseAnonKey) return { success: false, error: 'Supabase URL/Key missing', data: null as any };
  try {
    const isObject = typeof data === 'object' && data !== null;
    const hasId = isObject && 'id' in data;
    const omitId = Boolean(options?.omitIdForInsert);
    const build = supabase.from(tableName) as any;
    let query: any;
    if (hasId && !omitId) {
      query = build.upsert(data, { onConflict: 'id', ignoreDuplicates: false }).select();
    } else {
      const insertPayload: any = isObject ? { ...data } : data;
      if (isObject && omitId && 'id' in insertPayload) delete insertPayload.id;
      query = build.insert(insertPayload).select();
    }
    const { data: resultData, error } = await query;
    if (error) {
       console.warn(`Could not save to Supabase ${tableName} table:`, error.message);
       return { success: false, error: error.message, data: null as any };
    }
    return { success: true, data: Array.isArray(resultData) ? resultData : null as any };
  } catch (err: any) {
    console.warn(`Supabase upsert to ${tableName} failed:`, err.message);
    return { success: false, error: err.message, data: null as any };
  }
};

export const deleteFromSupabaseTable = async (tableName: string, matchColumn: string, matchValue: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return { success: false, error: 'Supabase URL/Key missing' };
  try {
    const { error } = await supabase.from(tableName).delete().eq(matchColumn, matchValue);
    if (error) {
       console.warn(`Could not delete from Supabase ${tableName} table:`, error.message);
       return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn(`Supabase delete from ${tableName} failed:`, err.message);
    return { success: false, error: err.message };
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return { success: false, error: 'missing credentials' };
  try {
    const { error } = await supabase.from('admin_settings').upsert({ id: 'admin', password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch(e: any) {
    return { success: false, error: e.message };
  }
};

export const getAdminPassword = async (): Promise<string | null> => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase.from('admin_settings').select('password').eq('id', 'admin').single();
    if (!error && data) return data.password;
    return null;
  } catch(e) {
    return null;
  }
};

export const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

export const uploadFileToSupabase = async (file: File, bucket: string, path: string): Promise<string> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is missing in environment secrets.');
  }

  // 5MB = 5242880 bytes
  if (file.size > 5242880) {
    throw new Error(`File ${file.name} is larger than 5MB limit.`);
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Supabase upload error:', error.message);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
};

export const deleteFileFromSupabase = async (bucket: string, url: string) => {
  if (!supabaseUrl || !supabaseAnonKey || !url) return;
  try {
    const searchString = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(searchString);
    if (idx !== -1) {
      let path = url.slice(idx + searchString.length);
      // Remove query parameters if present
      if (path.includes('?')) path = path.split('?')[0];
      if (path) {
        const { error } = await supabase.storage.from(bucket).remove([decodeURIComponent(path)]);
        if (error) console.warn('Could not delete file from Supabase storage:', error.message);
      }
    }
  } catch (err: any) {
    console.warn('Delete file from storage failed:', err.message);
  }
};

// ================================================================
//  Fetch + DB→Zustand Adapters (used by public pages to hydrate
//  their local store from the live Supabase tables on load).
// ================================================================

const _s = (val: unknown): string => (val === null || val === undefined ? '' : String(val));
const _arr = <T>(val: unknown): T[] => Array.isArray(val) ? (val as T[]) : [];
const _toISODate = (val: unknown): string => {
  if (!val) return new Date().toISOString();
  try {
    const d = new Date(val as any);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return new Date().toISOString();
};

export type WinnerArtworkRow = {
  id: string; type: string; title: string; project_name?: string;
  age?: string | number; person_name?: string; country?: string;
  image_url: string; created_at?: string;
};
export type AdapterWinner = {
  id: string; type: 'GRAND_PRIZES' | 'SPECIAL_AWARDS' | 'BEST_FINALISTS';
  title: string; projectName: string; age: number | string;
  personName: string; country: string; imageUrl: string;
};

export const adaptWinnerRow = (row: WinnerArtworkRow): AdapterWinner => ({
  id: _s(row.id || Math.random().toString(36).slice(2, 11)),
  type: (['GRAND_PRIZES','SPECIAL_AWARDS','BEST_FINALISTS'].includes(row.type as any)
    ? row.type
    : 'GRAND_PRIZES') as AdapterWinner['type'],
  title: _s(row.title),
  projectName: _s(row.project_name),
  age: row.age !== null && row.age !== undefined ? (Number.isNaN(Number(row.age)) ? _s(row.age) : Number(row.age)) : '',
  personName: _s(row.person_name),
  country: _s(row.country),
  imageUrl: _s(row.image_url),
});

export const fetchWinnersArtwork = async (): Promise<AdapterWinner[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const { data, error } = await supabase
      .from('winner_artwork')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.warn('fetchWinnersArtwork error:', error.message); return []; }
    return (Array.isArray(data) ? data : []).map(adaptWinnerRow);
  } catch (e: any) { console.warn('fetchWinnersArtwork error:', e.message); return []; }
};

export type ActivityRow = {
  id: string; title: string; country?: string;
  contest_number?: string; image_url: string; created_at?: string;
};
export type AdapterActivity = {
  id: string; title: string; country: string;
  contestNumber: string; imageUrl: string;
};

export const adaptActivityRow = (row: ActivityRow): AdapterActivity => ({
  id: _s(row.id || Math.random().toString(36).slice(2, 11)),
  title: _s(row.title),
  country: _s(row.country),
  contestNumber: _s(row.contest_number),
  imageUrl: _s(row.image_url),
});

export const fetchActivities = async (): Promise<AdapterActivity[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.warn('fetchActivities error:', error.message); return []; }
    return (Array.isArray(data) ? data : []).map(adaptActivityRow);
  } catch (e: any) { console.warn('fetchActivities error:', e.message); return []; }
};

export type VideoRow = {
  id: string; title: string; video_url: string; platform?: string;
};
export type AdapterVideo = {
  id: string; title: string; videoUrl: string; type: 'youtube' | 'drive';
};

export const adaptVideoRow = (row: VideoRow): AdapterVideo => {
  const platform = String(row.platform || '').toLowerCase();
  const isDrive = platform === 'drive' || /drive\.google\.com/i.test(row.video_url);
  return {
    id: _s(row.id || Math.random().toString(36).slice(2, 11)),
    title: _s(row.title),
    videoUrl: _s(row.video_url),
    type: isDrive ? 'drive' : 'youtube',
  };
};

export const fetchVideos = async (): Promise<AdapterVideo[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const { data, error } = await supabase
      .from('video_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.warn('fetchVideos error:', error.message); return []; }
    return (Array.isArray(data) ? data : []).map(adaptVideoRow);
  } catch (e: any) { console.warn('fetchVideos error:', e.message); return []; }
};

export type GalleryRow = {
  id: string; title: string; project_name?: string;
  age?: string | number; person_name?: string; country?: string;
  image_url: string; created_at?: string;
};
export type AdapterGallery = {
  id: string; title: string; projectName: string;
  age: number | string; personName: string;
  country: string; imageUrl: string;
};

export const adaptGalleryRow = (row: GalleryRow): AdapterGallery => ({
  id: _s(row.id || Math.random().toString(36).slice(2, 11)),
  title: _s(row.title),
  projectName: _s(row.project_name),
  age: row.age !== null && row.age !== undefined ? (Number.isNaN(Number(row.age)) ? _s(row.age) : Number(row.age)) : '',
  personName: _s(row.person_name),
  country: _s(row.country),
  imageUrl: _s(row.image_url),
});

export const fetchArtworkGallery = async (): Promise<AdapterGallery[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const { data, error } = await supabase
      .from('artwork_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.warn('fetchArtworkGallery error:', error.message); return []; }
    return (Array.isArray(data) ? data : []).map(adaptGalleryRow);
  } catch (e: any) { console.warn('fetchArtworkGallery error:', e.message); return []; }
};

export type SkillProgrammeRow = {
  id: string; is_active?: boolean;
  hero_title?: string; hero_subtitle?: string; hero_description?: string;
  skills?: unknown; full_content?: string;
  sponsor_name?: string; sponsor_logo_url?: string; sponsor_website?: string;
  organizer_name?: string; apply_link?: string; tutor_link?: string;
  programme_images?: unknown; display_order?: number;
  created_at?: string; updated_at?: string;
};
export type AdapterProgrammeImage = { image_url: string; title?: string };
export type AdapterSkillProgramme = {
  id: string; is_active: boolean;
  hero_title: string; hero_subtitle: string; hero_description: string;
  skills: string[]; full_content: string;
  sponsor_name: string; sponsor_logo_url: string; sponsor_website: string;
  organizer_name: string; apply_link: string; tutor_link: string;
  programme_images: AdapterProgrammeImage[];
  display_order: number; created_at: string;
};

export const adaptSkillProgrammeRow = (row: SkillProgrammeRow): AdapterSkillProgramme => {
  let skills: string[] = [];
  if (Array.isArray(row.skills)) {
    skills = (row.skills as any[]).map(x => _s(x)).filter(Boolean);
  } else if (typeof row.skills === 'string') {
    try { skills = (JSON.parse(row.skills) as any[]).map(x => _s(x)).filter(Boolean); } catch {}
  }
  let programme_images: AdapterProgrammeImage[] = [];
  if (Array.isArray(row.programme_images)) {
    programme_images = (row.programme_images as any[]).map(p => ({
      image_url: _s(p?.image_url || p?.url || p),
      title: p?.title ? _s(p.title) : undefined,
    })).filter(p => p.image_url);
  } else if (typeof row.programme_images === 'string' && row.programme_images) {
    try {
      const parsed = JSON.parse(row.programme_images);
      if (Array.isArray(parsed)) programme_images = parsed.map((p: any) => ({
        image_url: _s(p?.image_url || p?.url || p),
        title: p?.title ? _s(p.title) : undefined,
      })).filter((p: any) => p.image_url);
    } catch {}
  }
  return {
    id: _s(row.id || Math.random().toString(36).slice(2, 11)),
    is_active: Boolean(row.is_active),
    hero_title: _s(row.hero_title),
    hero_subtitle: _s(row.hero_subtitle),
    hero_description: _s(row.hero_description),
    skills,
    full_content: _s(row.full_content),
    sponsor_name: _s(row.sponsor_name),
    sponsor_logo_url: _s(row.sponsor_logo_url),
    sponsor_website: _s(row.sponsor_website),
    organizer_name: _s(row.organizer_name),
    apply_link: _s(row.apply_link),
    tutor_link: _s(row.tutor_link),
    programme_images,
    display_order: Number(row.display_order || 0),
    created_at: _toISODate(row.created_at),
  };
};

export const fetchSkillProgrammes = async (): Promise<AdapterSkillProgramme[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const { data, error } = await supabase
      .from('skill_programmes')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error) { console.warn('fetchSkillProgrammes error:', error.message); return []; }
    return (Array.isArray(data) ? data : []).map(adaptSkillProgrammeRow);
  } catch (e: any) { console.warn('fetchSkillProgrammes error:', e.message); return []; }
};
