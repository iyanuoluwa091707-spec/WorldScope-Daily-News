import { Article } from '../../types';
import { createArticle } from '../articleHelpers';

const LIVE_IMAGES = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=1000&q=80',
];

export const CAPTURE_STORIES: Article[] = [
  // 1. Miami Cargo Plane Crash (Exact Match to Left Column in Capture.PNG)
  createArticle({
    id: 'live-miami-plane-crash',
    title: 'At least five dead after Amazon cargo plane speeds off runway at Miami airport',
    lead: 'A further five people are injured, the mayor says. The Boeing plane caught fire after leaving the runway at almost 130mph.',
    category: 'Live',
    subCategory: 'Live News Wire',
    authorName: 'BBC Live Newsdesk',
    authorRole: 'BBC Breaking Wire',
    authorLocation: 'Miami, Florida',
    minutesAgo: 8,
    readTime: 'Continuous Live Text',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Emergency responders surround the burning Boeing cargo fuselage at Miami International Airport',
    imageCredit: 'BBC / EPA',
    paragraphs: [
      'A further five people are injured, the mayor says. The Boeing plane caught fire after leaving the runway at almost 130mph.',
      'Federal Aviation Administration investigators and local fire rescue teams remain on site as runways are temporarily diverted.',
      'Eyewitnesses reported severe smoke billowing across the airfield perimeter during torrential crosswinds.',
    ],
    tags: ['Miami', 'Amazon', 'Aviation', 'Live Updates', 'Breaking News'],
    isBreaking: true,
    isLive: true,
  }),

  // 2. Germany's Far-Right AfD Win (Exact Match to Center Hero in Capture.PNG)
  createArticle({
    id: 'capture-germany-afd-win',
    title: "Germany's far-right AfD set for big win in eastern state, just short of majority",
    lead: 'Germany\'s AfD has hailed a "historic result" and is projected to win 44% of the vote, far ahead of the conservatives on 17%.',
    category: 'News',
    subCategory: 'Elections',
    authorName: 'Damien McGuinness',
    authorRole: 'BBC Berlin Correspondent',
    authorLocation: 'Erfurt, Germany',
    minutesAgo: 22,
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Supporters of the Alternative for Germany party celebrate election exit polls in Thuringia',
    imageCredit: 'Reuters / BBC',
    paragraphs: [
      'Germany\'s AfD has hailed a "historic result" and is projected to win 44% of the vote, far ahead of the conservatives on 17%.',
      'The outcome marks the first time since World War Two that a far-right nationalist party has placed first in a German state parliament election.',
      'Mainstream democratic parties in Berlin and regional capitals have reiterated their firewall pledge, refusing any governing coalition with AfD leadership.',
    ],
    tags: ['Germany', 'AfD', 'Elections', 'Europe', 'Politics'],
    isBreaking: true,
  }),

  // 3. Peace Talks Russia Ukraine (Exact Match to Right Column 1 in Capture.PNG)
  createArticle({
    id: 'capture-peace-talks-ukraine',
    title: 'Peace talks rich in symbolism but fundamental differences between Russia and Ukraine remain',
    lead: 'Despite talks between US envoys and both Putin and Zelensky, the expectation in Kyiv is the fighting will continue, writes James Landale.',
    category: 'News',
    subCategory: 'Global Conflicts',
    authorName: 'James Landale',
    authorRole: 'BBC Diplomatic Correspondent',
    authorLocation: 'Kyiv',
    minutesAgo: 120, // 2 hrs ago
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1520690214107-7377defc44f3?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Diplomatic delegations arrive for bilateral security consultations in neutral European territory',
    imageCredit: 'EPA / BBC',
    paragraphs: [
      'Despite talks between US envoys and both Putin and Zelensky, the expectation in Kyiv is the fighting will continue, writes James Landale.',
      'Territorial sovereignty over occupied eastern provinces and definitive security guarantees remain the core irreconcilable friction points.',
      'European allies maintain that any durable peace agreement must be negotiated from a position of Ukrainian strength and deterrence.',
    ],
    tags: ['Ukraine', 'Russia', 'Diplomacy', 'Europe', 'Peace Talks'],
  }),

  // 4. Indonesia Volcano Eruption (Exact Match to Right Column 2 in Capture.PNG)
  createArticle({
    id: 'capture-volcano-indonesia',
    title: 'Volcano eruption leaves 170,000 passengers stranded in Indonesia',
    lead: 'More than 170,000 airline passengers are stranded after ash was detected in airspace near Jakarta following the eruptions.',
    category: 'News',
    subCategory: 'Natural Disasters',
    authorName: 'Jonathan Head',
    authorRole: 'BBC South East Asia Correspondent',
    authorLocation: 'Jakarta',
    minutesAgo: 420, // 7 hrs ago
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Dense volcanic plume rises kilometers into aviation corridors following catastrophic explosive phase',
    imageCredit: 'AFP / Getty Images',
    paragraphs: [
      'More than 170,000 airline passengers are stranded after ash was detected in airspace near Jakarta following the eruptions.',
      'Aviation authorities closed three international hubs due to the hazard of silica glass particles causing jet engine flameouts.',
      'Disaster management agencies have established emergency relief encampments and distributed protective respirators to nearby settlements.',
    ],
    tags: ['Indonesia', 'Volcano', 'Aviation', 'Asia', 'Travel Disruption'],
  }),

  // 5. Jamaica Slavery Reparations Petition (Exact Match to Right Column 3 in Capture.PNG)
  createArticle({
    id: 'capture-jamaica-reparations',
    title: 'Jamaica to bring slavery reparations petition to King Charles',
    lead: 'The King will be asked to refer three questions to the Judicial Committee of the Privy Council.',
    category: 'News',
    subCategory: 'Commonwealth',
    authorName: 'Sean Coughlan',
    authorRole: 'BBC Royal Correspondent',
    authorLocation: 'Kingston, Jamaica',
    minutesAgo: 180,
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The Jamaican Parliament debates constitutional reform and historic colonial redress',
    imageCredit: 'BBC / Getty Images',
    paragraphs: [
      'The King will be asked to refer three questions to the Judicial Committee of the Privy Council.',
      'The legal petition requests formal advisory opinions regarding historical state accountability and transatlantic chattel slavery.',
      'Caribbean leaders at the Caricom summit affirmed that diplomatic negotiations on restorative justice will continue ahead of the Commonwealth heads meeting.',
    ],
    tags: ['Jamaica', 'Royal Family', 'Reparations', 'Privy Council', 'History'],
  }),
];

