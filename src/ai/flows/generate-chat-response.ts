
'use server';
/**
 * @fileOverview A conversational AI chat flow.
 *
 * - generateChatResponse - A function that streams a chat response from an AI model.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface GenerateChatResponseInput {
  history: ChatMessage[];
  message: string;
}


export async function generateChatResponse(
  input: GenerateChatResponseInput,
  // The on-chunk callback will be called with each chunk of the streamed response.
  onChunk: (chunk: string) => void
): Promise<void> {
  // Add the new user message to the history
  const history = [...input.history, { role: 'user' as const, content: input.message }];

  // Use `generateStream` to get a stream of response chunks
  const { stream } = ai.generateStream({
    model: googleAI.model('gemini-2.5-flash'),
    history,
    prompt: input.message,
  });

  // Iterate through the stream and send each chunk to the client
  for await (const chunk of stream) {
    onChunk(chunk.text);
  }
}
