'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/use-tour';
import {
  LayoutDashboard,
  BrainCircuit,
  Workflow,
  AppWindow,
  LayoutTemplate,
  Clapperboard,
  BookOpen,
} from 'lucide-react';

const tourSteps = [
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: 'Welcome to UGO AI Studio!',
    description: "Let's take a quick tour of the powerful features available to you. You can access all features from the sidebar.",
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'AI Autonomous Agents',
    description: 'Create and deploy intelligent agents that can plan, act, and use tools to achieve specific goals autonomously.',
  },
  {
    icon: <Workflow className="h-10 w-10 text-primary" />,
    title: 'AI Workflow Builder',
    description: 'Visually design and automate complex processes by chaining AI tools together in a simple drag-and-drop-style interface.',
  },
  {
    icon: <AppWindow className="h-10 w-10 text-primary" />,
    title: 'AI App & Website Generators',
    description: 'Describe an application or website, and let the AI generate the complete, production-ready source code for you in minutes.',
  },
  {
    icon: <Clapperboard className="h-10 w-10 text-primary" />,
    title: 'AI Video Generator',
    description: 'Transform text scripts into engaging videos with AI-powered presenters and automatic scene transitions.',
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: 'Knowledge Base Training',
    description: 'Train personalized AI models on your own documents and websites to create a custom knowledge base for your agents.',
  },
];

export function Tour() {
  const { isOpen, step, nextStep, prevStep, finish, close } = useTour();
  const currentStep = tourSteps[step];
  const isLastStep = step === tourSteps.length - 1;

  // This is a client component, so we can return null if it's not open.
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <DialogHeader className="items-center text-center">
          {currentStep.icon}
          <DialogTitle className="text-2xl font-bold">{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 py-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                step === index ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button variant="ghost" onClick={finish}>
              Skip
            </Button>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button onClick={isLastStep ? finish : nextStep}>
                {isLastStep ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
