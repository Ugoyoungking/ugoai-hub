
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { firebaseConfig } from '@/lib/firebase/client';

const geminiApiKey = firebaseConfig.geminiApiKey;

if (!geminiApiKey || geminiApiKey === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
  throw new Error("GEMINI_API_KEY is not configured in src/lib/firebase/client.ts. Please add it to proceed.");
}

export const ai = genkit({
  plugins: [googleAI({apiKey: geminiApiKey})],
});
