import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Phone, MessageCircle } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <a 
        href="https://wa.me/2348103833239" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-green-500/50 flex items-center justify-center animate-pulse"
        title="Chat on WhatsApp: +2348103833239"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
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
