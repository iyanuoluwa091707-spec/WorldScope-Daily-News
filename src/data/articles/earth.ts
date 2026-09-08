import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const EARTH_IMAGES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
];

const EARTH_STORIES_DATA = [
  {
    title: 'North Sea wind farms shatter European clean power records during spring gales',
    lead: 'Offshore turbine arrays generated 42 gigawatts of electricity in a single 24-hour period, displacing coal and gas power plants across four nations.',
    subCategory: 'Green Energy',
    author: 'Roger Harrabin',
    role: 'BBC Energy & Environment Analyst',
    readTime: '4 min read',
    tags: ['Wind Energy', 'Renewables', 'Climate', 'Europe'],
  },
  {
    title: 'The rewilding triumph: How beaver colonies are preventing devastating flash floods in Devon',
    lead: 'Ten years after captive pairs were reintroduced to English waterways, empirical hydrologic data confirms complex dams trap sediment and slow catastrophic runoff.',
    subCategory: 'Wildlife',
    author: 'Claire Marshall',
    role: 'BBC Rural Affairs Correspondent',
    readTime: '5 min read',
    tags: ['Rewilding', 'Beavers', 'Conservation', 'UK Nature'],
  },
  {
    title: 'Satellite data reveals slowing Amazon deforestation rates following strict satellite policing',
    lead: 'Real-time synthetic aperture radar surveillance and rapid-response federal enforcement have curtailed illegal clearing by 48% across indigenous reserves.',
    subCategory: 'Conservation',
    author: 'Matt McGrath',
    role: 'BBC Environment Correspondent',
    readTime: '5 min read',
    tags: ['Amazon', 'Rainforest', 'Brazil', 'Deforestation'],
  },
  {
    title: 'Deep sea hydrothermal vents: Marine biologists discover 12 new bioluminescent species',
    lead: 'An oceanographic expedition along the Mid-Atlantic Ridge illuminates alien lifeforms thriving in boiling mineral-rich chimneys 3,000 metres below the waves.',
    subCategory: 'Oceans',
    author: 'Dr. Rebecca Morelle',
    role: 'BBC Science Editor',
    readTime: '6 min read',
    tags: ['Oceans', 'Marine Biology', 'Deep Sea', 'Discovery'],
  },
  {
    title: 'Alpine glaciers retreat at unprecedented pace as heatwaves accelerate summer melt',
    lead: 'Swiss researchers warning of irreversible changes to freshwater supplies and hydroelectric reservoirs as ice sheets lose 10% of their mass in two seasons.',
    subCategory: 'Climate',
    author: 'Mark Poynting',
    role: 'BBC Climate Reporter',
    readTime: '5 min read',
    tags: ['Glaciers', 'Climate Change', 'Alps', 'Switzerland'],
  },
  {
    title: 'Urban heat islands: Why planting 50,000 street trees is cooling Mediterranean cities by 3°C',
    lead: 'Civic planners in Seville, Athens and Milan are deploying native canopy species and permeable pavements to counter extreme summer heatwaves.',
    subCategory: 'Natural Wonders',
    author: 'Jonah Fisher',
    role: 'BBC Climate Correspondent',
    readTime: '4 min read',
    tags: ['Urban Greenery', 'Heatwaves', 'Europe', 'Cities'],
  },
  {
    title: 'The Great Barrier Reef: World-first larval seeding techniques boost coral resilience',
    lead: 'Australian marine scientists harvest billions of coral gametes during mass spawning events to regenerate damaged reef sections with heat-tolerant colonies.',
    subCategory: 'Oceans',
    author: 'Shingai Nyoka',
    role: 'BBC Environmental Reporter',
    readTime: '5 min read',
    tags: ['Great Barrier Reef', 'Corals', 'Australia', 'Marine Science'],
  },
  {
    title: 'Iceland’s geothermal super-drill taps magma chamber to pioneer zero-emission baseload power',
    lead: 'Engineers reach temperatures exceeding 450°C to harness supercritical steam, unlocking revolutionary geothermal yields that could supply entire continents.',
    subCategory: 'Green Energy',
    author: 'Victoria Gill',
    role: 'BBC Global Science Correspondent',
    readTime: '6 min read',
    tags: ['Geothermal', 'Iceland', 'Clean Energy', 'Technology'],
  },
];

export const EARTH_ARTICLES: Article[] = EARTH_STORIES_DATA.map((item, index) => {
  const imgIndex = index % EARTH_IMAGES.length;
  return createArticle({
    id: `earth-${index + 1}`,
    title: item.title,
    lead: item.lead,
    category: 'Earth',
    subCategory: item.subCategory,
    authorName: item.author,
    authorRole: item.role,
    authorLocation: 'London',
    minutesAgo: 50 + index * 40,
    readTime: item.readTime,
    imageUrl: EARTH_IMAGES[imgIndex],
    imageCaption: `${item.title.slice(0, 50)}... environmental tracking`,
    imageCredit: 'BBC Earth / NASA Earth Observatory',
    paragraphs: [
      item.lead,
      'Scientific consensus warns that the window to stabilize planetary systems requires synchronized commitments across public policy, technological deployment, and industrial decarbonization.',
      'Field researchers emphasize that localized restoration efforts yield immediate compounding benefits for biodiversity, freshwater security, and regional microclimates.',
      'International climate summits continue to grapple with equitable transition funding and binding accountability mechanisms for global emissions benchmarks.',
    ],
    tags: item.tags,
  });
});
