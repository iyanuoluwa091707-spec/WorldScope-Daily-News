import { Article } from '../types';

export interface ArticleTemplate {
  id: string;
  title: string;
  lead: string;
  category: string;
  subCategory?: string;
  authorName: string;
  authorRole: string;
  authorLocation?: string;
  minutesAgo: number;
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  paragraphs: string[];
  pullQuote?: {
    quote: string;
    attribution: string;
  };
  tags: string[];
  isBreaking?: boolean;
  isLive?: boolean;
}

export function createArticle(t: ArticleTemplate): Article {
  const publishedDate = new Date(Date.now() - t.minutesAgo * 60 * 1000);
  
  let timestampDisplay = `${t.minutesAgo} mins ago`;
  if (t.minutesAgo >= 60 && t.minutesAgo < 1440) {
    const hours = Math.floor(t.minutesAgo / 60);
    timestampDisplay = `${hours} ${hours === 1 ? 'hr' : 'hrs'} ago`;
  } else if (t.minutesAgo >= 1440) {
    const days = Math.floor(t.minutesAgo / 1440);
    timestampDisplay = `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  const slug = t.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    id: t.id,
    title: t.title,
    slug,
    lead: t.lead,
    category: t.category,
    subCategory: t.subCategory,
    author: {
      name: t.authorName,
      role: t.authorRole,
      location: t.authorLocation || 'London',
    },
    publishedAt: publishedDate.toISOString(),
    timestampDisplay,
    readTime: t.readTime,
    imageUrl: t.imageUrl,
    imageCaption: t.imageCaption,
    imageCredit: t.imageCredit,
    content: t.paragraphs,
    pullQuote: t.pullQuote,
    isBreaking: t.isBreaking,
    isLive: t.isLive,
    tags: t.tags,
    commentsCount: Math.floor(20 + (t.minutesAgo % 80)),
    views: Math.floor(12000 + (t.minutesAgo * 320)),
    comments: [
      {
        id: `c-${t.id}-1`,
        userName: 'Oliver Davies',
        userLocation: 'Edinburgh',
        comment: 'A comprehensive briefing. The structural implications will be closely monitored across the devolved assemblies.',
        timestamp: '15 mins ago',
        upvotes: 14,
      },
      {
        id: `c-${t.id}-2`,
        userName: 'Margaret Fletcher',
        userLocation: 'Bristol',
        comment: 'Clear analysis from the WorldScope desk. We need continued transparency regarding long-term fiscal planning.',
        timestamp: '8 mins ago',
        upvotes: 9,
      },
    ],
  };
}
