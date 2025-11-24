
'use server';

/**
 * @fileOverview AI Workflow Designer and Executor.
 *
 * - designAutomatedAIWorkflows - A function that allows users to design and execute automated workflows.
 * - DesignAutomatedAIWorkflowsInput - The input type for the designAutomatedAIWorkflows function.
 * - DesignAutomatedAIWorkflowsOutput - The return type for the designAutomatedAIWorkflows function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Schemas for Tools
const GenerateIdeaOutputSchema = z.object({
  idea: z.string().describe('A single, concise topic idea for a blog post.'),
  articleTitle: z.string().describe('A catchy title for the article based on the idea.'),
});

const WriteArticleOutputSchema = z.object({
  article: z.string().describe('The full text of the article, formatted in Markdown.'),
});

const CreateImageOutputSchema = z.object({
  imagePrompt: z.string().describe('A descriptive prompt for an image generation model, based on the article content.'),
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});

// Tool Definitions
export const generateIdeaTool = ai.defineTool(
  {
    name: 'generateIdea',
    description: 'Generates a blog post idea and a catchy title based on a general topic.',
    inputSchema: z.object({
      topic: z.string().describe('The general topic for the blog post.'),
    }),
    outputSchema: GenerateIdeaOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a creative blog post idea and a catchy title for the following topic: ${input.topic}`;
    const {output} = await ai.generate({
      prompt,
      model: googleAI.model('gemini-2.5-flash'),
      output: {schema: GenerateIdeaOutputSchema},
    });
    return output!;
  }
);

export const writeArticleTool = ai.defineTool(
  {
    name: 'writeArticle',
    description: 'Writes a full-length article based on a given idea and title.',
    inputSchema: z.object({
      idea: z.string().describe('The core idea of the article.'),
      title: z.string().describe('The title of the article.'),
    }),
    outputSchema: WriteArticleOutputSchema,
  },
  async (input) => {
    const prompt = `Write a comprehensive, engaging, and well-structured blog post based on the following title and idea. The article should be in Markdown format.\n\nTitle: ${input.title}\n\nIdea: ${input.idea}`;
    const {output} = await ai.generate({
      prompt,
      model: googleAI.model('gemini-2.5-flash'),
      output: {schema: WriteArticleOutputSchema},
    });
    return output!;
  }
);

export const createImageTool = ai.defineTool(
  {
    name: 'createImage',
    description: 'Creates a relevant image for a given article.',
    inputSchema: z.object({
      article: z.string().describe('The content of the article to generate an image for.'),
    }),
    outputSchema: CreateImageOutputSchema,
  },
  async (input) => {
    // First, generate a good image prompt from the article content
    const promptGenResult = await ai.generate({
      prompt: `Based on the following article, create a short, descriptive, and visually compelling prompt for an image generation model like Imagen. The prompt should capture the essence of the article in a single scene.\n\nArticle:\n${input.article.substring(0, 2000)}`,
      model: googleAI.model('gemini-2.5-flash'),
      output: {
        schema: z.object({
          imagePrompt: z.string(),
        }),
      },
    });
    const imagePrompt = promptGenResult.output!.imagePrompt;

    // Then, generate the image
    const {media} = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: imagePrompt,
    });

    return {
      imagePrompt,
      imageDataUri: media.url,
    };
  }
);

const WorkflowBlockSchema = z.object({
  type: z.string().describe('The type of the workflow block (e.g., Generate Idea, Write Article, Create Images).'),
  parameters: z.record(z.any()).optional().describe('Parameters specific to the workflow block.'),
});

const DesignAutomatedAIWorkflowsInputSchema = z.object({
  workflowName: z.string().describe('The name of the workflow.'),
  workflowDescription: z.string().describe('The description of the workflow.'),
  workflowBlocks: z.array(WorkflowBlockSchema).describe('An array of workflow blocks defining the automated process.'),
});

export type DesignAutomatedAIWorkflowsInput = z.infer<typeof DesignAutomatedAIWorkflowsInputSchema>;

const DesignAutomatedAIWorkflowsOutputSchema = z.object({
  success: z.boolean().describe('Indicates if the workflow was successfully executed.'),
  message: z.string().describe('A message providing feedback on the workflow execution.'),
  results: z.object({
    idea: GenerateIdeaOutputSchema.optional(),
    article: WriteArticleOutputSchema.optional(),
    images: z.array(CreateImageOutputSchema).optional(),
  }).describe('The outputs from the executed workflow blocks.'),
});

export type DesignAutomatedAIWorkflowsOutput = z.infer<typeof DesignAutomatedAIWorkflowsOutputSchema>;

export async function designAutomatedAIWorkflows(input: DesignAutomatedAIWorkflowsInput): Promise<DesignAutomatedAIWorkflowsOutput> {
  return designAutomatedAIWorkflowsFlow(input);
}

const designAutomatedAIWorkflowsFlow = ai.defineFlow(
  {
    name: 'designAutomatedAIWorkflowsFlow',
    inputSchema: DesignAutomatedAIWorkflowsInputSchema,
    outputSchema: DesignAutomatedAIWorkflowsOutputSchema,
  },
  async (input) => {
    console.log(`Executing workflow: ${input.workflowName}`);

    const results: z.infer<typeof DesignAutomatedAIWorkflowsOutputSchema>['results'] = {};
    let lastOutput: any = { topic: input.workflowDescription }; // Start with the workflow description as the initial topic

    try {
      for (const block of input.workflowBlocks) {
        console.log(`Executing block: ${block.type}`);
        if (block.type.includes('Generate Idea')) {
          const ideaResult = await generateIdeaTool(lastOutput);
          results.idea = ideaResult;
          lastOutput = { ...lastOutput, ...ideaResult };
        } else if (block.type.includes('Write Article')) {
          if (!lastOutput.idea || !lastOutput.articleTitle) {
            throw new Error('Cannot write article without an idea and title from a previous step.');
          }
          const articleResult = await writeArticleTool({ idea: lastOutput.idea, title: lastOutput.articleTitle });
          results.article = articleResult;
          lastOutput = { ...lastOutput, ...articleResult };
        } else if (block.type.includes('Create') && block.type.includes('Image')) {
           const imageCount = parseInt(block.type.match(/\d+/)?.[0] ?? '1', 10);
           if (!lastOutput.article) {
             throw new Error('Cannot create images without an article from a previous step.');
           }
           results.images = [];
           for (let i = 0; i < imageCount; i++) {
             console.log(`Generating image ${i + 1} of ${imageCount}...`);
             const imageResult = await createImageTool({ article: lastOutput.article });
             results.images.push(imageResult);
           }
           lastOutput = { ...lastOutput, images: results.images };
        }
        // Other block types can be implemented here
      }

      return {
        success: true,
        message: 'Workflow executed successfully.',
        results,
      };
    } catch (error: any) {
      console.error('Error during workflow execution:', error);
      return {
        success: false,
        message: `Workflow failed: ${error.message || 'Unknown error'}`,
        results: {},
      };
    }
  }
);
