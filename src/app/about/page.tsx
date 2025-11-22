
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-semibold">UGO AI Studio</span>
        </Link>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="md:col-span-1">
                <Image
                  src="https://image2url.com/images/1760142087082-0d9360e4-2d41-4459-a0a1-135afa56a7f7.jpg"
                  alt="Ugochukwu Jonathan"
                  width={250}
                  height={250}
                  className="mx-auto rounded-full object-cover aspect-square"
                />
              </div>
              <div className="md:col-span-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                  About the Developer
                </h1>
                <h2 className="mt-2 text-lg font-semibold text-primary">
                  Ugochukwu Jonathan
                </h2>
                <div className="prose prose-lg dark:prose-invert mt-6">
                  <p>
                    I'm Ugochukwu, a passionate and God-fearing Web Developer and Graphic Designer dedicated to
                    crafting modern, responsive, and user-focused digital experiences. My journey began with HTML and
                    CSS, and over time, I've mastered technologies like JavaScript, React, and Node.js.
                  </p>
                  <p>
                    I take pride in transforming creative ideas into functional, visually appealing, and high-performing websites that don't
                    just look great — they make an impact. Every project I build, including UGO AI Studio, reflects my commitment to excellence,
                    creativity, and faith-driven purpose.
                  </p>
                   <Button asChild size="lg" className="mt-4">
                      <Link href="https://ugoyoungking.github.io/portfolio/" target="_blank" rel="noopener noreferrer">
                        View My Portfolio
                      </Link>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-secondary">
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
            <Link href="/terms" className="text-sm hover:underline" prefetch={false}>
              Terms
            </Link>
            <Link href="/privacy" className="text-sm hover:underline" prefetch={false}>
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
