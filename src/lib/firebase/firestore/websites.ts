
'use client';

import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { GenerateWebsiteOutput } from '@/ai/flows/generate-website-from-description';

export interface WebsiteData extends GenerateWebsiteOutput {
  userId: string;
  description: string;
}

export const saveWebsite = async (userId: string, description: string, websiteData: GenerateWebsiteOutput): Promise<void> => {
  if (!userId) {
    throw new Error('User must be logged in to save a website.');
  }

  try {
    const websitesCollectionRef = collection(firestore, 'users', userId, 'websites');
    await addDoc(websitesCollectionRef, {
      ...websiteData,
      userId,
      description,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving website to Firestore: ", error);
    // We can re-throw the error if we want the calling component to handle it
    throw new Error('Failed to save website.');
  }
};

export const getLatestWebsite = async (userId: string): Promise<WebsiteData | null> => {
   if (!userId) {
    throw new Error('User ID is required to fetch websites.');
  }

  try {
    const websitesCollectionRef = collection(firestore, 'users', userId, 'websites');
    const q = query(websitesCollectionRef, orderBy('createdAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const latestDoc = querySnapshot.docs[0];
    const data = latestDoc.data();
    
    // Firestore returns a Timestamp object, we convert it to an ISO string for consistency
    const websiteData = {
      ...data,
      createdAt: data.createdAt?.toDate().toISOString(),
    } as WebsiteData;
    
    return websiteData;
  } catch (error) {
     console.error("Error fetching latest website from Firestore: ", error);
     throw new Error('Failed to fetch latest website.');
  }
};
