'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";

const Cursors = () => {
  const [positions, setPositions] = useState<{ x: number, y: number, color: string, name: string }[]>([]);

  useEffect(() => {
    // Simulate cursor positions
    setPositions([
      { x: Math.random() * 80 + 10, y: Math.random() * 20 + 5, color: 'text-pink-500', name: 'Alice' },
      { x: Math.random() * 80 + 10, y: Math.random() * 30 + 30, color: 'text-blue-500', name: 'Bob' },
      { x: Math.random() * 80 + 10, y: Math.random() * 30 + 65, color: 'text-green-500', name: 'Charlie' }
    ]);
  }, []);

  return (
    <>
      {positions.map(p => (
        <div key={p.name} className="absolute transition-all duration-500" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <svg className={`h-5 w-5 ${p.color}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.2,3.3C4.2,3.3,4.2,3.3,4.2,3.3l15.5,15.5c0.6,0.6,0.6,1.5,0,2.1c-0.6,0.6-1.5,0.6-2.1,0L2.1,5.4 c-0.6-0.6-0.6-1.5,0-2.1C2.7,2.7,3.6,2.7,4.2,3.3z"/>
          </svg>
          <span className={`-mt-1 ml-2 rounded-full px-2 py-0.5 text-xs text-white ${p.color.replace('text-', 'bg-')}`}>{p.name}</span>
        </div>
      ))}
    </>
  );
};


export default function RealTimeCollabFeature() {
  const initialText = `UGO AI Studio Project Brief
===========================

Project Goal: Develop the next-generation AI-powered studio.

Key Features:
-------------
1.  **AI Autonomous Agents**: Agents that can think, act, and loop.
2.  **AI Workflow Builder**: Visual drag-and-drop automation.
3.  **AI App & Website Generators**: Instant code generation from text.
4.  **Real-Time Collaboration**: Google Docs-like editing experience.

This document is being edited in real-time.
`;

  return (
    <div className="grid h-full gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shared Document</CardTitle>
              <CardDescription>Multiple users can edit this document simultaneously.</CardDescription>
            </div>
            <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src="https://picsum.photos/seed/user2/40/40" />
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src="https://picsum.photos/seed/user3/40/40" />
                    <AvatarFallback>C</AvatarFallback>
                </Avatar>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg border">
            <Cursors />
            <Textarea
              className="min-h-[500px] border-0 bg-transparent font-mono"
              defaultValue={initialText}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>Live discussion about the document.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-7rem)] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src="https://picsum.photos/seed/user1/40/40" /><AvatarFallback>A</AvatarFallback></Avatar>
                    <div className="rounded-lg bg-secondary p-3 text-sm">
                        <p className="font-semibold">Alice</p>
                        <p>This looks great! Should we add a section for the AI Video Generator?</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8"><AvatarImage src="https://picsum.photos/seed/user2/40/40" /><AvatarFallback>B</AvatarFallback></Avatar>
                    <div className="rounded-lg bg-secondary p-3 text-sm">
                        <p className="font-semibold">Bob</p>
                        <p>Good idea. I'll add it under Key Features.</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Textarea placeholder="Add a comment..." className="min-h-[40px] flex-1 resize-none"/>
                <Button size="icon" className="h-10 w-10 shrink-0"><SendHorizonal className="h-4 w-4"/></Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
