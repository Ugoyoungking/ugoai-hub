'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Loader2 } from 'lucide-react';
import {
  generateWebsite,
  GenerateWebsiteInput,
  GenerateWebsiteOutput,
} from '@/ai/flows/generate-website-from-description';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CodeBlock } from '@/components/code-block';

const formSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteBuilderFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateWebsiteOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: 'A modern landing page for a new SaaS product called "FlowState". It should have a hero section with a call-to-action, a features section with three key benefits, a pricing section with three tiers, and a simple footer.',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);

    const input: GenerateWebsiteInput = data;

    try {
      const response = await generateWebsite(input);
      setResult(response);
      toast({
        title: 'Website Generated!',
        description: 'Your Next.js website code is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate website. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadCode = () => {
    if (!result) return;
    const blob = new Blob([result.code], { type: 'text/jsx;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.jsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Website Builder</CardTitle>
          <CardDescription>Describe your website, and the AI will generate a ready-to-deploy Next.js page.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          <CardContent className="flex-1 space-y-4">
            <div className="space-y-2 h-full flex flex-col">
              <Label htmlFor="description">Website Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" placeholder="e.g., A landing page for my new cooking business..." {...field} className="flex-1" />}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Website
            </Button>
            {result && (
              <Button variant="outline" onClick={downloadCode}>
                <Download className="mr-2 h-4 w-4" />
                Download Code
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      <div className="flex flex-col h-full min-h-[500px]">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Building your website...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {result && (
           <div className="flex-1 overflow-auto">
             <CodeBlock code={result.code} language="jsx" className="h-full" />
           </div>
        )}
         {!isLoading && !result && (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your generated website code will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
