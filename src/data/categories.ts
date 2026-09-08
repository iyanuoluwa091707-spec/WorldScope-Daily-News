import { CategoryInfo } from '../types';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'UK',
    name: 'UK',
    description: 'UK news, politics, policy decisions, and home nation developments.',
    subCategories: ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Politics', 'UK Economy', 'London'],
  },
  {
    id: 'Sport',
    name: 'Sport',
    description: 'Live scores, football, rugby, Formula 1, cricket and international competition.',
    subCategories: ['Football', 'Premier League', 'Formula 1', 'Cricket', 'Rugby Union', 'Tennis', 'Golf'],
  },
  {
    id: 'Health',
    name: 'Health',
    description: 'NHS updates, medical science, public wellbeing, and global medical research.',
    subCategories: ['NHS', 'Medical Science', 'Public Health', 'Mental Health', 'Nutrition', 'Research'],
  },
  {
    id: 'Technology',
    name: 'Technology',
    description: 'Artificial intelligence, cybersecurity, silicon devices, and digital transformation.',
    subCategories: ['Artificial Intelligence', 'Cybersecurity', 'Gadgets', 'Big Tech', 'Space & Tech', 'Computing'],
  },
  {
    id: 'Business',
    name: 'Business',
    description: 'Markets, inflation, companies, economy, and personal finance analysis.',
    subCategories: ['Markets', 'Companies', 'Economy', 'Global Trade', 'Work & Careers', 'Personal Finance'],
  },
  {
    id: 'Culture',
    name: 'Culture',
    description: 'Film, television, literature, music, and the arts across the UK and worldwide.',
    subCategories: ['Film & TV', 'Music', 'Books', 'Art & Design', 'Theatre', 'Architecture'],
  },
  {
    id: 'Arts',
    name: 'Arts',
    description: 'Visual arts, theatre, design, exhibitions, architecture, and cultural heritage.',
    subCategories: ['Visual Arts', 'Theatre', 'Architecture', 'Design', 'Exhibitions', 'Photography'],
  },
  {
    id: 'Travel',
    name: 'Travel',
    description: 'Immersive journeys, train voyages, culinary trails, eco-tourism, and city guides.',
    subCategories: ['Journeys', 'Destinations', 'Food & Drink', 'Sustainable Travel', 'Adventure', 'City Guides'],
  },
  {
    id: 'Earth',
    name: 'Earth',
    description: 'Climate science, natural wonders, biodiversity, green energy transitions, and ocean exploration.',
    subCategories: ['Green Energy', 'Wildlife', 'Conservation', 'Oceans', 'Climate', 'Natural Wonders'],
  },
  {
    id: 'Audio',
    name: 'Audio',
    description: 'WorldScope Audio, podcasts, Radio 4, Radio 5 Live, World Service, and audio documentaries.',
    subCategories: ['Podcasts', 'Radio 4', 'World Service', 'Radio 5 Live', 'Documentaries'],
  },
  {
    id: 'Video',
    name: 'Video',
    description: 'WorldScope Video, live news streams, investigations, explainers, and highlights.',
    subCategories: ['Watch Live', 'Investigations', 'Explainers', 'Sport Highlights', 'Must Watch'],
  },
  {
    id: 'Live',
    name: 'Live',
    description: 'Continuous rolling live coverage, breaking news feeds, and live sports updates.',
    subCategories: ['Live News Wire', 'Live Sport', 'Global Conflicts', 'Elections'],
  },
];
