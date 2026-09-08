import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { FirebaseUser } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  updatedAt: string;
  savedArticles?: string[];
  subscribedNewsletters?: string[];
}

const USERS_COLLECTION = 'users';

/**
 * Fetch a user's persisted profile and preferences from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Sync or create a user's profile in Firestore upon sign in / registration
 */
export async function syncUserProfile(
  user: FirebaseUser, 
  customDisplayName?: string
): Promise<UserProfile> {
  const userDocRef = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();

  try {
    const existing = await getDoc(userDocRef);
    if (existing.exists()) {
      const existingData = existing.data() as UserProfile;
      const updatedData: Partial<UserProfile> = {
        updatedAt: now,
      };

      if (customDisplayName && customDisplayName.trim()) {
        updatedData.displayName = customDisplayName.trim();
      } else if (!existingData.displayName && user.displayName) {
        updatedData.displayName = user.displayName;
      }

      if (user.photoURL && user.photoURL !== existingData.photoURL) {
        updatedData.photoURL = user.photoURL;
      }

      await updateDoc(userDocRef, updatedData);
      return {
        ...existingData,
        ...updatedData,
      };
    } else {
      // Create new profile
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: customDisplayName?.trim() || user.displayName || user.email?.split('@')[0] || 'Reader',
        photoURL: user.photoURL || null,
        createdAt: now,
        updatedAt: now,
        savedArticles: [],
        subscribedNewsletters: ['global-dispatch'],
      };

      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
    // Return fallback profile in case of offline/transient error
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: customDisplayName?.trim() || user.displayName || user.email?.split('@')[0] || 'Reader',
      photoURL: user.photoURL || null,
      createdAt: now,
      updatedAt: now,
      savedArticles: [],
      subscribedNewsletters: ['global-dispatch'],
    };
  }
}

/**
 * Persist saved article bookmarks in Firestore
 */
export async function toggleSavedArticleInFirestore(
  uid: string, 
  articleId: string, 
  currentSavedArticles: string[]
): Promise<string[]> {
  const isSaved = currentSavedArticles.includes(articleId);
  const updated = isSaved 
    ? currentSavedArticles.filter(id => id !== articleId)
    : [...currentSavedArticles, articleId];

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      savedArticles: updated.slice(0, 100),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating saved articles in Firestore:', error);
  }

  return updated;
}

/**
 * Persist newsletter subscriptions in Firestore
 */
export async function syncNewslettersToFirestore(
  uid: string, 
  newsletters: string[]
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      subscribedNewsletters: newsletters.slice(0, 50),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating newsletter subscriptions in Firestore:', error);
  }
}
