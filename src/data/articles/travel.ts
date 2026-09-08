import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const TRAVEL_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
];

const TRAVEL_STORIES_DATA = [
  {
    title: 'The Great Highland Sleeper: A cinematic railway voyage through Scotland’s untamed lochs',
    lead: 'Rattling north from London Euston into misty heather-covered glens, this legendary overnight rail journey remains Britain’s ultimate romantic escape.',
    subCategory: 'Journeys',
    author: 'Callum Stewart',
    role: 'BBC Travel Writer',
    readTime: '6 min read',
    tags: ['Scotland', 'Train Travel', 'Highlands', 'UK'],
  },
  {
    title: 'Beyond the Amalfi crowds: Walking the forgotten cliffside trails of the Cilento peninsula',
    lead: 'Tucked south of Salerno, centuries-old mule tracks wind through olive groves, ancient Greek temples, and secluded coastal villages untouched by mass tourism.',
    subCategory: 'Destinations',
    author: 'Lucia Ferri',
    role: 'BBC Southern Europe Travel Editor',
    readTime: '5 min read',
    tags: ['Italy', 'Hiking', 'Mediterranean', 'Slow Travel'],
  },
  {
    title: 'Tokyo after dark: The secret izakayas hidden behind neon vending machines',
    lead: 'Navigating the subterranean drinking dens and yakitori counters of Shinjuku and Shimokitazawa reveals the warm, communal heart of the metropolis.',
    subCategory: 'Food & Drink',
    author: 'Kenji Sato',
    role: 'BBC Asia Travel Correspondent',
    readTime: '5 min read',
    tags: ['Japan', 'Tokyo', 'Food & Drink', 'Nightlife'],
  },
  {
    title: 'The eco-expeditions charting a sustainable future for the Galápagos archipelago',
    lead: 'Solar-powered catamarans and strict marine sanctuary limits are demonstrating how conservation science and low-impact tourism can safeguard pristine ecosystems.',
    subCategory: 'Sustainable Travel',
    author: 'Maria Elena Silva',
    role: 'BBC Environmental Travel Reporter',
    readTime: '6 min read',
    tags: ['Galapagos', 'Eco-Tourism', 'Wildlife', 'Ecuador'],
  },
  {
    title: 'High in the Tian Shan: Trekking alongside Kyrgyzstan’s semi-nomadic eagle hunters',
    lead: 'Sleeping in felt yurts beside high-altitude alpine lakes offers a rare glimpse into ancient Central Asian equestrian traditions.',
    subCategory: 'Adventure',
    author: 'Damian Cross',
    role: 'BBC Adventure Travel Writer',
    readTime: '7 min read',
    tags: ['Kyrgyzstan', 'Adventure', 'Culture', 'Mountains'],
  },
  {
    title: '48 hours in San Sebastián: The pintxo bars where culinary perfection is an art form',
    lead: 'From slow-cooked txuleta to Basque cheesecake, why this jewel of the Bay of Biscay holds more Michelin stars per square metre than almost anywhere on Earth.',
    subCategory: 'City Guides',
    author: 'Elena Gomez',
    role: 'BBC Food & Culture Editor',
    readTime: '4 min read',
    tags: ['Spain', 'San Sebastian', 'Basque Country', 'Gastronomy'],
  },
  {
    title: 'The revival of Europe’s night trains: 10 new sleeper routes connecting Paris, Vienna and Berlin',
    lead: 'With climate-conscious travellers ditching regional flights, continental rail operators are investing billions in high-comfort sleeper carriages.',
    subCategory: 'Journeys',
    author: 'Simon Calder',
    role: 'BBC Senior Travel Correspondent',
    readTime: '5 min read',
    tags: ['Europe', 'Rail Travel', 'Nightjet', 'Sustainability'],
  },
  {
    title: 'Iceland’s Westfjords: Why road-tripping Europe’s wildest coastline will leave you breathless',
    lead: 'Dramatic sheer bird cliffs, red sand beaches, and steaming natural hot springs await along the winding gravel tracks of the far northwest.',
    subCategory: 'Destinations',
    author: 'Astrid Lind',
    role: 'BBC Nordic Travel Writer',
    readTime: '6 min read',
    tags: ['Iceland', 'Road Trips', 'Arctic', 'Nature'],
  },
];

export const TRAVEL_ARTICLES: Article[] = TRAVEL_STORIES_DATA.map((item, index) => {
  const imgIndex = index % TRAVEL_IMAGES.length;
  return createArticle({
    id: `travel-${index + 1}`,
    title: item.title,
    lead: item.lead,
    category: 'Travel',
    subCategory: item.subCategory,
    authorName: item.author,
    authorRole: item.role,
    authorLocation: 'London',
    minutesAgo: 60 + index * 48,
    readTime: item.readTime,
    imageUrl: TRAVEL_IMAGES[imgIndex],
    imageCaption: `${item.title.slice(0, 50)}... photo dispatch`,
    imageCredit: 'BBC Travel / Lonely Planet Images',
    paragraphs: [
      item.lead,
      'Travellers seeking authentic cultural connections are increasingly trading checklist sightseeing for deeper, slower, and more contemplative encounters with local hosts.',
      'Regional tourism boards are adapting by dispersing visitors into rural heartlands, supporting community cooperatives and preserving fragile natural habitats.',
      'Practical guidance: pack lightweight layers, embrace public transit where available, and respect local customs and seasonal weather advisories.',
    ],
    tags: item.tags,
  });
});
