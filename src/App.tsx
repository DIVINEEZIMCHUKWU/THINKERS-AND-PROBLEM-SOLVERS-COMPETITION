import { ThemeProvider } from '@/components/theme-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { CookieConsent } from '@/components/CookieConsent';

// Public Pages
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Categories from '@/pages/public/Categories';
import StudentRegistration from '@/pages/registration/StudentRegistration';
import WinnersArtwork from '@/pages/public/WinnersArtwork';
import Activities from '@/pages/public/Activities';
import Judges from '@/pages/public/Judges';
import VideoGallery from '@/pages/public/VideoGallery';
import Exhibition from '@/pages/public/Exhibition';
import ArtworkGallery from '@/pages/public/ArtworkGallery';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <CookieConsent />
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/exhibition" element={<Exhibition />} />
            <Route path="/artwork-gallery" element={<ArtworkGallery />} />
            <Route path="/winners-artwork" element={<WinnersArtwork />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/judges" element={<Judges />} />
            <Route path="/video-gallery" element={<VideoGallery />} />
            <Route path="/register/student" element={<StudentRegistration />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
