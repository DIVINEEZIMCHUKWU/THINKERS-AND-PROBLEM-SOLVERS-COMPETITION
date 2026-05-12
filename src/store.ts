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
  schoolName: string;
  category: string;
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

interface AppState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'status' | 'registeredAt'> & { registrationNumber?: string }) => void;
  updateStudentStatus: (id: string, status: 'Pending' | 'Verified') => void;
  removeStudent: (id: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  
  winnersArtwork: WinnerArtwork[];
  addWinnerArtwork: (item: Omit<WinnerArtwork, 'id'>) => void;
  removeWinnerArtwork: (id: string) => void;
  
  activities: ActivityEntry[];
  addActivity: (item: Omit<ActivityEntry, 'id'>) => void;
  removeActivity: (id: string) => void;
  
  videos: VideoEntry[];
  addVideo: (item: Omit<VideoEntry, 'id'>) => void;
  removeVideo: (id: string) => void;
  
  artworkGallery: GalleryEntry[];
  addArtworkGallery: (item: Omit<GalleryEntry, 'id'>) => void;
  removeArtworkGallery: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      students: [],
      isAuthenticated: false,
      setIsAuthenticated: (val) => set({ isAuthenticated: val }),
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

      activities: [],
      addActivity: (item) => set((state) => ({ 
        activities: [...state.activities, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeActivity: (id) => set((state) => ({ 
        activities: state.activities.filter(a => a.id !== id) 
      })),

      videos: [],
      addVideo: (item) => set((state) => ({ 
        videos: [...state.videos, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeVideo: (id) => set((state) => ({ 
        videos: state.videos.filter(v => v.id !== id) 
      })),

      artworkGallery: [],
      addArtworkGallery: (item) => set((state) => ({ 
        artworkGallery: [...state.artworkGallery, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
      })),
      removeArtworkGallery: (id) => set((state) => ({ 
        artworkGallery: state.artworkGallery.filter(g => g.id !== id) 
      })),
    }),
    {
      name: 'tpsc-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
