
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
  html: z.string().describe('The full HTML code for the generated website body.'),
  css: z.string().describe('The CSS code for styling, using Tailwind CSS classes within a <style> tag.'),
  js: z.string().describe('The JavaScript code for any interactivity.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsite(input: GenerateWebsiteInput): Promise<GenerateWebsiteOutput> {
  return generateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  input: {schema: GenerateWebsiteInputSchema},
  output: {schema: GenerateWebsiteOutputSchema},
  prompt: `You are an expert web developer specializing in modern HTML, CSS, and JavaScript, with a deep knowledge of Tailwind CSS.

You will generate the code for a complete, production-ready, and responsive webpage based on the user's description.

Description: {{{description}}}

Guidelines:
1.  **Structure (HTML)**: Generate clean, semantic HTML for the body of the page. Do not include <html>, <head>, or <body> tags. The HTML should be ready to be placed inside a <body> tag. For images, use placeholder images from \`https://picsum.photos/seed/<seed>/<width>/<height>\`.
2.  **Styling (CSS)**: Generate a single <style> tag containing all necessary CSS. YOU MUST USE Tailwind CSS utility classes via the @apply directive. DO NOT use standard CSS properties. The website will have access to Tailwind.
3.  **Interactivity (JavaScript)**: Generate a single <script> tag containing any necessary JavaScript for interactivity (e.g., mobile menu toggles, simple animations). Keep it vanilla JavaScript. Do not use external libraries.
4.  **Completeness**: The generated code should be fully functional. Ensure all parts work together seamlessly.
5.  **Code Only**: Do not include any explanations, comments, or markdown formatting in your response. Return only the raw code for each field (html, css, js).

Return the HTML, CSS, and JavaScript in the format specified by the output schema.
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
    return output!;
  }
);
