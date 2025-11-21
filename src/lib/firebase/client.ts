
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAuth, Auth } from 'firebase/auth';

// This file is now safe to be included on the server, as it only exports types and functions
// The actual initialization is done on the client-side in the AuthProvider

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function getClientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function getClientAuth() {
  return getAuth(getClientApp());
}

function getClientMessaging() {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
        return null;
    }
    return getMessaging(getClientApp());
}

// Re-exporting these for convenience
export { initializeApp, getApps, getApp };
export type { FirebaseApp, FirebaseOptions };

// Export client-safe getters
export { getClientApp, getClientAuth, getClientMessaging };

// Export messaging for use in components, but it will be null on the server
export const messaging = getClientMessaging();
// Export auth for use in components, but it's better to use the one from AuthProvider
export const auth = getClientAuth();
// Export app for use in components
export const app = getClientApp();
