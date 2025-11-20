'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  generateAppCode,
  GenerateAppCodeInput,
  GenerateAppCodeOutput,
} from '@/ai/flows/generate-app-from-description';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CodeBlock } from '@/components/code-block';

const frameworks = ['Next.js', 'React Native', 'Flutter', 'Node.js'] as const;

const formSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  framework: z.enum(frameworks),
});

type FormData = z.infer<typeof formSchema>;

export default function AppGeneratorFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAppCodeOutput | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      framework: 'Next.js',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);

    const input: GenerateAppCodeInput = data;

    try {
      const response = await generateAppCode(input);
      setResult(response);
      toast({
        title: 'App Code Generated!',
        description: `Your ${data.framework} application is ready.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate app code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate an Application</CardTitle>
          <CardDescription>Describe the app you want to build, and the AI will generate the code for you.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">App Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" placeholder="e.g., A simple weather app that shows the current temperature and forecast for a given city." {...field} rows={8} />}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Controller
                name="framework"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map(fw => <SelectItem key={fw} value={fw}>{fw}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.framework && <p className="text-sm text-destructive">{errors.framework.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate App
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="h-full min-h-[500px]">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-semibold">Generating your application...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
            </div>
          </div>
        )}
        {result && (
          <Tabs defaultValue="code" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="code">Source Code</TabsTrigger>
              <TabsTrigger value="ui">UI Files</TabsTrigger>
              <TabsTrigger value="api">API Routes</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden rounded-b-lg border border-t-0">
              <TabsContent value="code" className="h-full overflow-auto p-0 m-0">
                <CodeBlock code={result.code} className="h-full rounded-none border-none" />
              </TabsContent>
              <TabsContent value="ui" className="h-full overflow-auto p-0 m-0">
                <CodeBlock code={result.uiFiles} className="h-full rounded-none border-none" />
              </TabsContent>
              <TabsContent value="api" className="h-full overflow-auto p-0 m-0">
                <CodeBlock code={result.apiRoutes} className="h-full rounded-none border-none" />
              </TabsContent>
              <TabsContent value="instructions" className="p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.instructions.replace(/\n/g, '<br />') }} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
