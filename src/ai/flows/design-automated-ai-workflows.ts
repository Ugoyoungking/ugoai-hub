'use server';

/**
 * @fileOverview AI Workflow Designer.
 *
 * - designAutomatedAIWorkflows - A function that allows users to design automated workflows.
 * - DesignAutomatedAIWorkflowsInput - The input type for the designAutomatedAIWorkflows function.
 * - DesignAutomatedAIWorkflowsOutput - The return type for the designAutomatedAIWorkflows function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkflowBlockSchema = z.object({
  type: z.string().describe('The type of the workflow block (e.g., GenerateIdea, WriteArticle, CreateImages, MakeSocialCaptions, ExportPDF, PostToSocial).'),
  parameters: z.record(z.any()).optional().describe('Parameters specific to the workflow block.'),
});

const DesignAutomatedAIWorkflowsInputSchema = z.object({
  workflowName: z.string().describe('The name of the workflow.'),
  workflowDescription: z.string().describe('The description of the workflow.'),
  workflowBlocks: z.array(WorkflowBlockSchema).describe('An array of workflow blocks defining the automated process.'),
});

export type DesignAutomatedAIWorkflowsInput = z.infer<typeof DesignAutomatedAIWorkflowsInputSchema>;

const DesignAutomatedAIWorkflowsOutputSchema = z.object({
  success: z.boolean().describe('Indicates if the workflow design was successfully processed.'),
  message: z.string().describe('A message providing feedback on the workflow design process.'),
});

export type DesignAutomatedAIWorkflowsOutput = z.infer<typeof DesignAutomatedAIWorkflowsOutputSchema>;

export async function designAutomatedAIWorkflows(input: DesignAutomatedAIWorkflowsInput): Promise<DesignAutomatedAIWorkflowsOutput> {
  return designAutomatedAIWorkflowsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'designAutomatedAIWorkflowsPrompt',
  input: {
    schema: DesignAutomatedAIWorkflowsInputSchema,
  },
  output: {
    schema: DesignAutomatedAIWorkflowsOutputSchema,
  },
  prompt: `You are an AI workflow designer. Analyze the provided workflow design and determine if it's logically sound and complete. Provide feedback on its structure and potential improvements.

Workflow Name: {{{workflowName}}}
Workflow Description: {{{workflowDescription}}}
Workflow Blocks:
{{#each workflowBlocks}}
  - Type: {{{type}}}
    Parameters: {{#if parameters}}{{{json parameters}}}{{else}}N/A{{/if}}
{{/each}}

Respond with a JSON object indicating the success status and a message with your analysis. Consider factors like the types of blocks used, the order of execution, and the completeness of the workflow for content creation and marketing tasks.`,
});

const designAutomatedAIWorkflowsFlow = ai.defineFlow(
  {
    name: 'designAutomatedAIWorkflowsFlow',
    inputSchema: DesignAutomatedAIWorkflowsInputSchema,
    outputSchema: DesignAutomatedAIWorkflowsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error during workflow design:', error);
      return {
        success: false,
        message: `Workflow design failed: ${error.message || 'Unknown error'}`,
      };
    }
  }
);
