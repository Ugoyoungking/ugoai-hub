'use server';

/**
 * @fileOverview Generates application code from a text description.
 *
 * - generateAppCode - A function that generates application code based on a description.
 * - GenerateAppCodeInput - The input type for the generateAppCode function.
 * - GenerateAppCodeOutput - The return type for the generateAppCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppCodeInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the application to generate.'),
  framework: z
    .enum(['Next.js', 'React Native', 'Flutter', 'Node.js'])
    .describe('The target framework for the generated application.'),
});
export type GenerateAppCodeInput = z.infer<typeof GenerateAppCodeInputSchema>;

const GenerateAppCodeOutputSchema = z.object({
  code: z
    .string()
    .describe('The generated source code for the application.'),
  uiFiles: z.string().describe('The generated UI files for the application.'),
  apiRoutes: z.string().describe('The generated API routes for the application.'),
  instructions: z
    .string()
    .describe('Instructions on how to run the generated application.'),
});
export type GenerateAppCodeOutput = z.infer<typeof GenerateAppCodeOutputSchema>;

export async function generateAppCode(input: GenerateAppCodeInput): Promise<GenerateAppCodeOutput> {
  return generateAppCodeFlow(input);
}

const generateAppCodePrompt = ai.definePrompt({
  name: 'generateAppCodePrompt',
  input: {schema: GenerateAppCodeInputSchema},
  output: {schema: GenerateAppCodeOutputSchema},
  prompt: `You are an expert software architect who can generate the code for an entire application based on a text description.

  Based on the following description:
  {{description}}

  Generate code for the {{framework}} framework.

  Return the full source code, UI files, API routes, and instructions on how to run the generated application in the format specified by the output schema.
  Ensure that the generated code is complete and runnable.
  Follow best practices for the specified framework.
  Keep the application simple, but complete, favouring simple implementations of the described architecture.
  Assume any external resources are available in the indicated architecture.
`,
});

const generateAppCodeFlow = ai.defineFlow(
  {
    name: 'generateAppCodeFlow',
    inputSchema: GenerateAppCodeInputSchema,
    outputSchema: GenerateAppCodeOutputSchema,
  },
  async input => {
    const {output} = await generateAppCodePrompt(input);
    return output!;
  }
);
