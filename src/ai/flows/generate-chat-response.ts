'use server';
/**
 * @fileOverview A conversational AI chat flow.
 *
 * - generateChatResponse - A function that streams a chat response from an AI model.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single chat message
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input schema for the chat flow
const GenerateChatResponseInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;


export async function generateChatResponse(
  input: GenerateChatResponseInput,
  // The on-chunk callback will be called with each chunk of the streamed response.
  onChunk: (chunk: string) => void
): Promise<void> {
  // Add the new user message to the history
  const history = [...input.history, { role: 'user' as const, content: input.message }];

  // Use `generateStream` to get a stream of response chunks
  const { stream } = ai.generateStream({
    model: 'googleai/gemini-2.5-flash',
    history,
    prompt: input.message,
  });

  // Iterate through the stream and send each chunk to the client
  for await (const chunk of stream) {
    onChunk(chunk.text);
  }
}
