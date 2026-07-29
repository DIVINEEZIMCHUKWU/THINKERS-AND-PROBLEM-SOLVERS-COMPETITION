import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Moon, Sun, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import AdminLogin from '@/pages/admin/AdminLogin';

export default function AdminLayout() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, setIsAuthenticated, _hasHydrated } = useAppStore();
  const navigate = useNavigate();
  const [safeHydrated, setSafeHydrated] = useState(false);

  useEffect(() => {
    let didRun = false;
    const fallbackTimer = window.setTimeout(() => {
      if (didRun) return;
      didRun = true;
      try {
        const localAuthed = localStorage.getItem('tpsc_admin_authed') === '1';
        const st = useAppStore.getState() as any;
        if (localAuthed && !st.isAuthenticated) {
          useAppStore.setState({ isAuthenticated: true });
        }
        if (!st._hasHydrated) {
          useAppStore.setState({ _hasHydrated: true });
        }
      } catch {}
      setSafeHydrated(true);
    }, 1200);

    const storeUnsub = useAppStore.subscribe((s: any) => {
      if (s._hasHydrated && !didRun) {
        didRun = true;
        window.clearTimeout(fallbackTimer);
        setSafeHydrated(true);
      }
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      storeUnsub();
    };
  }, []);

  const hydrated = _hasHydrated || safeHydrated;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="text-sm text-muted-foreground font-medium tracking-wide">Loading Admin...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Render the login page directly (without sidebar/header) so there's
    // no flicker of admin chrome to the unauthenticated user.
    return (
      <div className="min-h-screen bg-muted/40">
        <AdminLogin />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col items-stretch sticky top-0 h-screen hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-serif font-bold text-lg">TPSC Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link to="/admin" className={buttonVariants({ variant: "ghost", className: "w-full justify-start" })}><LayoutDashboard className="mr-2 h-4 w-4" /> Overview</Link>
          <button
            onClick={() => {
              const t = window.setTimeout(() => {
                const tabs = document.querySelectorAll<HTMLButtonElement>('[data-radix-collection-item], [role="tab"]');
                tabs.forEach(tb => {
                  if ((tb.textContent || '').toLowerCase().includes('skill acquisition')) tb.click();
                });
                window.clearTimeout(t);
              }, 50);
            }}
            className={buttonVariants({ variant: "ghost", className: "w-full justify-start" })}
          >
            <GraduationCapIcon /> Skill Acquisition
          </button>
          <Link to="/skill-acquisition" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", className: "w-full justify-start" })}><ArrowLeft className="mr-2 h-4 w-4 rotate-180" /> View SA Page</Link>
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link to="/" className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Site</Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg hidden sm:block">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={() => { setIsAuthenticated(false); navigate('/admin', { replace: true }); }}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  );
}

