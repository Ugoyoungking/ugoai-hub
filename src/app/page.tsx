'use client';

import { useState } from 'react';
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

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';

import AiAgentsFeature from '@/components/features/ai-agents';
import WorkflowBuilderFeature from '@/components/features/workflow-builder';
import AppGeneratorFeature from '@/components/features/app-generator';
import RealTimeCollabFeature from '@/components/features/real-time-collab';
import VideoGeneratorFeature from '@/components/features/video-generator';
import WebsiteBuilderFeature from '@/components/features/website-builder';
import KnowledgeBaseFeature from '@/components/features/knowledge-base';

type Feature =
  | 'home'
  | 'agents'
  | 'workflow'
  | 'app-generator'
  | 'collaboration'
  | 'video-generator'
  | 'website-builder'
  | 'knowledge-base';

const featureComponents: Record<Feature, React.ComponentType> = {
  home: WelcomeScreen,
  agents: AiAgentsFeature,
  workflow: WorkflowBuilderFeature,
  'app-generator': AppGeneratorFeature,
  collaboration: RealTimeCollabFeature,
  'video-generator': VideoGeneratorFeature,
  'website-builder': WebsiteBuilderFeature,
  'knowledge-base': KnowledgeBaseFeature,
};

const featureInfo = {
  home: { title: 'Welcome to UGO AI Studio', icon: Rocket },
  agents: { title: 'AI Autonomous Agents', icon: BrainCircuit },
  workflow: { title: 'AI Workflow Builder', icon: Workflow },
  'app-generator': { title: 'AI App Generator', icon: AppWindow },
  collaboration: { title: 'Real-Time Collaboration', icon: Users },
  'video-generator': { title: 'AI Video Generator', icon: Clapperboard },
  'website-builder': { title: 'AI Website Builder', icon: LayoutTemplate },
  'knowledge-base': { title: 'Knowledge Base Training', icon: BookOpen },
};

function WelcomeScreen() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">UGO AI Studio</h1>
        <p className="text-muted-foreground mt-2">Select a feature from the sidebar to begin.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<Feature>('home');

  const ActiveComponent = featureComponents[activeFeature];
  const activeInfo = featureInfo[activeFeature];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <Logo className="size-8 text-primary" />
            <span className="font-headline text-lg font-semibold">UGO AI Studio</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {Object.keys(featureInfo).map((key) => {
              if (key === 'home') return null;
              const featureKey = key as Feature;
              const { title, icon: Icon } = featureInfo[featureKey];
              return (
                <SidebarMenuItem key={featureKey}>
                  <SidebarMenuButton
                    onClick={() => setActiveFeature(featureKey)}
                    isActive={activeFeature === featureKey}
                    tooltip={{ children: title, side: 'right' }}
                  >
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-medium">User</span>
              <span className="text-muted-foreground text-xs">user@example.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3">
            <activeInfo.icon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{activeInfo.title}</h2>
          </div>
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-6">
          <ActiveComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
