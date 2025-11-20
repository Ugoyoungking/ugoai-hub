
'use client';

import {
  AppWindow,
  BookOpen,
  BrainCircuit,
  Clapperboard,
  LayoutTemplate,
  Rocket,
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

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Autonomous Agents',
    description: 'Deploy agents that can plan, act, and loop to achieve your goals.',
    href: '/dashboard/ai-agents',
  },
  {
    icon: <Workflow className="h-8 w-8 text-primary" />,
    title: 'AI Workflow Builder',
    description: 'Visually create and automate complex tasks with a drag-and-drop interface.',
    href: '/dashboard/workflow-builder',
  },
  {
    icon: <AppWindow className="h-8 w-8 text-primary" />,
    title: 'AI App Generator',
    description: 'Generate full-stack applications from a simple text description.',
    href: '/dashboard/app-generator',
  },
  {
    icon: <LayoutTemplate className="h-8 w-8 text-primary" />,
    title: 'AI Website Builder',
    description: 'Create responsive, production-ready websites in minutes.',
    href: '/dashboard/website-builder',
  },
  {
    icon: <Clapperboard className="h-8 w-8 text-primary" />,
    title: 'AI Video Generator',
    description: 'Turn scripts into engaging videos with AI-powered presenters.',
    href: '/dashboard/video-generator',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Knowledge Base Training',
    description: 'Train personalized AI models on your own documents and websites.',
    href: '/dashboard/knowledge-base',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Real-Time Collaboration',
    description: 'Work with your team in a shared, collaborative environment.',
    href: '/dashboard/real-time-collab',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'And much more...',
    description: 'Explore all the features that UGO AI Studio has to offer.',
    href: '/dashboard',
  },
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
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function LandingPage() {
  const { user, signOut, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold">UGO AI Studio</span>
        </Link>
        {loading ? null : user ? (
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserNav user={user} signOut={signOut} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center space-y-6 py-20 text-center md:py-32 animate-in fade-in slide-in-from-top-12 duration-700">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            The All-in-One AI Platform
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            From content creation to application development, UGO AI Studio provides all the tools you need to
            harness the power of AI.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href={user ? '/dashboard' : '/signup'}>Start Building for Free</Link>
            </Button>
            <Button size="lg" variant="outline">
              Request a Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features, Infinite Possibilities
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to build, automate, and collaborate with artificial intelligence.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {features.map((feature, i) => (
                <Link 
                  key={feature.title} 
                  href={feature.href} 
                  className="flex flex-col items-start space-y-3 rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-in fade-in slide-in-from-bottom-10"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq-cta" className="bg-background py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Have Questions?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about UGO AI Studio.
              </p>
              <div className="mt-6">
                <Button asChild size="lg">
                  <Link href="/faq">
                    Read our FAQ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About the Developer Section */}
        <section id="about-developer" className="bg-secondary py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About the Developer
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                I'm Ugochukwu, a passionate and God-fearing Web Developer and Graphic Designer dedicated to
                crafting modern, responsive, and user-focused digital experiences. My journey began with HTML and
                CSS, and over time, I've mastered technologies like JavaScript, React, and Node.js. I take pride in
                transforming creative ideas into functional, visually appealing, and high-performing websites that don't
                just look great — they make an impact. Every project I build reflects my commitment to excellence,
                creativity, and faith-driven purpose.
              </p>
              <div className="mt-6">
                <Button asChild size="lg">
                  <Link href="https://ugoyoungking.github.io/portfolio/" target="_blank" rel="noopener noreferrer">
                    View My Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} UGO AI Studio made by{' '}
              <a
                href="https://ugoyoungking.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary hover:text-primary/80 transition-colors"
              >
                Ugoyoungking
              </a>
            </span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm hover:underline transition-colors" prefetch={false}>
              Terms
            </Link>
            <Link href="/privacy" className="text-sm hover:underline transition-colors" prefetch={false}>
              Privacy
            </Link>
            <Link href="/faq" className="text-sm hover:underline transition-colors" prefetch={false}>
              FAQ
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
