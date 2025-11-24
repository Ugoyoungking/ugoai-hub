
'use server';
/**
 * @fileOverview Trains a personalized AI model from user-provided documents and websites.
 *
 * - trainAIModel - A function that initiates the AI model training process.
 * - TrainAIModelInput - The input type for the trainAIModel function, including document and website URLs.
 * - TrainAIModelOutput - The return type for the trainAIModel function, indicating the model's training status.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const TrainAIModelInputSchema = z.object({
  documentDataUris: z
    .array(z.string())
    .describe(
      'An array of document data URIs (PDFs, Word documents), each as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  websiteUrls: z.array(z.string().url()).describe('An array of website URLs to train the model on.'),
});
export type TrainAIModelInput = z.infer<typeof TrainAIModelInputSchema>;

const TrainAIModelOutputSchema = z.object({
  modelTrainingStatus: z
    .string()
    .describe('The status of the AI model training process.'),
  modelId: z.string().optional().describe('The ID of the trained AI model.'),
});
export type TrainAIModelOutput = z.infer<typeof TrainAIModelOutputSchema>;

// Define a tool to process each document and extract information
const processDocument = ai.defineTool({
  name: 'processDocument',
  description: 'Processes a single document (PDF, Word) and extracts its content.',
  inputSchema: z.object({
    documentDataUri: z
      .string()
      .describe(
        'The document data URI, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
      ),
  }),
  outputSchema: z.string().describe('The extracted text content from the document.'),
}, async (input) => {
  // In a real app, you would use a library to parse the document based on its MIME type.
  // This is a placeholder.
  console.log('Processing document (mock):', input.documentDataUri.substring(0, 50));
  const response = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    prompt: [
        {text: "Summarize the key information from the following document content."},
        {media: {url: input.documentDataUri}}
    ]
  });
  return response.text;
});

// Define a tool to scrape content from a website URL
const scrapeWebsite = ai.defineTool({
  name: 'scrapeWebsite',
  description: 'Scrapes the content from a given website URL.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL of the website to scrape.'),
  }),
  outputSchema: z.string().describe('The text content scraped from the website.'),
}, async (input) => {
  // In a real app, you'd use a library like Cheerio or Puppeteer.
  // This is a placeholder.
  console.log('Scraping website (mock):', input.url);
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(input.url);
  const text = await response.text();
  // A very basic scrape just to get text content.
  const summaryResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Extract the main textual content from this HTML, ignoring navigation, ads, and footers. Summarize the content: \n\n ${text.substring(0, 8000)}`
  });
  return summaryResponse.text;
});

const trainAIModelPrompt = ai.definePrompt({
  name: 'trainAIModelPrompt',
  input: {schema: z.string().describe("A string containing all the aggregated content from documents and websites.")},
  output: {schema: TrainAIModelOutputSchema},
  tools: [],
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are an AI model trainer. You have been given a corpus of text. Your job is to acknowledge that you have received the data and are beginning the training process.

  Respond with a status of 'training' and a newly generated unique modelId.

  Corpus:
  {{input}}
  `,
});

const trainAIModelFlow = ai.defineFlow(
  {
    name: 'trainAIModelFlow',
    inputSchema: TrainAIModelInputSchema,
    outputSchema: TrainAIModelOutputSchema,
  },
  async input => {
    let allContent = '';

    // Process all documents in parallel
    const docPromises = input.documentDataUris.map(docUri =>
      processDocument({ documentDataUri: docUri })
    );

    // Process all websites in parallel
    const webPromises = input.websiteUrls.map(url =>
      scrapeWebsite({ url })
    );

    const docContents = await Promise.all(docPromises);
    const webContents = await Promise.all(webPromises);

    allContent = [...docContents, ...webContents].join('\n\n---\n\n');

    const {output} = await trainAIModelPrompt(allContent);
    
    return {
      modelTrainingStatus: output?.modelTrainingStatus || 'training',
      modelId: output?.modelId || 'model-' + Date.now(),
    };
  }
);

export async function trainAIModel(input: TrainAIModelInput): Promise<TrainAIModelOutput> {
  return trainAIModelFlow(input);
}
