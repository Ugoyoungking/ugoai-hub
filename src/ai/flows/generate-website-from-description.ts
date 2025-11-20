'use server';

/**
 * @fileOverview Generates a full, responsive website from a simple text description.
 *
 * - generateWebsite - A function that generates a website from a text description.
 * - GenerateWebsiteInput - The input type for the generateWebsite function.
 * - GenerateWebsiteOutput - The return type for the generateWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteInputSchema = z.object({
  description: z
    .string()
    .describe('A text description of the desired website, including its purpose and key features.'),
});
export type GenerateWebsiteInput = z.infer<typeof GenerateWebsiteInputSchema>;

const GenerateWebsiteOutputSchema = z.object({
  code: z
    .string()
    .describe('The full, responsive Next.js code for the generated website.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsite(input: GenerateWebsiteInput): Promise<GenerateWebsiteOutput> {
  return generateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  input: {schema: GenerateWebsiteInputSchema},
  output: {schema: GenerateWebsiteOutputSchema},
  prompt: `You are an expert web developer specializing in Next.js.

You will generate a full, responsive website based on the user's description.

Description: {{{description}}}

Make sure the code is well-structured, easy to understand, and ready to be deployed to Vercel.

Return only the code. Do not include any explanations. Enclose the code in a markdown code block with the language set to jsx. Also, if there are any images used in the code, use placeholder images from public URLs.
`,
});

const generateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateWebsiteFlow',
    inputSchema: GenerateWebsiteInputSchema,
    outputSchema: GenerateWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {code: output!.code!};
  }
);
