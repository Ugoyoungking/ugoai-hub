
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDty7nU-OJHvBAmvxdEK8GZaYp_fXVeKeM",
  authDomain: "textme-76d52.firebaseapp.com",
  projectId: "textme-76d52",
  storageBucket: "textme-76d52.firebasestorage.app",
  messagingSenderId: "1016897162508",
  appId: "1:1016897162508:web:66b2b777ef9d7a0b274d29",
  measurementId: "G-GLNQDQRV6V"
};

function getClientApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
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
    return getMessaging(getClientApp());
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
