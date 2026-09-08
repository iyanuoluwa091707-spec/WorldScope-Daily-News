import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const VIDEO_IMAGES = [
  'https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80',
];

const VIDEO_STORIES_DATA = [
  {
    title: 'Watch Live: WorldScope News 24/7 Channel continuous rolling international news stream',
    lead: 'Watch continuous rolling news coverage, breaking headlines, live press conferences and geopolitical analysis as events unfold across the globe.',
    subCategory: 'Watch Live',
    author: 'WorldScope Newsroom',
    role: 'WorldScope News Channel',
    readTime: 'Live stream',
    tags: ['WorldScope Video', 'Live Stream', 'WorldScope News Channel', 'Video'],
  },
  {
    title: 'Panorama: The shadow fleet transporting oil through European maritime chokepoints',
    lead: 'WorldScope investigative team tracks uninsured supertankers operating under flags of convenience, using satellite AIS spoofing to bypass international sanctions.',
    subCategory: 'Investigations',
    author: 'Richard Bilton',
    role: 'WorldScope Panorama Reporter',
    readTime: '29 min video',
    tags: ['Panorama', 'Investigation', 'Video', 'Maritime'],
  },
  {
    title: 'WorldScope Verify: Analyzing satellite imagery and cockpit audio from the Miami cargo plane crash',
    lead: 'Ros Atkins and the WorldScope Verify team deconstruct the flight telemetry, weather conditions, and runway topography behind the Boeing cargo jet accident.',
    subCategory: 'Explainers',
    author: 'Ros Atkins',
    role: 'WorldScope Analysis Editor',
    readTime: '7 min watch',
    tags: ['WorldScope Verify', 'Aviation', 'Ros Atkins', 'Video'],
  },
  {
    title: 'Match of the Day highlights: Every goal and controversial VAR moment from the Premier League',
    lead: 'Gary Lineker, Alan Shearer and Micah Richards examine Arsenal’s tactical triumph over Chelsea and Liverpool’s contentious Anfield victory.',
    subCategory: 'Sport Highlights',
    author: 'Match of the Day',
    role: 'WorldScope Sport Video',
    readTime: '15 min watch',
    tags: ['Match of the Day', 'Premier League', 'Highlights', 'Sport Video'],
  },
  {
    title: 'Inside the sub-zero laboratory cloning woolly mammoth genetic traits into Asian elephants',
    lead: 'Short-form documentary exploring how CRISPR gene-editing techniques are reviving cold-tolerant phenotypes in an Arctic research park.',
    subCategory: 'Must Watch',
    author: 'Pallab Ghosh',
    role: 'WorldScope Science Video',
    readTime: '12 min video',
    tags: ['Genetics', 'Documentary', 'Science', 'Video'],
  },
  {
    title: 'Witness History: The fall of the Berlin Wall recounted by the border guards on duty',
    lead: 'Archival footage and emotional firsthand accounts recall the chaotic night of 9 November 1989 when Cold War checkpoints opened forever.',
    subCategory: 'Must Watch',
    author: 'Witness History Team',
    role: 'WorldScope Video Archive',
    readTime: '10 min video',
    tags: ['History', 'Berlin Wall', 'Documentary', 'Video'],
  },
];

export const VIDEO_ARTICLES: Article[] = VIDEO_STORIES_DATA.map((item, index) => {
  const imgIndex = index % VIDEO_IMAGES.length;
  return createArticle({
    id: `video-${index + 1}`,
    title: item.title,
    lead: item.lead,
    category: 'Video',
    subCategory: item.subCategory,
    authorName: item.author,
    authorRole: item.role,
    authorLocation: 'WorldScope Daily House, London',
    minutesAgo: 15 + index * 30,
    readTime: item.readTime,
    imageUrl: VIDEO_IMAGES[imgIndex],
    imageCaption: `${item.title.slice(0, 50)}... WorldScope Video stream`,
    imageCredit: 'WorldScope Video / WorldScope Daily',
    paragraphs: [
      item.lead,
      'Watch this full report with subtitles and interactive chapter navigation. Available in HD on web and mobile devices.',
      'WorldScope Verify independently cross-references video documentation with geospatial metadata, flight tracking transponders, and open-source intelligence.',
      'Explore more investigative features, video explainers, and live event coverage on the WorldScope Video hub.',
    ],
    tags: item.tags,
  });
});
