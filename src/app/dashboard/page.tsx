
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Workflow, AppWindow, LayoutTemplate, Clapperboard, BookOpen, Users } from "lucide-react";
import Link from "next/link";

const features = [
  { href: '/dashboard/ai-agents', icon: BrainCircuit, label: 'AI Autonomous Agents', description: 'Deploy intelligent agents to achieve goals.' },
  { href: '/dashboard/workflow-builder', icon: Workflow, label: 'AI Workflow Builder', description: 'Visually design complex automations.' },
  { href: '/dashboard/app-generator', icon: AppWindow, label: 'AI App Generator', description: 'Generate full-stack apps from text.' },
  { href: '/dashboard/website-builder', icon: LayoutTemplate, label: 'AI Website Builder', description: 'Create responsive websites in minutes.' },
  { href: '/dashboard/video-generator', icon: Clapperboard, label: 'AI Video Generator', description: 'Turn scripts into engaging videos.' },
  { href: '/dashboard/knowledge-base', icon: BookOpen, label: 'Knowledge Base Training', description: 'Train AI on your own documents.' },
  { href: '/dashboard/real-time-collab', icon: Users, label: 'Real-Time Collaboration', description: 'Work together in a shared environment.' },
];

export default function DashboardPage() {
    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-2">Welcome to UGO AI Studio</h1>
                <p className="text-muted-foreground">Select a feature below to get started on your next project.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                     <Card key={feature.href} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                           <feature.icon className="h-8 w-8 text-primary" />
                           <CardTitle>{feature.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={feature.href}>Launch</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
