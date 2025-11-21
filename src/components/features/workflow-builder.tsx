'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, GripVertical, Loader2, Plus, Trash2, Wand2, FileText, Image as ImageIcon, Lightbulb } from 'lucide-react';
import {
  designAutomatedAIWorkflows,
  DesignAutomatedAIWorkflowsInput,
  DesignAutomatedAIWorkflowsOutput,
} from '@/ai/flows/design-automated-ai-workflows';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const workflowBlockTypes = [
  'Generate Idea', 'Write Article', 'Create 1 Image', 'Create 3 Images', 'Create 5 Images'
];

interface WorkflowBlock {
  id: number;
  type: string;
}

const formSchema = z.object({
  workflowName: z.string().min(3, 'Workflow name is required.'),
  workflowDescription: z.string().min(10, 'Description is required.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WorkflowBuilderFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowBlocks, setWorkflowBlocks] = useState<WorkflowBlock[]>([]);
  const [result, setResult] = useState<DesignAutomatedAIWorkflowsOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { workflowName: 'Blog Post Automation', workflowDescription: 'A workflow that generates a blog post about the future of AI, writes an article, and creates a header image.' },
  });

  const addBlock = (type: string) => {
    setWorkflowBlocks(prev => [...prev, { id: Date.now(), type }]);
  };

  const removeBlock = (id: number) => {
    setWorkflowBlocks(prev => prev.filter(block => block.id !== id));
  };

  const onSubmit = async (data: FormData) => {
    if (workflowBlocks.length === 0) {
      toast({ variant: 'destructive', title: 'Workflow is empty', description: 'Please add at least one block to the workflow.' });
      return;
    }

    setIsLoading(true);
    setResult(null);
    const input: DesignAutomatedAIWorkflowsInput = {
      ...data,
      workflowBlocks: workflowBlocks.map(({ type }) => ({ type })),
    };

    try {
      const response = await designAutomatedAIWorkflows(input);
      setResult(response);
      toast({
        title: response.success ? 'Workflow Executed Successfully!' : 'Workflow Failed',
        description: response.message,
        variant: response.success ? 'default' : 'destructive',
        icon: response.success ? <Check className="h-5 w-5 text-green-500" /> : undefined,
      });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'An error occurred.', description: 'Failed to process workflow. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>1. Workflow Details</CardTitle>
              <CardDescription>Name and describe your new automation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflowName">Workflow Name</Label>
                <Controller name="workflowName" control={control} render={({ field }) => <Input id="workflowName" placeholder="e.g., Blog Post Automation" {...field} />} />
                {errors.workflowName && <p className="text-sm text-destructive">{errors.workflowName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflowDescription">Topic / Goal</Label>
                <Controller name="workflowDescription" control={control} render={({ field }) => <Textarea id="workflowDescription" placeholder="This workflow generates and publishes a weekly blog post." {...field} />} />
                {errors.workflowDescription && <p className="text-sm text-destructive">{errors.workflowDescription.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Run Workflow
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Add Blocks</CardTitle>
            <CardDescription>Click to add predefined actions to your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {workflowBlockTypes.map(type => (
              <Button key={type} variant="outline" size="sm" onClick={() => addBlock(type)}>
                <Plus className="mr-2 h-4 w-4" />
                {type}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Build Canvas</CardTitle>
            <CardDescription>Arrange and review your workflow steps.</CardDescription>
          </CardHeader>
          <CardContent>
            {workflowBlocks.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Your canvas is empty.</p>
                <p className="text-sm text-muted-foreground">Add blocks to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workflowBlocks.map((block, index) => (
                  <div key={block.id} className="group flex items-center gap-2 rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1 font-medium">{index + 1}. {block.type}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => removeBlock(block.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove block</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Workflow Output</CardTitle>
          <CardDescription>The results from your automated workflow will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 font-semibold">Workflow is running...</p>
                <p className="text-sm text-muted-foreground">The AI is performing the requested actions.</p>
              </div>
            </div>
          )}
          {result?.success && (
            <div className="space-y-6">
              {result.results.idea && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-400" />Generated Idea</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold">{result.results.idea.articleTitle}</p>
                    <p className="text-muted-foreground text-sm">{result.results.idea.idea}</p>
                  </CardContent>
                </Card>
              )}
               {result.results.images && result.results.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ImageIcon className="text-blue-400"/>Generated Images</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {result.results.images.map((img, index) => (
                      <div key={index} className="space-y-2">
                        <Image src={img.imageDataUri} alt={img.imagePrompt} width={400} height={400} className="rounded-lg aspect-square object-cover" />
                        <p className="text-xs text-muted-foreground italic truncate" title={img.imagePrompt}>Prompt: "{img.imagePrompt}"</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {result.results.article && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="text-green-400"/>Generated Article</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-secondary/50 p-4"
                      dangerouslySetInnerHTML={{ __html: result.results.article.article.replace(/\n/g, '<br />') }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Run a workflow to see results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    