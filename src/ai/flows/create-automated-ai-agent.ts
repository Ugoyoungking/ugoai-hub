
'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating and managing automated AI agents.
 *
 * It allows users to define agents that can plan tasks, perform actions, and use tools to complete goals.
 *
 * - createAutomatedAIAgent - A function that handles the creation and management of automated AI agents.
 * - CreateAutomatedAIAgentInput - The input type for the createAutomatedAIAgent function.
 * - CreateAutomatedAIAgentOutput - The return type for the createAutomatedAIAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  writeArticleTool,
  generateIdeaTool,
  createImageTool
} from './design-automated-ai-workflows';
import { googleAI } from '@genkit-ai/google-genai';

const CreateAutomatedAIAgentInputSchema = z.object({
  agentName: z.string().describe('The name of the AI agent.'),
  agentDescription: z.string().describe('A detailed description of the AI agent and its purpose.'),
  agentGoals: z.array(z.string()).describe('A list of goals for the AI agent to achieve.'),
  agentTasks: z.array(z.string()).describe('A list of tasks for the AI agent to perform.'),
});
export type CreateAutomatedAIAgentInput = z.infer<typeof CreateAutomatedAIAgentInputSchema>;

const CreateAutomatedAIAgentOutputSchema = z.object({
  agentStatus: z.string().describe('The final status of the AI agent (e.g., completed, failed).'),
  agentActions: z.array(z.string()).describe('A log of actions the AI agent performed.'),
  agentResults: z.string().describe('A summary of the final results achieved by the AI agent.'),
});
export type CreateAutomatedAIAgentOutput = z.infer<typeof CreateAutomatedAIAgentOutputSchema>;

export async function createAutomatedAIAgent(input: CreateAutomatedAIAgentInput): Promise<CreateAutomatedAIAgentOutput> {
  return createAutomatedAIAgentFlow(input);
}

// This is the "master" tool that the agent flow will call.
// It has access to all other tools and decides which ones to use.
const agentExecutorTool = ai.defineTool(
  {
    name: 'agentExecutor',
    description: 'Executes a series of tasks to achieve a user-defined goal. Analyzes the goal and uses other available tools to accomplish it.',
    inputSchema: z.object({
        goal: z.string().describe("The primary goal to achieve."),
        tasks: z.array(z.string()).describe("A list of tasks to guide the process."),
    }),
    outputSchema: z.object({
        actions: z.array(z.string()).describe("A log of the actions taken."),
        summary: z.string().describe("A summary of the final result."),
        finalOutputs: z.any().describe("The final artifacts produced, like articles or image URLs.")
    }),
    tools: [generateIdeaTool, writeArticleTool, createImageTool],
  },
  async (input) => {
    // The `ai.runTool` function allows a tool to call other tools.
    // By providing a prompt and the list of available tools, the LLM will
    // reason about the prompt and decide which tools (if any) to call.
    const {output} = await ai.runTool({
        prompt: `You are an autonomous agent. Your goal is to: ${input.goal}.
                 To do this, you must complete the following tasks: ${input.tasks.join(', ')}.
                 Use the available tools to complete each task in sequence.
                 Think step-by-step and use the output of one tool as the input for the next.
                 Your final answer should be a summary of what you accomplished.`,
        tools: [generateIdeaTool, writeArticleTool, createImageTool],
        model: googleAI.model('gemini-2.5-flash'),
    });

    // The output here will be the final text response from the LLM after it has finished
    // calling all the necessary tools. We can also inspect the tool history if needed.
    return {
        actions: ["Agent execution completed."], // This could be improved by tracing tool calls.
        summary: output as string,
        finalOutputs: {} // This could be improved to return structured output.
    };
  }
);

const prompt = ai.definePrompt({
  name: 'createAutomatedAIAgentPrompt',
  input: {schema: CreateAutomatedAIAgentInputSchema},
  output: {schema: CreateAutomatedAIAgentOutputSchema},
  tools: [agentExecutorTool],
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `
    You are an AI agent manager. Your task is to execute the user's request using the agentExecutorTool.
    The primary goal is: {{agentGoals.[0]}}
    The guiding tasks are: {{#each agentTasks}}{{{this}}}, {{/each}}
    
    Call the agentExecutorTool with this goal and these tasks.
    
    Once the tool has finished, summarize the results to the user.
    - Set agentStatus to 'completed'.
    - The agentActions should be a brief log of what was done.
    - The agentResults should be the final summary from the tool.
  `,
});

const createAutomatedAIAgentFlow = ai.defineFlow(
  {
    name: 'createAutomatedAIAgentFlow',
    inputSchema: CreateAutomatedAIAgentInputSchema,
    outputSchema: CreateAutomatedAIAgentOutputSchema,
  },
  async (input) => {
    // The prompt will now orchestrate calling the agentExecutorTool
    const {output} = await prompt(input);
    return output!;
  }
);
