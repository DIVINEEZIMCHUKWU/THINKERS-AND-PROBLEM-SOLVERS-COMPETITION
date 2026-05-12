import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Moon, Sun, LayoutDashboard, ArrowLeft, LogOut } from 'lucide-react';
import { useAppStore } from '@/store';

export default function AdminLayout() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, setIsAuthenticated } = useAppStore();

  return (
    <div className="flex min-h-screen bg-muted/40 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col items-stretch sticky top-0 h-screen hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-serif font-bold text-lg">TPSC Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <Link to="/admin" className={buttonVariants({ variant: "ghost", className: "w-full justify-start" })}><LayoutDashboard className="mr-2 h-4 w-4" /> Overview</Link>
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
              <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)}>
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

