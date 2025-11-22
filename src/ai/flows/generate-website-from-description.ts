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
  prompt: `You are an expert web developer specializing in Next.js, React, and Tailwind CSS.

You will generate a single, complete, and production-ready Next.js page component based on the user's description.

Description: {{{description}}}

Guidelines:
1.  **Frameworks**: Use Next.js with React. The component should be a Server Component by default ('use client' should only be used if client-side interactivity is absolutely necessary).
2.  **Styling**: Use Tailwind CSS for all styling. Use utility classes extensively. Do NOT use inline styles or CSS files.
3.  **Components**: You may use standard HTML elements (div, h1, p, etc.) and Next.js components like \`next/image\` and \`next/link\`. Do NOT use components that are not part of the standard library (e.g. from ShadCN UI library), as the generated code should be self-contained.
4.  **Icons**: If icons are needed, use an inline SVG. Do not import from a library.
5.  **Images**: For images, use placeholder images from \`https://picsum.photos/seed/<seed>/<width>/<height>\`. Example: \`https://picsum.photos/seed/picsum/800/600\`.
6.  **Code Structure**: The code must be a single, self-contained JSX component. It should not export multiple components. Ensure all JSX is valid and there is a single root element. Do not include any explanations, comments, or markdown formatting in your response. Return only the raw JSX code.
7.  **Completeness**: The generated code should be a complete page, ready to be saved as a \`.tsx\` file and used in a Next.js project. It must start with the component definition (e.g., \`export default function MyPage() { ... }\`).

Return only the code.
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
