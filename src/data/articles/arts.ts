import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const ARTS_IMAGES = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1000&q=80',
];

const ARTS_STORIES_DATA = [
  {
    title: 'National Gallery unveils monumental Renaissance rediscovery after five-year restoration',
    lead: 'A previously misattributed oil masterpiece has been authenticated by international conservators following spectroscopic pigment analysis in Trafalgar Square.',
    subCategory: 'Visual Arts',
    author: 'Serena Davenport',
    role: 'BBC Arts Correspondent',
    readTime: '5 min read',
    tags: ['National Gallery', 'Renaissance', 'Art History', 'London'],
  },
  {
    title: 'West End review: Groundbreaking new staging of King Lear challenges contemporary power',
    lead: 'Acclaimed director Miriam Buether strips away theatrical ornament to create a stark, devastating portrait of succession and frailty.',
    subCategory: 'Theatre',
    author: 'Alastair Finch',
    role: 'BBC Theatre Critic',
    readTime: '4 min read',
    tags: ['Theatre', 'West End', 'Shakespeare', 'Reviews'],
  },
  {
    title: 'Stirling Prize shortlist announced: How UK architects are reclaiming urban brownfield spaces',
    lead: 'The Royal Institute of British Architects spotlights six sustainable community projects emphasizing timber framing and circular materials.',
    subCategory: 'Architecture',
    author: 'Helena Berg',
    role: 'BBC Architecture & Design Writer',
    readTime: '6 min read',
    tags: ['Architecture', 'RIBA', 'Stirling Prize', 'Design'],
  },
  {
    title: 'Tate Modern opens expansive survey of kinetic and optical art from postwar Latin America',
    lead: 'Visitors encounter immersive light environments and vibrating geometric sculptures that revolutionized spectator engagement in the 1960s.',
    subCategory: 'Exhibitions',
    author: 'Gabriel Santos',
    role: 'BBC Visual Arts Writer',
    readTime: '5 min read',
    tags: ['Tate Modern', 'Exhibitions', 'Modern Art', 'London'],
  },
  {
    title: 'How digital craftsmanship is transforming Britain’s endangered heritage industries',
    lead: 'From stone masonry to hand-loomed tweed, bespoke craftspeople are blending 3D photogrammetry with centuries-old tactile techniques.',
    subCategory: 'Design',
    author: 'Rowena Campbell',
    role: 'BBC Heritage Correspondent',
    readTime: '4 min read',
    tags: ['Craft', 'Heritage', 'Design', 'Makers'],
  },
  {
    title: 'The photographic mystery of Dorothea Lange’s unseen Depression-era negatives',
    lead: 'An extraordinary archive discovered in an Oakland basement reveals intimate portraits of rural migrant women during the Dust Bowl.',
    subCategory: 'Photography',
    author: 'Marcus Hall',
    role: 'BBC Photojournalism Editor',
    readTime: '6 min read',
    tags: ['Photography', 'History', 'Documentary', 'Exhibitions'],
  },
  {
    title: 'Edinburgh Festival Fringe announces record international programme across 280 venues',
    lead: 'Performers from 64 nations prepare to converge on Scotland’s capital for three weeks of pioneering theatre, satire, and experimental dance.',
    subCategory: 'Theatre',
    author: 'Fiona Macleod',
    role: 'BBC Scotland Arts Editor',
    readTime: '4 min read',
    tags: ['Fringe', 'Edinburgh', 'Theatre', 'Comedy'],
  },
  {
    title: 'Why brutalist concrete masterpieces are undergoing a transatlantic cultural renaissance',
    lead: 'Once reviled as cold and austere, mid-century civic architecture is gaining protected heritage listings and impassioned global defenders.',
    subCategory: 'Architecture',
    author: 'Helena Berg',
    role: 'BBC Architecture Writer',
    readTime: '5 min read',
    tags: ['Brutalism', 'Architecture', 'Urbanism', 'Heritage'],
  },
];

export const ARTS_ARTICLES: Article[] = ARTS_STORIES_DATA.map((item, index) => {
  const imgIndex = index % ARTS_IMAGES.length;
  return createArticle({
    id: `arts-${index + 1}`,
    title: item.title,
    lead: item.lead,
    category: 'Arts',
    subCategory: item.subCategory,
    authorName: item.author,
    authorRole: item.role,
    authorLocation: 'London',
    minutesAgo: 45 + index * 42,
    readTime: item.readTime,
    imageUrl: ARTS_IMAGES[imgIndex],
    imageCaption: `${item.title.slice(0, 50)}... exhibited in major national collection`,
    imageCredit: 'BBC Arts / Getty Images',
    paragraphs: [
      item.lead,
      'The critical reception underscores a decisive turning point in how public institutions present cultural narratives to diverse audiences.',
      'Curators and art historians emphasize that contextual integrity remains paramount when presenting historical works in contemporary spaces.',
      'As visitors return in record numbers, the cultural sector continues to advocate for sustained grassroots arts funding and artistic education.',
    ],
    tags: item.tags,
  });
});
