export interface LiveUpdate {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  author?: string;
}

export interface CommentItem {
  id: string;
  userName: string;
  userLocation: string;
  comment: string;
  timestamp: string;
  upvotes: number;
  userId?: string;
}

export interface ArticleLikeRecord {
  id: string;
  articleId: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

export interface ArticleCommentRecord {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userLocation?: string;
  comment: string;
  createdAt: string;
  upvotes?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  lead: string;
  category: string; // 'UK' | 'Sport' | 'Health' | 'Technology' | 'Business' | 'Culture' | custom
  subCategory?: string;
  author: {
    name: string;
    role: string;
    location?: string;
  };
  publishedAt: string;
  timestampDisplay: string; // e.g. "12 mins ago"
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  content: string[];
  pullQuote?: {
    quote: string;
    attribution: string;
  };
  isBreaking?: boolean;
  isLive?: boolean;
  liveUpdates?: LiveUpdate[];
  tags: string[];
  commentsCount: number;
  likesCount?: number;
  views: number;
  comments: CommentItem[];
  isCustom?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  subCategories: string[];
  description: string;
}

export type SubscriptionTier = 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'canceled';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string | null;
  providerId?: string;
  savedArticles?: string[];
  subscribedNewsletters?: string[];
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: string;
  subscribedAt?: string;
  createdAt?: string;
}

export interface PremiumNewsletter {
  id: string;
  title: string;
  edition: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  summary: string;
  keyTakeaways: string[];
  fullContent: string[];
  tierRequired: SubscriptionTier;
  readTime: string;
  tags: string[];
  metrics?: {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
  }[];
}

export interface AdPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  impressions: string;
  description: string;
  benefits: string[];
  recommended?: boolean;
}

export interface AdvertisementInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  website: string;
  packageId: string;
  budget: string;
  message: string;
  submittedAt: string;
}
