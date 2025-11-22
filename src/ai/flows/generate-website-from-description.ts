
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
  html: z.string().describe('The full HTML code for the generated website body. It should be a single block of HTML with Tailwind CSS classes directly embedded in the elements. Do not include <html>, <head>, or <body> tags.'),
  js: z.string().describe('The JavaScript code for any interactivity, enclosed within a single <script> tag.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsite(input: GenerateWebsiteInput): Promise<GenerateWebsiteOutput> {
  return generateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  input: {schema: GenerateWebsiteInputSchema},
  output: {schema: z.object({ html: GenerateWebsiteOutputSchema.shape.html, js: GenerateWebsiteOutputSchema.shape.js })},
  prompt: `You are an expert web developer specializing in modern HTML and Tailwind CSS.

You will generate the code for a complete, production-ready, and responsive webpage based on the user's description.

Description: {{{description}}}

Guidelines:
1.  **Structure (HTML)**: Generate clean, semantic HTML for the body of the page.
    -   You MUST use Tailwind CSS utility classes directly within the HTML elements for all styling.
    -   Do NOT generate any <style> tags or CSS code. All styling must be inline Tailwind classes.
    -   Do not include <html>, <head>, or <body> tags. The HTML should be ready to be placed inside a <body> tag.
    -   For images, use placeholder images from \`https://picsum.photos/seed/<seed>/<width>/<height>\`. Use a unique seed for each image.
2.  **Interactivity (JavaScript)**: Generate a single <script> tag containing any necessary vanilla JavaScript for interactivity (e.g., mobile menu toggles, simple animations). Do not use external libraries.
3.  **Completeness**: The generated code should be fully functional. Ensure all parts work together seamlessly.
4.  **Code Only**: Do not include any explanations, comments, or markdown formatting in your response. Return only the raw code for each field (html, js).

Return the HTML and JavaScript in the format specified by the output schema.
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
    // Ensure css is an empty string as it's no longer generated
    return { ...output!, css: '' };
  }
);
