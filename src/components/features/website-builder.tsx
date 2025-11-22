
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Loader2 } from 'lucide-react';
import {
  generateWebsite,
  GenerateWebsiteInput,
  GenerateWebsiteOutput,
} from '@/ai/flows/generate-website-from-description';
import { saveWebsite, getLatestWebsite, WebsiteData } from '@/lib/firebase/firestore/websites';
import { useAuth } from '@/hooks/use-auth';

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

export default function WebsiteBuilderFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateWebsiteOutput | null>(null);
  const [followUp, setFollowUp] = useState('');
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const latestWebsite = await getLatestWebsite(user.uid);
          if (latestWebsite) {
            setResult({ html: latestWebsite.html, css: latestWebsite.css, js: latestWebsite.js });
            setValue('description', latestWebsite.description);
            toast({ title: 'Loaded your last session.' });
          } else {
             setValue('description', 'A modern landing page for a new SaaS product called "FlowState". It should have a hero section with a call-to-action, a features section with three key benefits, a pricing section with three tiers, and a simple footer.');
          }
        } catch (error) {
          console.error("Failed to load previous website", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading, setValue, toast]);


  const handleGeneration = async (currentDescription: string) => {
     setIsLoading(true);
     if(followUp) {
        // If there's a follow-up, we don't clear the previous result immediately
     } else {
        setResult(null);
     }

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
      if (user) {
        await saveWebsite(user.uid, currentDescription, response);
        toast({ title: 'Your work has been saved.' });
      }
      setFollowUp(''); // Clear follow-up after successful generation
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
  
  const handleFollowUp = () => {
    if (!followUp) return;
    if (!result) {
        toast({variant: 'destructive', title: 'Generate a website first', description: 'You need an existing website to make changes.'});
        return;
    }
    const newDescription = `
      PREVIOUS WEBSITE:
      HTML: ${result.html}
      CSS: ${result.css}
      JS: ${result.js}

      USER'S MODIFICATION REQUEST:
      ${followUp}

      Please generate the new, complete HTML, CSS, and JS based on this modification request.
    `;
    handleGeneration(newDescription);
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
        ${result.css}
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
      ${result.css}
    </head>
    <body>
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
                <Label htmlFor="description">Website Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea id="description" placeholder="e.g., A landing page for my new cooking business..." {...field} className="flex-1" rows={8}/>}
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
        
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Refine your Website</CardTitle>
              <CardDescription>Enter a follow-up instruction to modify the generated website.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Textarea 
                  placeholder="e.g., 'Change the primary color to blue' or 'Add a testimonials section'"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleFollowUp} disabled={isLoading || !followUp}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Refine'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex flex-col h-full min-h-[600px]">
        {isLoading && !result && ( // Only show this big loader on initial generation
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Building your website...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {result ? (
          <Tabs defaultValue="preview" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JS</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden rounded-b-lg border border-t-0 relative">
               {isLoading && ( // Small overlay loader for refinements
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                         <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
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
              <TabsContent value="css" className="h-full overflow-auto m-0 p-0">
                 <CodeBlock code={result.css} language="css" className="h-full rounded-none border-none" />
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
