import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { CommentItem, ArticleLikeRecord, ArticleCommentRecord } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const LIKES_COLLECTION = 'articleLikes';
const COMMENTS_COLLECTION = 'articleComments';

/**
 * Real-time listener for article likes in Cloud Firestore
 */
export function subscribeToArticleLikes(
  articleId: string,
  onUpdate: (data: { total: number; userIds: string[] }) => void
): () => void {
  try {
    const q = query(
      collection(db, LIKES_COLLECTION),
      where('articleId', '==', articleId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userIds: string[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ArticleLikeRecord;
          if (data && data.userId) {
            userIds.push(data.userId);
          }
        });
        onUpdate({
          total: snapshot.size,
          userIds,
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, LIKES_COLLECTION);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, LIKES_COLLECTION);
  }
}

/**
 * Toggle an article like for the authenticated user
 */
export async function toggleArticleLike(
  articleId: string,
  userName?: string
): Promise<{ isLiked: boolean; totalLikesChange: number }> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('AUTH_REQUIRED');
  }

  const likeId = `${articleId}_${currentUser.uid}`;
  const likeDocRef = doc(db, LIKES_COLLECTION, likeId);

  try {
    // Check if like doc already exists or toggle
    const { getDoc } = await import('firebase/firestore');
    const existingSnap = await getDoc(likeDocRef);

    if (existingSnap.exists()) {
      // Remove like
      await deleteDoc(likeDocRef);
      return { isLiked: false, totalLikesChange: -1 };
    } else {
      // Add like
      const newLike: ArticleLikeRecord = {
        id: likeId,
        articleId,
        userId: currentUser.uid,
        userName: userName || currentUser.displayName || 'Reader',
        createdAt: new Date().toISOString(),
      };
      await setDoc(likeDocRef, newLike);
      return { isLiked: true, totalLikesChange: 1 };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${LIKES_COLLECTION}/${likeId}`);
  }
}

/**
 * Real-time listener for reader comments on an article in Cloud Firestore
 */
export function subscribeToArticleComments(
  articleId: string,
  onUpdate: (comments: CommentItem[]) => void
): () => void {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('articleId', '==', articleId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: CommentItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ArticleCommentRecord;
          items.push({
            id: data.id,
            userName: data.userName || 'Verified Reader',
            userLocation: data.userLocation || 'Online',
            comment: data.comment,
            timestamp: formatTimestamp(data.createdAt),
            upvotes: data.upvotes || 0,
            userId: data.userId,
          });
        });

        // Sort comments newest first
        items.sort((a, b) => b.id.localeCompare(a.id));
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, COMMENTS_COLLECTION);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COMMENTS_COLLECTION);
  }
}

/**
 * Post a new reader comment to Cloud Firestore (Authenticated users only)
 */
export async function postArticleComment(
  articleId: string,
  commentText: string,
  userLocation: string = 'UK'
): Promise<CommentItem> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('AUTH_REQUIRED');
  }

  const commentId = `cm_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const commentDocRef = doc(db, COMMENTS_COLLECTION, commentId);
  const now = new Date().toISOString();

  const commentRecord: ArticleCommentRecord = {
    id: commentId,
    articleId,
    userId: currentUser.uid,
    userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Verified Reader',
    userLocation: userLocation.trim() || 'Global',
    comment: commentText.trim().slice(0, 1500),
    createdAt: now,
    upvotes: 0,
  };

  try {
    await setDoc(commentDocRef, commentRecord);

    return {
      id: commentId,
      userName: commentRecord.userName,
      userLocation: commentRecord.userLocation || 'Global',
      comment: commentRecord.comment,
      timestamp: 'Just now',
      upvotes: 0,
      userId: currentUser.uid,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COMMENTS_COLLECTION}/${commentId}`);
  }
}

/**
 * Delete a reader comment (Author only)
 */
export async function deleteArticleComment(commentId: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('AUTH_REQUIRED');
  }

  try {
    const commentDocRef = doc(db, COMMENTS_COLLECTION, commentId);
    await deleteDoc(commentDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COMMENTS_COLLECTION}/${commentId}`);
  }
}

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} mins ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hrs ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return 'Recently';
  }
}
