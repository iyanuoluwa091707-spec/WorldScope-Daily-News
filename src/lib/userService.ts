import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { FirebaseUser } from './firebase';
import type { SubscriptionTier, SubscriptionStatus, AdvertisementInquiry } from '../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  createdAt: string;
  updatedAt: string;
  savedArticles?: string[];
  subscribedNewsletters?: string[];
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: string;
  subscribedAt?: string;
}

const USERS_COLLECTION = 'users';
const AD_INQUIRIES_COLLECTION = 'adInquiries';

// Helper to prevent Firestore calls from hanging UI when connection is slow/offline
function raceWithTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`Firestore call timed out after ${ms}ms, using fallback.`);
      resolve(fallback);
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Fetch a user's persisted profile and preferences from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await raceWithTimeout(getDoc(userDocRef), 3500, null);
    if (snapshot && snapshot.exists()) {
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
  const fallbackProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: customDisplayName?.trim() || user.displayName || user.email?.split('@')[0] || 'Reader',
    photoURL: user.photoURL || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedArticles: [],
    subscribedNewsletters: ['global-dispatch'],
    subscriptionTier: 'basic',
    subscriptionStatus: 'inactive',
  };

  const userDocRef = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();

  const syncPromise = (async () => {
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

      // Only set photoURL if existing profile does not already have a custom photo
      if (!existingData.photoURL && user.photoURL) {
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
        subscriptionTier: 'basic',
        subscriptionStatus: 'inactive',
      };

      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
  })();

  try {
    return await raceWithTimeout(syncPromise, 3500, fallbackProfile);
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
    return fallbackProfile;
  }
}

/**
 * Update user subscription status in Cloud Firestore
 */
export async function updateUserSubscription(
  uid: string,
  tier: SubscriptionTier,
  durationMonths: number = 12
): Promise<{
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry: string;
  subscribedAt: string;
}> {
  const now = new Date();
  const subscribedAt = now.toISOString();
  
  // Calculate expiry date
  const expiryDate = new Date(now);
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
  const subscriptionExpiry = expiryDate.toISOString();
  const subscriptionStatus: SubscriptionStatus = 'active';

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      subscriptionTier: tier,
      subscriptionStatus,
      subscriptionExpiry,
      subscribedAt,
      updatedAt: subscribedAt,
    });
  } catch (error) {
    console.error('Error updating subscription in Firestore:', error);
  }

  return {
    subscriptionTier: tier,
    subscriptionStatus,
    subscriptionExpiry,
    subscribedAt,
  };
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

/**
 * Update user profile details (displayName, photoURL) in Cloud Firestore
 */
export async function updateUserProfileData(
  uid: string,
  data: { displayName?: string; photoURL?: string | null }
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile in Firestore:', error);
    throw error;
  }
}

/**
 * Clear all saved articles for a user in Cloud Firestore
 */
export async function clearUserSavedArticles(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      savedArticles: [],
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing saved articles in Firestore:', error);
  }
}

/**
 * Submit an advertising inquiry to Cloud Firestore
 */
export async function submitAdInquiry(inquiry: AdvertisementInquiry): Promise<void> {
  try {
    const inquiryRef = doc(db, AD_INQUIRIES_COLLECTION, inquiry.id);
    await setDoc(inquiryRef, inquiry);
  } catch (error) {
    console.error('Error submitting advertisement inquiry to Firestore:', error);
  }
}
