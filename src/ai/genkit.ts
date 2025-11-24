
'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

// Load environment variables from .env file, especially for local development.
// Vercel will provide these from its environment variable settings.
config({ path: '.env' });

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables. Please add it to your .env file or Vercel environment variables.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  // You can set a default model here if you want
  // model: 'googleai/gemini-2.5-flash',
});
