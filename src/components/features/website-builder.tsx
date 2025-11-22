
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Loader2, Sparkles } from 'lucide-react';
import {
  generateWebsite,
  GenerateWebsiteInput,
  GenerateWebsiteOutput,
} from '@/ai/flows/generate-website-from-description';
import {
  refineWebsiteDescription,
  RefineWebsiteDescriptionOutput
} from '@/ai/flows/refine-website-description';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CodeBlock } from '@/components/code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;
type StoredWebsite = GenerateWebsiteOutput & { description: string };

const LOCAL_STORAGE_KEY = 'ai-generated-website';

export default function WebsiteBuilderFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [result, setResult] = useState<GenerateWebsiteOutput | null>(null);
  const [followUp, setFollowUp] = useState('');
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedWebsiteRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedWebsiteRaw) {
            try {
                const savedWebsite: StoredWebsite = JSON.parse(savedWebsiteRaw);
                setResult({ html: savedWebsite.html, css: savedWebsite.css, js: savedWebsite.js });
                setValue('description', savedWebsite.description);
                toast({ title: 'Loaded your last session.' });
            } catch (error) {
                console.error("Failed to parse saved website from localStorage", error);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        } else {
             setValue('description', 'A modern landing page for a new SaaS product called "FlowState". It should have a hero section with a call-to-action, a features section with three key benefits, a pricing section with three tiers, and a simple footer.');
        }
    }
  }, [setValue, toast]);

  const handleGeneration = async (currentDescription: string) => {
     setIsLoading(true);
     setResult(null);

    const input: GenerateWebsiteInput = {
        description: currentDescription,
    };

    try {
      const response = await generateWebsite(input);
      setResult(response);
      toast({
        title: 'Website Generated!',
        description: 'Your website code is ready.',
      });
      
      if (typeof window !== 'undefined') {
          const dataToStore: StoredWebsite = { ...response, description: currentDescription };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      }
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

  const onSubmit = (data: FormData) => {
    handleGeneration(data.description);
  };
  
  const handleRefinePrompt = async () => {
    const currentDescription = getValues('description');
    if (!currentDescription) {
        toast({ variant: 'destructive', title: 'Description is empty', description: 'Please enter a description to refine.' });
        return;
    }
    setIsRefining(true);
    try {
        const response: RefineWebsiteDescriptionOutput = await refineWebsiteDescription({ originalPrompt: currentDescription });
        setValue('description', response.refinedPrompt);
        toast({ title: 'Prompt Refined!', description: 'Your website description has been enhanced by AI.' });
    } catch(error) {
        console.error('Error refining prompt:', error);
        toast({ variant: 'destructive', title: 'Refinement Failed', description: 'Could not refine the prompt. Please try again.'});
    } finally {
        setIsRefining(false);
    }
  };
  
  const downloadCode = () => {
    if (!result) return;
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${result.html}
        ${result.js}
      </body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewSrcDoc = result ? `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-background">
      ${result.html}
      ${result.js}
    </body>
    </html>
  ` : '';

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Website Builder</CardTitle>
            <CardDescription>Describe your website, and the AI will generate the HTML, CSS, and JavaScript for you.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2 h-full flex flex-col">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Website Description</Label>
                   <Button type="button" variant="outline" size="sm" onClick={handleRefinePrompt} disabled={isRefining || isLoading}>
                        {isRefining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate with AI
                    </Button>
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea id="description" placeholder="e.g., A landing page for my new cooking business..." {...field} className="flex-1" rows={10}/>}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" disabled={isLoading || isRefining}>
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
      </div>
      
      <div className="flex flex-col h-full min-h-[600px]">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Building your website...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {result && !isLoading ? (
          <Tabs defaultValue="preview" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden rounded-b-lg border border-t-0 relative">
              <TabsContent value="preview" className="h-full m-0">
                 <iframe
                    srcDoc={previewSrcDoc}
                    title="Website Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
              </TabsContent>
              <TabsContent value="html" className="h-full overflow-auto m-0 p-0">
                <CodeBlock code={result.html} language="html" className="h-full rounded-none border-none" />
              </TabsContent>
              <TabsContent value="js" className="h-full overflow-auto m-0 p-0">
                 <CodeBlock code={result.js} language="javascript" className="h-full rounded-none border-none" />
              </TabsContent>
            </div>
          </Tabs>
        ) : !isLoading && (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your generated website will appear here.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
