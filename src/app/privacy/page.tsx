
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
              <p className="lead mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>1. Introduction</h2>
              <p>
                Welcome to UGO AI Studio. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our
                website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul>
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                <li><strong>Content Data</strong> includes the text, documents, and other content you provide when using our AI services.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul>
                <li>To provide, operate, and maintain our services.</li>
                <li>To improve, personalize, and expand our services.</li>
                <li>To understand and analyze how you use our services.</li>
                <li>To develop new products, services, features, and functionality.</li>
                <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. 
              </p>

              <h2>5. Your Legal Rights</h2>
              <p>
                You have rights under data protection laws in relation to your personal data, including the right to
                request access, correction, erasure, restriction of processing, and to object to processing.
              </p>

              <h2>6. Changes to the Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through the developer's portfolio.
              </p>
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
