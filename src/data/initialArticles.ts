import { Article } from '../types';
import { UK_ARTICLES } from './articles/uk';
import { SPORT_ARTICLES } from './articles/sport';
import { HEALTH_ARTICLES } from './articles/health';
import { TECH_ARTICLES } from './articles/technology';
import { BIZ_ARTICLES } from './articles/business';
import { CULTURE_ARTICLES } from './articles/culture';
import { ARTS_ARTICLES } from './articles/arts';
import { TRAVEL_ARTICLES } from './articles/travel';
import { EARTH_ARTICLES } from './articles/earth';
import { AUDIO_ARTICLES } from './articles/audio';
import { VIDEO_ARTICLES } from './articles/video';
import { LIVE_ARTICLES, CAPTURE_STORIES } from './articles/live';

// Combine all article sets, ensuring screenshot capture stories lead
const ALL_COLLECTED: Article[] = [
  ...CAPTURE_STORIES,
  ...UK_ARTICLES,
  ...SPORT_ARTICLES,
  ...HEALTH_ARTICLES,
  ...TECH_ARTICLES,
  ...BIZ_ARTICLES,
  ...CULTURE_ARTICLES,
  ...ARTS_ARTICLES,
  ...TRAVEL_ARTICLES,
  ...EARTH_ARTICLES,
  ...AUDIO_ARTICLES,
  ...VIDEO_ARTICLES,
  ...LIVE_ARTICLES,
];

// Deduplicate by ID and sort chronologically, keeping capture stories at the summit
const seenIds = new Set<string>();
const uniqueArticles: Article[] = [];
for (const art of ALL_COLLECTED) {
  if (!seenIds.has(art.id)) {
    seenIds.add(art.id);
    uniqueArticles.push(art);
  }
}

export const INITIAL_ARTICLES: Article[] = uniqueArticles;

