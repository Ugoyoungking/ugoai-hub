'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating and managing automated AI agents.
 *
 * It allows users to define agents that can plan tasks, perform actions, and loop continuously to complete goals, enabling multi-agent collaboration.
 *
 * - createAutomatedAIAgent - A function that handles the creation and management of automated AI agents.
 * - CreateAutomatedAIAgentInput - The input type for the createAutomatedAIAgent function.
 * - CreateAutomatedAIAgentOutput - The return type for the createAutomatedAIAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateAutomatedAIAgentInputSchema = z.object({
  agentName: z.string().describe('The name of the AI agent.'),
  agentDescription: z.string().describe('A detailed description of the AI agent and its purpose.'),
  agentGoals: z.array(z.string()).describe('A list of goals for the AI agent to achieve.'),
  agentTasks: z.array(z.string()).describe('A list of tasks for the AI agent to perform.'),
  multiAgentCollaborationInstructions: z.string().optional().describe('Instructions for multi-agent collaboration, if applicable.'),
});
export type CreateAutomatedAIAgentInput = z.infer<typeof CreateAutomatedAIAgentInputSchema>;

const CreateAutomatedAIAgentOutputSchema = z.object({
  agentStatus: z.string().describe('The current status of the AI agent (e.g., planning, executing, completed).'),
  agentActions: z.array(z.string()).describe('A list of actions the AI agent has performed or will perform.'),
  agentResults: z.string().describe('A summary of the results achieved by the AI agent.'),
});
export type CreateAutomatedAIAgentOutput = z.infer<typeof CreateAutomatedAIAgentOutputSchema>;

export async function createAutomatedAIAgent(input: CreateAutomatedAIAgentInput): Promise<CreateAutomatedAIAgentOutput> {
  return createAutomatedAIAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createAutomatedAIAgentPrompt',
  input: {schema: CreateAutomatedAIAgentInputSchema},
  output: {schema: CreateAutomatedAIAgentOutputSchema},
  prompt: `You are an AI agent manager responsible for creating and managing automated AI agents.

  Based on the provided description, goals, and tasks, define the agent's status, planned actions, and expected results.

  Agent Name: {{{agentName}}}
  Agent Description: {{{agentDescription}}}
  Agent Goals: {{#each agentGoals}}{{{this}}}\n{{/each}}
  Agent Tasks: {{#each agentTasks}}{{{this}}}\n{{/each}}

  {{#if multiAgentCollaborationInstructions}}Multi-Agent Collaboration Instructions: {{{multiAgentCollaborationInstructions}}}\n{{/if}}

  Consider the agent's ability to think, act, and loop continuously until the goals are achieved.
  If multi-agent collaboration is required, coordinate with other agents to accomplish the tasks efficiently.

  Output the agentStatus, agentActions, and agentResults in a structured format.
`,
});

const createAutomatedAIAgentFlow = ai.defineFlow(
  {
    name: 'createAutomatedAIAgentFlow',
    inputSchema: CreateAutomatedAIAgentInputSchema,
    outputSchema: CreateAutomatedAIAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
