
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI agent details.
 *
 * It allows users to input a topic and get a generated description, goals, and tasks for an AI agent.
 *
 * - generateAgentDetails - A function that generates agent details.
 * - GenerateAgentDetailsInput - The input type for the generateAgentDetails function.
 * - GenerateAgentDetailsOutput - The return type for the generateAgentDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateAgentDetailsInputSchema = z.object({
  topic: z.string().describe('The topic or idea for the AI agent.'),
});
export type GenerateAgentDetailsInput = z.infer<typeof GenerateAgentDetailsInputSchema>;

const GenerateAgentDetailsOutputSchema = z.object({
  agentName: z.string().describe("A concise and descriptive name for the agent."),
  agentDescription: z.string().describe('A detailed description of the AI agent and its purpose.'),
  agentGoals: z.string().describe('A newline-separated list of high-level goals for the AI agent to achieve.'),
  agentTasks: z.string().describe('A specific, numbered list of step-by-step tasks for the AI agent to perform to accomplish the goals.'),
});
export type GenerateAgentDetailsOutput = z.infer<typeof GenerateAgentDetailsOutputSchema>;


export async function generateAgentDetails(input: GenerateAgentDetailsInput): Promise<GenerateAgentDetailsOutput> {
  return generateAgentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentDetailsPrompt',
  input: {schema: GenerateAgentDetailsInputSchema},
  output: {schema: GenerateAgentDetailsOutputSchema},
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `
    You are an expert project manager specializing in AI-driven automation.
    A user has provided a topic for an autonomous agent. Your job is to break this down into a structured plan that the agent can follow.

    Topic: "{{topic}}"

    Based on this topic, please generate the following:
    1.  **agentName**: A short, descriptive name for this agent (e.g., "Social Media Content Agent", "Market Research Analyst").
    2.  **agentDescription**: A one-paragraph description of what this agent does.
    3.  **agentGoals**: A high-level, bulleted list of the primary objectives for the agent. This should be a newline-separated string.
    4.  **agentTasks**: A specific, numbered list of step-by-step tasks the agent needs to perform to achieve its goals. This should also be a newline-separated string.

    For example, if the topic is "Create a blog post about the benefits of solar energy", the output should look like:

    - agentName: "Solar Energy Blogger Agent"
    - agentDescription: "An autonomous agent that researches the benefits of solar energy, writes a comprehensive blog post on the topic, and creates a relevant header image for the article."
    - agentGoals: "Write a comprehensive blog post about the benefits of solar energy."
    - agentTasks: "1. Generate a blog post idea and title about solar energy.\n2. Write a full article based on the generated idea.\n3. Create one header image suitable for the article."

    Now, generate the details for the user's topic.
  `,
});

const generateAgentDetailsFlow = ai.defineFlow(
  {
    name: 'generateAgentDetailsFlow',
    inputSchema: GenerateAgentDetailsInputSchema,
    outputSchema: GenerateAgentDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
