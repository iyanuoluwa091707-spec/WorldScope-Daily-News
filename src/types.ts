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

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  photoURL?: string | null;
  providerId?: string;
  savedArticles?: string[];
  subscribedNewsletters?: string[];
}
