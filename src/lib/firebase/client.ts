
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAuth, Auth } from 'firebase/auth';

// This file is now safe to be included on the server, as it only exports types and functions
// The actual initialization is done on the client-side in the AuthProvider

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDty7nU-OJHvBAmvxdEK8GZaYp_fXVeKeM",
  authDomain: "textme-76d52.firebaseapp.com",
  projectId: "textme-76d52",
  storageBucket: "textme-76d52.firebasestorage.app",
  messagingSenderId: "1016897162508",
  appId: "1:1016897162508:web:66b2b777ef9d7a0b274d29",
  measurementId: "G-GLNQDQRV6V"
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
