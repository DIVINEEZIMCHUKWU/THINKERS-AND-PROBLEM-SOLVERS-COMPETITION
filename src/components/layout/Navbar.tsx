import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT CONTEST', href: '/about' },
    { label: "WINNERS' ARTWORK", href: '/winners-artwork' },
    { label: 'ACTIVITIES IN EACH COUNTRY', href: '/activities' },
    { label: 'PANEL OF JUDGES IN THE WORLD CONTEST', href: '/judges' },
    { label: 'VIDEO GALLERY', href: '/video-gallery' },
    { label: 'ARTWORK GALLERY', href: '/artwork-gallery' },
  ];

  return (
    <>
      <div className="h-1.5 w-full bg-gradient-to-r from-destructive via-accent to-primary z-50 relative" />

      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 shrink-0">
               <img src="https://i.ibb.co/XxkMsnL9/IMG-20260508-WA0026.jpg" alt="Thinkers and Problem Solvers Logo" className="h-10 w-auto rounded" />
            </Link>
            <div className="hidden lg:flex gap-4 xl:gap-6 flex-wrap">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[10px] xl:text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link to="/admin" className={buttonVariants({ variant: "outline", className: "text-xs font-bold uppercase tracking-widest" })}>Admin</Link>
            <Link to="/register/student" className={buttonVariants({ className: "rounded-full text-xs font-bold uppercase tracking-widest" })}>Register</Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden shrink-0">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b bg-background px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors block py-2 border-b border-border/40"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={buttonVariants({ variant: "outline", className: "w-full justify-center text-xs font-bold uppercase tracking-widest py-6" })}>Admin Console</Link>
              <Link to="/register/student" onClick={() => setMobileMenuOpen(false)} className={buttonVariants({ className: "w-full justify-center rounded-full text-xs font-bold uppercase tracking-widest py-6" })}>Register Now</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
