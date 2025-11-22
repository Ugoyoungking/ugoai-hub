
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignout, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  Auth,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
} from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const firebaseConfig = {
  apiKey: "AIzaSyDty7nU-OJHvBAmvxdEK8GZaYp_fXVeKeM",
  authDomain: "textme-76d52.firebaseapp.com",
  projectId: "textme-76d52",
  storageBucket: "textme-76d52.firebasestorage.app",
  messagingSenderId: "1016897162508",
  appId: "1:1016897162508:web:66b2b777ef9d7a0b274d29",
  measurementId: "G-GLNQDQRV6V"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (message: string, redirect?: string) => {
    if (redirect) {
      router.push(redirect);
    }
    toast({ title: message });
  };
  
  const handleAuthError = (error: any) => {
    console.error("Authentication error", error);
    toast({
      variant: "destructive",
      title: "An error occurred",
      description: error.message || "An unknown error occurred.",
    });
  };

  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleAuthSuccess("Successfully signed in with Google!", '/dashboard');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess("Successfully signed in!", '/dashboard');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      handleAuthSuccess("Account created successfully!", '/dashboard');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignout(auth);
      router.push('/');
      toast({ title: "Signed out successfully." });
    } catch (error) {
      console.error("Error signing out", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, email);
      handleAuthSuccess("Password reset email sent. Please check your inbox.", '/login');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth || !auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, { displayName });
      // Manually update the user state to reflect the change immediately
      setUser({ ...auth.currentUser, displayName } as User);
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      handleAuthError(error);
    }
  }

  const updateUserPassword = async (password: string) => {
    if (!auth || !auth.currentUser) return;
    try {
      await updatePassword(auth.currentUser, password);
      toast({ title: "Password updated successfully!" });
    } catch (error) {
      handleAuthError(error);
    }
  }


  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, sendPasswordReset, updateUserProfile, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
