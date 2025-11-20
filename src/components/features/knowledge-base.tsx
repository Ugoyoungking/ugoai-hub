'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Globe, Link, Loader2, Plus, Trash2 } from 'lucide-react';
import {
  trainAIModel,
  TrainAIModelInput,
  TrainAIModelOutput,
} from '@/ai/flows/train-ai-model-from-knowledge-base';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const formSchema = z.object({
  documents: z.array(z.object({ value: z.string().min(1, 'Document name cannot be empty.') })),
  websites: z.array(z.object({ value: z.string().url('Please enter a valid URL.') })),
});

type FormData = z.infer<typeof formSchema>;

export default function KnowledgeBaseFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrainAIModelOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [{ value: 'Q3_Financial_Report.pdf' }],
      websites: [{ value: 'https://www.example.com/about' }],
    },
  });

  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({ control, name: 'documents' });
  const { fields: webFields, append: appendWeb, remove: removeWeb } = useFieldArray({ control, name: 'websites' });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);

    const input: TrainAIModelInput = {
      // MOCK: In a real app, you'd handle file uploads and convert to data URIs.
      documentDataUris: data.documents.map(d => `data:application/octet-stream;base64,${btoa('mock file content for ' + d.value)}`),
      websiteUrls: data.websites.map(w => w.value),
    };

    try {
      const response = await trainAIModel(input);
      setResult(response);
      toast({
        title: 'Model Training Started!',
        description: 'Your personalized AI model is now being trained.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to start model training. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Train a Custom AI Model</CardTitle>
            <CardDescription>Upload documents and add websites to create a personalized knowledge base for your AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="documents">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="websites">Websites</TabsTrigger>
              </TabsList>
              <TabsContent value="documents" className="mt-4 space-y-4">
                <Label>Documents</Label>
                <p className="text-sm text-muted-foreground">Simulating file uploads. Enter document names.</p>
                {docFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <Input {...register(`documents.${index}.value`)} placeholder="document.pdf" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                {errors.documents && <p className="text-sm text-destructive">Please check your document entries.</p>}
                <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ value: '' })}><Plus className="mr-2 h-4 w-4" /> Add Document</Button>
              </TabsContent>
              <TabsContent value="websites" className="mt-4 space-y-4">
                <Label>Website URLs</Label>
                {webFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input {...register(`websites.${index}.value`)} placeholder="https://www.example.com" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeWeb(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                {errors.websites && <p className="text-sm text-destructive">Please enter valid URLs.</p>}
                <Button type="button" variant="outline" size="sm" onClick={() => appendWeb({ value: '' })}><Plus className="mr-2 h-4 w-4" /> Add Website</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Training
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Status</CardTitle>
            <CardDescription>Monitor the progress of your AI model training.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center rounded-lg border border-dashed p-10">
                <div className="text-center">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 font-semibold">Training in progress...</p>
                  <p className="text-sm text-muted-foreground">Processing knowledge sources.</p>
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className="font-semibold capitalize text-green-500">{result.modelTrainingStatus}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Model ID</Label>
                  <p className="flex items-center gap-2 rounded-md border bg-secondary/50 p-2 font-mono text-sm">
                    <Link className="h-4 w-4"/>
                    {result.modelId}
                  </p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
                 <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Training status will appear here.</p>
                 </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
