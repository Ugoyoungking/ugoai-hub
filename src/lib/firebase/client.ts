
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDty7nU-OJHvBAmvxdEK8GZaYp_fXVeKeM",
  authDomain: "textme-76d52.firebaseapp.com",
  projectId: "textme-76d52",
  storageBucket: "textme-76d52.firebasestorage.app",
  messagingSenderId: "1016897162508",
  appId: "1:1016897162508:web:66b2b777ef9d7a0b274d29",
  measurementId: "G-GLNQDQRV6V"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
