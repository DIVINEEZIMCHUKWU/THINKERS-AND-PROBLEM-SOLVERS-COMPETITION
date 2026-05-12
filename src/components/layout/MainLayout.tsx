import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Phone } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <a 
        href="tel:+2348103833239" 
        className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-primary/50 flex items-center justify-center animate-pulse"
        title="Call Us: +2348103833239"
        aria-label="Call Us"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