const ADDITIONAL_LIVE_STORIES = [
  {
    title: 'Live: UN Security Council emergency session on humanitarian corridors in the Middle East',
    lead: 'Delegates debate binding ceasefire resolution as aid convoys await security clearances at key border crossings.',
    subCategory: 'Global Conflicts',
    author: 'Nafiseh Kohnavard',
    role: 'BBC Middle East Correspondent',
    readTime: 'Rolling Live Wire',
    tags: ['Middle East', 'UN', 'Ceasefire', 'Live'],
  },
  {
    title: 'Live: Premier League Deadline Day Tracker - All confirmed transfers, rumors and medicals',
    lead: 'Follow minute-by-minute coverage as English top-flight clubs rush to finalize multimillion-pound signings before midnight.',
    subCategory: 'Live Sport',
    author: 'Alistair Magowan',
    role: 'BBC Sport Live Editor',
    readTime: 'Rolling Sports Feed',
    tags: ['Premier League', 'Transfers', 'Football', 'Live'],
  },
  {
    title: 'Live: Bank of England interest rate decision and Governor press conference',
    lead: 'Monetary Policy Committee announces latest benchmark borrowing rates alongside revised GDP and inflation forecasts.',
    subCategory: 'Live News Wire',
    author: 'Faisal Islam',
    role: 'BBC Economics Editor',
    readTime: 'Live Market Watch',
    tags: ['Economy', 'Bank of England', 'Inflation', 'Live'],
  },
];

export const LIVE_ARTICLES: Article[] = [
  ...CAPTURE_STORIES,
  ...ADDITIONAL_LIVE_STORIES.map((item, index) => {
    const imgIndex = index % LIVE_IMAGES.length;
    return createArticle({
      id: `live-extra-${index + 1}`,
      title: item.title,
      lead: item.lead,
      category: 'Live',
      subCategory: item.subCategory,
      authorName: item.author,
      authorRole: item.role,
      authorLocation: 'BBC Live Newsdesk',
      minutesAgo: 10 + index * 18,
      readTime: item.readTime,
      imageUrl: LIVE_IMAGES[imgIndex],
      imageCaption: `${item.title.slice(0, 50)}... live reporting feed`,
      imageCredit: 'BBC Live Reporting',
      paragraphs: [
        item.lead,
        'Key events, verified video footage, and expert commentary are published in real time by BBC correspondents on the ground.',
        'Use the filter toggles above to switch between top events, video clips, and chronological minute-by-minute text dispatches.',
      ],
      tags: item.tags,
      isLive: true,
    });
  }),
];
