'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  createAutomatedAIAgent,
  CreateAutomatedAIAgentInput,
  CreateAutomatedAIAgentOutput,
} from '@/ai/flows/create-automated-ai-agent';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  agentName: z.string().min(3, 'Agent name must be at least 3 characters.'),
  agentDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  agentGoals: z.string().min(1, 'At least one goal is required.'),
  agentTasks: z.string().min(1, 'At least one task is required.'),
  multiAgentCollaborationInstructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AiAgentsFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreateAutomatedAIAgentOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: '',
      agentDescription: '',
      agentGoals: '',
      agentTasks: '',
      multiAgentCollaborationInstructions: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);

    const input: CreateAutomatedAIAgentInput = {
      ...data,
      agentGoals: data.agentGoals.split('\n').filter(g => g.trim() !== ''),
      agentTasks: data.agentTasks.split('\n').filter(t => t.trim() !== ''),
    };

    try {
      const response = await createAutomatedAIAgent(input);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to create AI agent. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create an Autonomous Agent</CardTitle>
          <CardDescription>Define the agent's purpose, goals, and tasks. It will plan and execute to achieve them.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Controller
                name="agentName"
                control={control}
                render={({ field }) => <Input id="agentName" placeholder="e.g., Content Creation Bot" {...field} />}
              />
              {errors.agentName && <p className="text-sm text-destructive">{errors.agentName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentDescription">Agent Description</Label>
              <Controller
                name="agentDescription"
                control={control}
                render={({ field }) => <Textarea id="agentDescription" placeholder="A bot that researches topics, writes articles, and generates images." {...field} />}
              />
              {errors.agentDescription && <p className="text-sm text-destructive">{errors.agentDescription.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentGoals">Goals (one per line)</Label>
              <Controller
                name="agentGoals"
                control={control}
                render={({ field }) => <Textarea id="agentGoals" placeholder="- Write a comprehensive article about AI\n- Post it to the company blog" {...field} />}
              />
              {errors.agentGoals && <p className="text-sm text-destructive">{errors.agentGoals.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="agentTasks">Tasks (one per line)</Label>
              <Controller
                name="agentTasks"
                control={control}
                render={({ field }) => <Textarea id="agentTasks" placeholder="- Research current trends in AI\n- Draft an article outline" {...field} />}
              />
              {errors.agentTasks && <p className="text-sm text-destructive">{errors.agentTasks.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="multiAgentCollaborationInstructions">Collaboration Instructions (Optional)</Label>
              <Controller
                name="multiAgentCollaborationInstructions"
                control={control}
                render={({ field }) => <Textarea id="multiAgentCollaborationInstructions" placeholder="e.g., Work with Designer Agent to get images for the article." {...field} />}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Agent
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
              <CardDescription>The agent is now active and executing its plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <p className="font-semibold capitalize">{result.agentStatus}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Planned Actions</Label>
                <ul className="list-disc space-y-1 rounded-md border bg-secondary/50 p-4 pl-8">
                  {result.agentActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Summary of Results</Label>
                <p className="rounded-md border bg-secondary/50 p-4">{result.agentResults}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
