import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const AUDIO_IMAGES = [
  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80',
];

const AUDIO_STORIES_DATA = [
  {
    title: 'Newscast: What the German state elections mean for European security and NATO',
    lead: 'Adam Fleming and Chris Mason dissect the political earthquake in Thuringia and Saxony with expert insights from Berlin and Brussels.',
    subCategory: 'Podcasts',
    author: 'Adam Fleming & Chris Mason',
    role: 'BBC Newscast Hosts',
    readTime: '38 min episode',
    tags: ['BBC Sounds', 'Newscast', 'Politics', 'Audio'],
  },
  {
    title: 'In Our Time: Melvyn Bragg and guests explore the origins of the Silk Road',
    lead: 'Melvyn Bragg discusses the trans-Eurasian trade routes that connected Han dynasty China with imperial Rome and Islamic dynasties.',
    subCategory: 'Radio 4',
    author: 'Melvyn Bragg',
    role: 'BBC Radio 4 Host',
    readTime: '45 min listen',
    tags: ['In Our Time', 'History', 'Radio 4', 'BBC Sounds'],
  },
  {
    title: 'The Global Story: Inside the covert shipping lanes evading sanctions in the Baltic Sea',
    lead: 'Katya Adler investigates how shadow tankers navigate international waters without tracking transponders, featuring maritime intelligence experts.',
    subCategory: 'World Service',
    author: 'Katya Adler',
    role: 'BBC Europe Editor',
    readTime: '26 min episode',
    tags: ['The Global Story', 'World Service', 'Investigation', 'Audio'],
  },
  {
    title: '5 Live Sport Daily: Premier League title race analysis and Champions League preview',
    lead: 'Mark Chapman, Chris Sutton and Micah Richards debate whether Arsenal’s defensive resilience can hold off Manchester City’s relentless firepower.',
    subCategory: 'Radio 5 Live',
    author: 'Mark Chapman',
    role: 'BBC 5 Live Sport Presenter',
    readTime: '52 min episode',
    tags: ['5 Live', 'Football', 'Premier League', 'Audio'],
  },
  {
    title: 'Desert Island Discs: Acclaimed film director Sir Christopher Nolan selects his eight tracks',
    lead: 'Lauren Laverne interviews the Oscar-winning filmmaker about non-linear storytelling, IMAX celluloid, and the music that shaped his cinema.',
    subCategory: 'Radio 4',
    author: 'Lauren Laverne',
    role: 'BBC Radio 4 Presenter',
    readTime: '44 min listen',
    tags: ['Desert Island Discs', 'Cinema', 'Interviews', 'Music'],
  },
  {
    title: 'The Documentary Podcast: The youth of Nairobi fighting for economic democracy',
    lead: 'How young Kenyan activists harnessed open-source digital tools and community radio to push back against controversial fiscal measures.',
    subCategory: 'Documentaries',
    author: 'Wanjiru Kabiru',
    role: 'BBC World Service Documentaries',
    readTime: '31 min listen',
    tags: ['Documentaries', 'Kenya', 'World Service', 'Audio'],
  },
];

export const AUDIO_ARTICLES: Article[] = AUDIO_STORIES_DATA.map((item, index) => {
  const imgIndex = index % AUDIO_IMAGES.length;
  return createArticle({
    id: `audio-${index + 1}`,
    title: item.title,
    lead: item.lead,
    category: 'Audio',
    subCategory: item.subCategory,
    authorName: item.author,
    authorRole: item.role,
    authorLocation: 'London Broadcasting House',
    minutesAgo: 25 + index * 35,
    readTime: item.readTime,
    imageUrl: AUDIO_IMAGES[imgIndex],
    imageCaption: `${item.title.slice(0, 50)}... BBC Sounds broadcast`,
    imageCredit: 'BBC Sounds / BBC Audio',
    paragraphs: [
      item.lead,
      'Listen live or download on-demand on BBC Sounds for seamless listening across mobile, smart speakers, and web browsers.',
      'Audio dispatches feature exclusive interviews with policymakers, eyewitness testimonies, and deep-dive analytical context from BBC correspondents worldwide.',
      'Subscribe to the series on BBC Sounds or wherever you get your podcasts to receive daily briefings automatically.',
    ],
    tags: item.tags,
  });
});
