import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type Student = {
  id: string;
  registrationNumber: string;
  fullName: string;
  dob: string;
  gender: string;
  country: string;
  state: string;
  lga: string;
  schoolName: string;
  registrationCategory: string;
  level: string;
  studentClass: string;
  passportUrl: string;
  paymentProofUrl: string;
  registeredAt: string;
  status: 'Pending' | 'Verified';
};

export type WinnerArtwork = {
  id: string;
  type: 'GRAND_PRIZES' | 'SPECIAL_AWARDS' | 'BEST_FINALISTS';
  title: string;
  projectName: string;
  age: number | string;
  personName: string;
  country: string;
  imageUrl: string;
};

export type ActivityEntry = {
  id: string;
  title: string;
  country: string;
  contestNumber: string;
  imageUrl: string;
};

export type VideoEntry = {
  id: string;
  title: string;
  videoUrl: string;
  type: 'youtube' | 'drive';
};

export type GalleryEntry = {
  id: string;
  title: string;
  projectName: string;
  age: number | string;
  personName: string;
  country: string;
  imageUrl: string;
};

export type SkillProgramme = {
  id: string;
  is_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  skills: string[];
  full_content: string;
  sponsor_name: string;
  sponsor_logo_url: string;
  sponsor_website: string;
  organizer_name: string;
  apply_link: string;
  tutor_link: string;
  programme_images: { image_url: string; title?: string }[];
  display_order: number;
  created_at: string;
  updated_at?: string;
};

export type SkillGalleryImage = {
  id: string;
  image_url: string;
  title: string;
  display_order: number;
};

export type SkillHighlight = {
  id: string;
  text: string;
  display_order: number;
};

export type SkillSettings = {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  programme_status: 'open' | 'closed' | 'paused';
  registration_open: boolean;
  banner_image_1: string;
  banner_image_2: string;
  contact_location: string;
  contact_phone: string;
  contact_email: string;
  contact_website: string;
};

export type ArtMaterial = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
};

export type RemoteSchoolFlyer = {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  section?: 'apply' | 'gallery';
  display_order?: number;
  status?: 'active' | 'archived';
  created_at?: string;
  updated_at?: string;
};

