'use client';

import {
  AppWindow,
  Bell,
  BookOpen,
  BrainCircuit,
  Clapperboard,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeft,
  Settings,
  Users,
  Workflow,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTour } from '@/hooks/use-tour';
import { Tour } from '@/components/tour';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/ai-chat', icon: MessageCircle, label: 'AI Chat' },
  { href: '/dashboard/ai-agents', icon: BrainCircuit, label: 'AI Agents' },
  { href: '/dashboard/workflow-builder', icon: Workflow, label: 'Workflow Builder' },
  { href: '/dashboard/app-generator', icon: AppWindow, label: 'App Generator' },
  { href: '/dashboard/website-builder', icon: LayoutTemplate, label: 'Website Builder' },
  { href: '/dashboard/video-generator', icon: Clapperboard, label: 'Video Generator' },
  { href: '/dashboard/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { href: '/dashboard/real-time-collab', icon: Users, label: 'Collaboration' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function UserNav({ user, signOut }: { user: User; signOut: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarNav() {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col gap-2 px-4">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === item.href && 'bg-muted text-primary'
                )}
                >
                <item.icon className="h-4 w-4" />
                {item.label}
                </Link>
            ))}
        </nav>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { start, isCompleted } = useTour();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user && !isCompleted) {
        // Use a timeout to ensure the UI is fully rendered before starting the tour.
        const timer = setTimeout(() => {
            start();
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [user, isCompleted, start]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Tour />
      <div className={cn(
          "grid min-h-screen w-full",
          isSidebarCollapsed ? "md:grid-cols-[56px_1fr]" : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]",
          "transition-all duration-300 ease-in-out"
      )}>
        <div className={cn("hidden border-r bg-muted/40 md:block")}>
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className={cn(
                "flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6",
                isSidebarCollapsed && "justify-center"
              )}>
              <Link href="/" className={cn("flex items-center gap-2 font-semibold", isSidebarCollapsed && "justify-center")}>
                <Logo className="h-6 w-6 text-primary" />
                <span className={cn(isSidebarCollapsed && "sr-only")}>UGO AI Studio</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-2 px-4">
                {navItems.map((item) => (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        usePathname() === item.href && 'bg-muted text-primary',
                        isSidebarCollapsed && "justify-center"
                    )}
                    >
                    <item.icon className="h-4 w-4" />
                    <span className={cn("truncate", isSidebarCollapsed && "sr-only")}>{item.label}</span>
                    </Link>
                ))}
            </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
             <Button variant="outline" size="icon" className="shrink-0 hidden md:flex" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="flex h-14 items-center border-b px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="">UGO AI Studio</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <SidebarNav />
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
            <UserNav user={user} signOut={signOut} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
