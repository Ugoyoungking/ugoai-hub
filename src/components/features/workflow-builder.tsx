'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, GripVertical, Loader2, Plus, Trash2, Wand2 } from 'lucide-react';
import {
  designAutomatedAIWorkflows,
  DesignAutomatedAIWorkflowsInput,
} from '@/ai/flows/design-automated-ai-workflows';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const workflowBlockTypes = [
  'Generate Idea', 'Write Article', 'Create 5 Images', 'Make Social Captions', 'Export PDF', 'Post to Instagram/Twitter'
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
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { workflowName: '', workflowDescription: '' },
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
    const input: DesignAutomatedAIWorkflowsInput = {
      ...data,
      workflowBlocks: workflowBlocks.map(({ type }) => ({ type })),
    };

    try {
      const response = await designAutomatedAIWorkflows(input);
      toast({
        title: response.success ? 'Workflow Design Validated' : 'Workflow Design Issue',
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
          <CardDescription>Name and describe your new automation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflowName">Workflow Name</Label>
            <Controller name="workflowName" control={control} render={({ field }) => <Input id="workflowName" placeholder="e.g., Blog Post Automation" {...field} />} />
            {errors.workflowName && <p className="text-sm text-destructive">{errors.workflowName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="workflowDescription">Description</Label>
            <Controller name="workflowDescription" control={control} render={({ field }) => <Textarea id="workflowDescription" placeholder="This workflow generates and publishes a weekly blog post." {...field} />} />
            {errors.workflowDescription && <p className="text-sm text-destructive">{errors.workflowDescription.message}</p>}
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Available Blocks</Label>
            <div className="flex flex-wrap gap-2">
              {workflowBlockTypes.map(type => (
                <Button key={type} variant="outline" size="sm" onClick={() => addBlock(type)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Workflow
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Workflow Canvas</CardTitle>
          <CardDescription>Add and arrange blocks to build your automation.</CardDescription>
        </CardHeader>
        <CardContent>
          {workflowBlocks.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
              <Wand2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your workflow is empty.</p>
              <p className="text-sm text-muted-foreground">Click on the blocks to the left to add them here.</p>
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
    </form>
  );
}