interface AppState {
  _hasHydrated: boolean;
  _setHasHydrated: (val: boolean) => void;
  _lastSyncedAt: number;
  _markSyncedNow: () => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'status' | 'registeredAt'> & { registrationNumber?: string }) => void;
  updateStudentStatus: (id: string, status: 'Pending' | 'Verified') => void;
  removeStudent: (id: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  
  winnersArtwork: WinnerArtwork[];
  addWinnerArtwork: (item: Omit<WinnerArtwork, 'id'>) => void;
  removeWinnerArtwork: (id: string) => void;
  replaceWinnersArtwork: (items: WinnerArtwork[]) => void;

  activities: ActivityEntry[];
  addActivity: (item: Omit<ActivityEntry, 'id'>) => void;
  removeActivity: (id: string) => void;
  replaceActivities: (items: ActivityEntry[]) => void;

  videos: VideoEntry[];
  addVideo: (item: Omit<VideoEntry, 'id'>) => void;
  removeVideo: (id: string) => void;
  replaceVideos: (items: VideoEntry[]) => void;

  artworkGallery: GalleryEntry[];
  addArtworkGallery: (item: Omit<GalleryEntry, 'id'>) => void;
  removeArtworkGallery: (id: string) => void;
  replaceArtworkGallery: (items: GalleryEntry[]) => void;

  skillGallery: SkillGalleryImage[];
  addSkillGalleryImage: (item: Omit<SkillGalleryImage, 'id'>) => void;
  updateSkillGalleryImage: (id: string, item: Partial<SkillGalleryImage>) => void;
  removeSkillGalleryImage: (id: string) => void;
  replaceSkillGallery: (items: SkillGalleryImage[]) => void;

  skillHighlights: SkillHighlight[];
  addSkillHighlight: (item: Omit<SkillHighlight, 'id'>) => void;
  updateSkillHighlight: (id: string, item: Partial<SkillHighlight>) => void;
  removeSkillHighlight: (id: string) => void;
  replaceSkillHighlights: (items: SkillHighlight[]) => void;

  skillSettings: Partial<SkillSettings>;
  updateSkillSettings: (settings: Partial<SkillSettings>) => void;
  replaceSkillSettings: (settings: Partial<SkillSettings>) => void;

  skillProgrammes: SkillProgramme[];
  addSkillProgramme: (item: Omit<SkillProgramme, 'id' | 'created_at'> & { id?: string; created_at?: string }) => SkillProgramme;
  updateSkillProgramme: (id: string, item: Partial<SkillProgramme>) => void;
  removeSkillProgramme: (id: string) => void;
  setActiveSkillProgramme: (id: string) => void;
  replaceSkillProgrammes: (items: SkillProgramme[]) => void;

  artMaterials: ArtMaterial[];
  addArtMaterial: (item: Omit<ArtMaterial, 'id' | 'created_at'> & { created_at?: string }) => void;
  updateArtMaterial: (id: string, item: Partial<ArtMaterial>) => void;
  removeArtMaterial: (id: string) => void;
  replaceArtMaterials: (items: ArtMaterial[]) => void;

  remoteSchoolFlyers: RemoteSchoolFlyer[];
  addRemoteSchoolFlyer: (item: Omit<RemoteSchoolFlyer, 'id' | 'created_at'> & { created_at?: string }) => RemoteSchoolFlyer;
  updateRemoteSchoolFlyer: (id: string, item: Partial<RemoteSchoolFlyer>) => void;
  removeRemoteSchoolFlyer: (id: string) => void;
  replaceRemoteSchoolFlyers: (items: RemoteSchoolFlyer[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      _setHasHydrated: (val) => set({ _hasHydrated: val }),
      _lastSyncedAt: 0,
      _markSyncedNow: () => set({ _lastSyncedAt: Date.now() }),
      students: [],
      isAuthenticated: (() => {
        try {
          if (typeof window === 'undefined') return false;
          return localStorage.getItem('tpsc_admin_authed') === '1';
        } catch {
          return false;
        }
      })(),
      setIsAuthenticated: (val) => {
        try {
          if (typeof window !== 'undefined') {
            if (val) localStorage.setItem('tpsc_admin_authed', '1');
            else localStorage.removeItem('tpsc_admin_authed');
          }
        } catch {}
        set({ isAuthenticated: val });
      },
      addStudent: (studentData) => 
        set((state) => {
          const id = Math.random().toString(36).substr(2, 9);
          // Generate a pseudo-registration number if not provided
          const regNo = studentData.registrationNumber || `TPSC-26-${Math.floor(1000 + Math.random() * 9000)}`;
          const newStudent: Student = {
            ...studentData,
            id,
            registrationNumber: regNo,
            registeredAt: new Date().toISOString(),
            status: 'Pending',
          };
          return { students: [newStudent, ...state.students] };
        }),
      updateStudentStatus: (id, status) =>
        set((state) => ({
          students: state.students.map(s => s.id === id ? { ...s, status } : s)
        })),
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter(s => s.id !== id)
        })),
        
      winnersArtwork: [],
      addWinnerArtwork: (item) => set((state) => ({ 
        winnersArtwork: [...state.winnersArtwork, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeWinnerArtwork: (id) => set((state) => ({ 
        winnersArtwork: state.winnersArtwork.filter(w => w.id !== id) 
      })),
      replaceWinnersArtwork: (items) => set({ winnersArtwork: Array.isArray(items) ? items : [] }),

      activities: [],
      addActivity: (item) => set((state) => ({ 
        activities: [...state.activities, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeActivity: (id) => set((state) => ({ 
        activities: state.activities.filter(a => a.id !== id) 
      })),
      replaceActivities: (items) => set({ activities: Array.isArray(items) ? items : [] }),

      videos: [],
      addVideo: (item) => set((state) => ({ 
        videos: [...state.videos, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeVideo: (id) => set((state) => ({ 
        videos: state.videos.filter(v => v.id !== id) 
      })),
      replaceVideos: (items) => set({ videos: Array.isArray(items) ? items : [] }),

      artworkGallery: [],
      addArtworkGallery: (item) => set((state) => ({ 
        artworkGallery: [...state.artworkGallery, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeArtworkGallery: (id) => set((state) => ({ 
        artworkGallery: state.artworkGallery.filter(g => g.id !== id) 
      })),
      replaceArtworkGallery: (items) => set({ artworkGallery: Array.isArray(items) ? items : [] }),

      skillGallery: [],
      addSkillGalleryImage: (item) => set((state) => ({
        skillGallery: [...state.skillGallery, { ...item, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateSkillGalleryImage: (id, item) => set((state) => ({
        skillGallery: state.skillGallery.map(g => g.id === id ? { ...g, ...item } : g)
      })),
      removeSkillGalleryImage: (id) => set((state) => ({
        skillGallery: state.skillGallery.filter(g => g.id !== id)
      })),
      replaceSkillGallery: (items) => set({ skillGallery: Array.isArray(items) ? items : [] }),

      skillHighlights: [],
      addSkillHighlight: (item) => set((state) => ({
        skillHighlights: [...state.skillHighlights, { ...item, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateSkillHighlight: (id, item) => set((state) => ({
        skillHighlights: state.skillHighlights.map(h => h.id === id ? { ...h, ...item } : h)
      })),
      removeSkillHighlight: (id) => set((state) => ({
        skillHighlights: state.skillHighlights.filter(h => h.id !== id)
      })),
      replaceSkillHighlights: (items) => set({ skillHighlights: Array.isArray(items) ? items : [] }),

      skillSettings: {},
      updateSkillSettings: (settings) => set((state) => ({
        skillSettings: { ...state.skillSettings, ...settings }
      })),
      replaceSkillSettings: (settings) => set({ skillSettings: typeof settings === 'object' && settings !== null ? settings : {} }),

      skillProgrammes: [],
      addSkillProgramme: (item) => {
        const created: SkillProgramme = {
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9),
          created_at: item.created_at || new Date().toISOString()
        } as SkillProgramme;
        set((state) => ({
          skillProgrammes: [...state.skillProgrammes, created]
        }));
        return created;
      },
      updateSkillProgramme: (id, item) => set((state) => ({
        skillProgrammes: state.skillProgrammes.map(p => p.id === id ? { ...p, ...item } : p)
      })),
      removeSkillProgramme: (id) => set((state) => ({
        skillProgrammes: state.skillProgrammes.filter(p => p.id !== id)
      })),
      setActiveSkillProgramme: (id) => set((state) => ({
        skillProgrammes: state.skillProgrammes.map(p => ({ ...p, is_active: p.id === id }))
      })),
      replaceSkillProgrammes: (items) => set({ skillProgrammes: Array.isArray(items) ? items : [] }),

      artMaterials: [],
      addArtMaterial: (item) => set((state) => ({
        artMaterials: [...state.artMaterials, {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          created_at: item.created_at || new Date().toISOString()
        } as ArtMaterial]
      })),
      updateArtMaterial: (id, item) => set((state) => ({
        artMaterials: state.artMaterials.map(m => m.id === id ? { ...m, ...item } : m)
      })),
      removeArtMaterial: (id) => set((state) => ({
        artMaterials: state.artMaterials.filter(m => m.id !== id)
      })),
      replaceArtMaterials: (items) => set({ artMaterials: Array.isArray(items) ? items : [] }),

      remoteSchoolFlyers: [],
      addRemoteSchoolFlyer: (item) => {
        const created: RemoteSchoolFlyer = {
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 12),
          created_at: item.created_at || new Date().toISOString(),
          status: item.status || 'active',
        } as RemoteSchoolFlyer;
        set((state) => ({
          remoteSchoolFlyers: [...state.remoteSchoolFlyers, created]
        }));
        return created;
      },
      updateRemoteSchoolFlyer: (id, item) => set((state) => ({
        remoteSchoolFlyers: state.remoteSchoolFlyers.map(f => f.id === id ? { ...f, ...item } : f)
      })),
      removeRemoteSchoolFlyer: (id) => set((state) => ({
        remoteSchoolFlyers: state.remoteSchoolFlyers.filter(f => f.id !== id)
      })),
      replaceRemoteSchoolFlyers: (items) => set({ remoteSchoolFlyers: Array.isArray(items) ? items : [] }),
    }),
    {
      name: 'tpsc-storage',
      storage: createJSONStorage(() => storage),

      partialize: (state) => {
        const s = state as any;
        const LIVE_FIELDS: Record<string, 1> = {
          winnersArtwork: 1,
          activities: 1,
          videos: 1,
          artworkGallery: 1,
          skillProgrammes: 1,
          artMaterials: 1,
          skillGallery: 1,
          skillHighlights: 1,
          skillSettings: 1,
          _hasHydrated: 1,
          _setHasHydrated: 1,
          _lastSyncedAt: 1,
          _markSyncedNow: 1,
        };
        const out: any = {};
        for (const k of Object.keys(s)) {
          if (LIVE_FIELDS[k]) continue;
          if (typeof s[k] === 'function') continue;
          out[k] = s[k];
        }
        return out;
      },

      // ----------- READ/MERGE SIDE (disk INTO current in-memory) -----------
      // Official zustand persist `merge` hook: called BEFORE setState happens.
      // We strip every LIVE_FIELD from persistedState so the stale cache can
      // NEVER overwrite anything currently in memory for those fields. This
      // is 100% race-proof: merge is synchronous, no clocks / timestamps.
      merge: (persistedState, currentState) => {
        const LIVE_FIELDS: Record<string, 1> = {
          winnersArtwork: 1,
          activities: 1,
          videos: 1,
          artworkGallery: 1,
          skillProgrammes: 1,
          artMaterials: 1,
          skillGallery: 1,
          skillHighlights: 1,
          skillSettings: 1,
          _hasHydrated: 1,
          _setHasHydrated: 1,
          _lastSyncedAt: 1,
          _markSyncedNow: 1,
        };
        const disk: any = (persistedState || {}) as any;
        const cur: any = currentState as any;
        const merged: any = {};
        for (const k of Object.keys(disk)) {
          if (LIVE_FIELDS[k]) continue;
          if (typeof disk[k] === 'function') continue;
          merged[k] = disk[k];
        }
        // Never drop current in-memory values for LIVE_FIELDS (they may
        // have just been set by the hydrator before zustand finished the
        // async IndexedDB read): always inherit them from currentState.
        for (const k of Object.keys(cur)) {
          if (k in merged && !LIVE_FIELDS[k]) continue;
          merged[k] = cur[k];
        }
        // Force-auth mirror (admin_layout also sets tpsc_admin_authed key)
        try {
          if (typeof window !== 'undefined') {
            const localAuthed = localStorage.getItem('tpsc_admin_authed') === '1';
            if (localAuthed) merged.isAuthenticated = true;
            else merged.isAuthenticated = false;
          }
        } catch {}
        // ONE-SHOT LEGACY-WIPE: any browser that persisted live fields in
        // the days BEFORE we started excluding them needs those fields
        // DELETED from disk on the NEXT save, otherwise merge dropping
        // them THIS load still reads stale data next load until partialize
        // writes a new version (which it will after ANY setState). But we
        // force a re-write immediately so IndexedDB is clean NOW.
        try {
          if (typeof window !== 'undefined') {
            let shouldRewrite = false;
            const LEGACY_MARKER_KEY = 'tpsc_persist_legacy_live_fields_wiped_v1';
            const alreadyWiped = localStorage.getItem(LEGACY_MARKER_KEY) === '1';
            const diskHasLegacyLive = Object.keys(disk).some(k => LIVE_FIELDS[k]);
            if (!alreadyWiped || diskHasLegacyLive) {
              shouldRewrite = true;
            }
            if (shouldRewrite) {
              // Trigger a fresh setState that partialize will save WITHOUT
              // any live fields, nuking the legacy IndexedDB snapshot.
              setTimeout(() => {
                try {
                  (window as any).__tpsc_store_ref?.setState?.({
                    _lastSyncedAt: Date.now()
                  });
                  localStorage.setItem(LEGACY_MARKER_KEY, '1');
                } catch {}
              }, 50);
            }
          }
        } catch {}
        return merged;
      },

      onRehydrateStorage: (_api) => {
        return (_state, error) => {
          if (error) {
            console.error('Zustand rehydration error:', error);
          }
          try { _api.setState({ _hasHydrated: true }); } catch {}
        };
      },
      skipHydration: false,
    }
  )
);

if (typeof window !== 'undefined') {
  try {
    (window as any).__tpsc_store_ref = useAppStore;
  } catch {}
}
