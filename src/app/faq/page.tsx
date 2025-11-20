import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const faqs = [
  {
    question: "What is UGO AI Studio?",
    answer: "UGO AI Studio is an all-in-one, AI-powered platform for content creation and application development. It provides tools to build AI agents, design workflows, generate apps and websites, create videos, and train custom AI models.",
  },
  {
    question: "Who is UGO AI Studio for?",
    answer: "It's designed for developers, content creators, marketers, and businesses who want to leverage artificial intelligence to automate tasks, create high-quality content, and build powerful applications quickly.",
  },
  {
    question: "What can I build with the AI App and Website Generators?",
    answer: "You can generate full-stack, responsive applications and websites from a simple text description. The AI handles the code generation, allowing you to focus on the idea and functionality.",
  },
  {
    question: "How does Knowledge Base Training work?",
    answer: "You can provide your own documents (like PDFs) and website URLs to train a personalized AI model. This allows the AI to learn from your specific data and provide more relevant and accurate responses.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, you can get started with a free plan that includes access to many of the core features. For more advanced capabilities and higher usage limits, you can upgrade to one of our paid plans.",
  },
  {
    question: "What makes the AI agents 'autonomous'?",
    answer: "Our AI agents can independently plan, act, and loop through tasks until a specified goal is achieved. You define the objective, and the agent determines the necessary steps to complete it, even collaborating with other agents if needed.",
  },
];

export default function FaqPage() {
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
            <div className="text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about UGO AI Studio.
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-12 w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
  )
}
