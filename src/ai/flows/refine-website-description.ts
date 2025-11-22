'use server';

/**
 * @fileOverview Refines a user's website description into a more detailed prompt.
 *
 * - refineWebsiteDescription - A function that takes a basic idea and expands it.
 * - RefineWebsiteDescriptionInput - The input type for the function.
 * - RefineWebsiteDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineWebsiteDescriptionInputSchema = z.object({
  originalPrompt: z.string().describe('The user\'s initial, brief idea for a website.'),
});
export type RefineWebsiteDescriptionInput = z.infer<typeof RefineWebsiteDescriptionInputSchema>;

const RefineWebsiteDescriptionOutputSchema = z.object({
  refinedPrompt: z.string().describe('A detailed, well-structured prompt that the website generation AI can use to create a high-quality site.'),
});
export type RefineWebsiteDescriptionOutput = z.infer<typeof RefineWebsiteDescriptionOutputSchema>;

export async function refineWebsiteDescription(input: RefineWebsiteDescriptionInput): Promise<RefineWebsiteDescriptionOutput> {
  return refineWebsiteDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineWebsitePrompt',
  input: {schema: RefineWebsiteDescriptionInputSchema},
  output: {schema: RefineWebsiteDescriptionOutputSchema},
  prompt: `You are an expert prompt engineer and UX designer. A user has provided a brief idea for a website. Your task is to expand this idea into a detailed, structured prompt that our AI web developer can use to build a fantastic landing page.

User's Idea: "{{originalPrompt}}"

Take this idea and flesh it out. Think about the common sections a modern landing page should have. Your refined prompt should describe:
1.  **Hero Section**: A powerful headline, a brief subheading, and a primary call-to-action button.
2.  **Features Section**: At least three key features, each with a small icon/image suggestion, a title, and a short description.
3.  **Pricing Section**: A simple pricing table with 2-3 tiers (e.g., Free, Pro, Enterprise), listing a few key features for each.
4.  **Testimonials/Social Proof Section**: A place for customer quotes.
5.  **Footer**: Include links for things like "About", "Contact", and social media.

Generate a new, single-paragraph prompt that contains all these details. Be descriptive and clear.

Example:
If the user's idea is "a website for a new task management app", your output should be a single paragraph like:

"Create a modern and clean landing page for a new SaaS product called 'ZenTask'. The hero section should have the headline 'Achieve Peak Productivity with ZenTask' and a call-to-action button saying 'Get Started for Free'. Follow this with a features section highlighting three benefits: 'Smart Task Prioritization', 'Seamless Collaboration', and 'Insightful Analytics', each with an appropriate icon. Include a simple pricing section with three tiers: 'Basic (Free)', 'Pro ($10/mo)', and 'Business ($25/mo)'. Add a social proof section with a couple of customer testimonials. Finally, create a simple footer with links to Home, Features, Pricing, and social media icons."

Now, generate the refined prompt for the user's idea.
`,
});

const refineWebsiteDescriptionFlow = ai.defineFlow(
  {
    name: 'refineWebsiteDescriptionFlow',
    inputSchema: RefineWebsiteDescriptionInputSchema,
    outputSchema: RefineWebsiteDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
