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

export const saveToSupabaseTable = async (tableName: string, data: any) => {
  if (!supabaseUrl || !supabaseAnonKey) return { success: false, error: 'Supabase URL/Key missing' };
  try {
    const { error } = await supabase.from(tableName).insert(data);
    if (error) {
       console.warn(`Could not save to Supabase ${tableName} table:`, error.message);
       return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.warn(`Supabase insert to ${tableName} failed:`, err.message);
    return { success: false, error: err.message };
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
