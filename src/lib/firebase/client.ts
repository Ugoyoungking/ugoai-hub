
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig: FirebaseOptions & { geminiApiKey?: string } = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  // LAST RESORT: Paste your Gemini API key here.
  // This is not a secure practice for public repositories.
  geminiApiKey: "PASTE_YOUR_GEMINI_API_KEY_HERE" 
};

if (!firebaseConfig.apiKey) {
    throw new Error('Missing Firebase API key from environment variables.');
}
if (firebaseConfig.geminiApiKey === "PASTE_YOUR_GEMINI_API_KEY_HERE" || !firebaseConfig.geminiApiKey) {
    // This check is to prevent deploying without the key.
    // In a real production app, this check might be more robust.
    console.warn("GEMINI API KEY is not set in firebaseConfig. AI features will fail.");
}


function getClientApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

function getClientAuth(): Auth {
  return getAuth(getClientApp());
}

function getClientFirestore(): Firestore {
  return getFirestore(getClientApp());
}

function getClientMessaging(): Messaging | null {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
        return null;
    }
    try {
        return getMessaging(getClientApp());
    } catch (err) {
        console.error("Failed to initialize Firebase Messaging", err);
        return null;
    }
}

// Re-exporting these for convenience
export { initializeApp, getApps, getApp };
export type { FirebaseApp, FirebaseOptions };

// Export client-safe getters
export { getClientApp, getClientAuth, getClientFirestore, getClientMessaging };

// Export instances for use in components
export const app = getClientApp();
export const auth = getClientAuth();
export const firestore = getClientFirestore();
export const messaging = getClientMessaging();
