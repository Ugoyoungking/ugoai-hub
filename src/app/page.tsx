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

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI Autonomous Agents',
    description: 'Deploy agents that can plan, act, and loop to achieve your goals.',
  },
  {
    icon: <Workflow className="h-8 w-8 text-primary" />,
    title: 'AI Workflow Builder',
    description: 'Visually create and automate complex tasks with a drag-and-drop interface.',
  },
  {
    icon: <AppWindow className="h-8 w-8 text-primary" />,
    title: 'AI App Generator',
    description: 'Generate full-stack applications from a simple text description.',
  },
  {
    icon: <LayoutTemplate className="h-8 w-8 text-primary" />,
    title: 'AI Website Builder',
    description: 'Create responsive, production-ready websites in minutes.',
  },
  {
    icon: <Clapperboard className="h-8 w-8 text-primary" />,
    title: 'AI Video Generator',
    description: 'Turn scripts into engaging videos with AI-powered presenters.',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Knowledge Base Training',
    description: 'Train personalized AI models on your own documents and websites.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Real-Time Collaboration',
    description: 'Work with your team in a shared, collaborative environment.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'And much more...',
    description: 'Explore all the features that UGO AI Studio has to offer.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold">UGO AI Studio</span>
        </Link>
        <Button>Get Started</Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center space-y-6 py-20 text-center md:py-32">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            The All-in-One AI Platform
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            From content creation to application development, UGO AI Studio provides all the tools you need to
            harness the power of AI.
          </p>
          <div className="flex gap-4">
            <Button size="lg">Start Building for Free</Button>
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
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-start space-y-3 rounded-lg border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
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
                className="underline text-primary hover:text-primary/80"
              >
                Ugoyoungking
              </a>
            </span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Terms
            </Link>
            <Link href="#" className="text-sm hover:underline" prefetch={false}>
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
