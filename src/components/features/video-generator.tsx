'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Film, Loader2 } from 'lucide-react';
import {
  generateVideoFromText,
  GenerateVideoFromTextInput,
  GenerateVideoFromTextOutput,
} from '@/ai/flows/generate-video-from-text';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  text: z.string().min(20, 'Script must be at least 20 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function VideoGeneratorFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateVideoFromTextOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'A professional AI avatar presenting the key features of UGO AI Studio. Scene 1: Introduction to autonomous agents. Scene 2: A quick demo of the workflow builder. Final scene: A call to action to try the platform.',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);

    const input: GenerateVideoFromTextInput = data;

    try {
      const response = await generateVideoFromText(input);
      setResult(response);
      toast({
        title: 'Video Generation Complete!',
        description: 'Your video is ready to be previewed.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate video. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Video Generator</CardTitle>
          <CardDescription>Convert your text or script into a video with an AI presenter.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Video Script</Label>
              <Controller
                name="text"
                control={control}
                render={({ field }) => <Textarea id="text" placeholder="Enter your script here..." {...field} rows={12} />}
              />
              {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Video
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Video Preview</CardTitle>
          <CardDescription>The generated video will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg bg-secondary">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 font-semibold">Generating video...</p>
                <p className="text-sm text-muted-foreground">This may take up to a minute. Please be patient.</p>
                <Progress value={50} className="w-3/4 mt-4" />
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Film className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Your video preview will be shown here.</p>
              </div>
            )}
            {result && result.videoDataUri && (
              <video
                src={result.videoDataUri}
                controls
                className="h-full w-full rounded-lg"
                autoPlay
                loop
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
