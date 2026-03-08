import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DashboardSquare01Icon, 
  Calendar01Icon, 
  LicenseIcon, 
  UserCircleIcon,
  Notification01Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/student')({
  component: StudentLayout,
});

function StudentLayout() {
  const location = useLocation();

  const navItems = [
    { label: 'Home',     icon: DashboardSquare01Icon, to: '/student/dashboard' },
    { label: 'Schedule', icon: Calendar01Icon,         to: '/student/schedule'  },
    { label: 'Exams',    icon: LicenseIcon,            to: '/student/exams'     },
    { label: 'Profile',  icon: UserCircleIcon,         to: '/student/profile'   },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
            DT
          </div>
          <span className="text-xl font-bold tracking-tight">DriveTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/student/notifications">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
              <HugeiconsIcon icon={Notification01Icon} className="h-5 w-5" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive p-0 flex items-center justify-center text-[10px]">
                1
              </Badge>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="mx-auto max-w-lg p-4">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t bg-background/95 pb-4 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "rounded-2xl p-2 transition-all duration-300",
                isActive && "bg-primary/10 shadow-inner"
              )}>
                <HugeiconsIcon icon={item.icon} className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
