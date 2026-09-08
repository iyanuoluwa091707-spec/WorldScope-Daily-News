export interface ImagePreset {
  id: string;
  name: string;
  url: string;
  caption: string;
  credit: string;
  category: string;
}

export const MONOCHROME_PRESETS: ImagePreset[] = [
  {
    id: 'westminster',
    name: 'Westminster & Big Ben',
    url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Palace of Westminster and Big Ben clock tower over the River Thames.',
    credit: 'WorldScope / PA Media',
    category: 'UK',
  },
  {
    id: 'football',
    name: 'Football Stadium & Match',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Action under the floodlights during a high-stakes league encounter.',
    credit: 'Getty Images / WorldScope Sport',
    category: 'Sport',
  },
  {
    id: 'f1',
    name: 'Formula 1 Racing',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    caption: 'A single-seater race car powers down the pit straight at Silverstone.',
    credit: 'Silverstone / WorldScope Sport',
    category: 'Sport',
  },
  {
    id: 'tech-quantum',
    name: 'Hardware & Silicon Circuitry',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    caption: 'Advanced semiconductor die showing micro-architecture layout.',
    credit: 'WorldScope Technology Laboratory',
    category: 'Technology',
  },
  {
    id: 'tech-cyber',
    name: 'Cybersecurity & Code',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Data streams and terminal screens at a network monitoring centre.',
    credit: 'WorldScope Cyber Unit',
    category: 'Technology',
  },
  {
    id: 'health-hospital',
    name: 'Hospital & Healthcare',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    caption: 'Specialist clinicians review diagnostic scans in acute care suite.',
    credit: 'NHS England / WorldScope Daily',
    category: 'Health',
  },
  {
    id: 'health-science',
    name: 'Medical Laboratory & Pipette',
    url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Scientific assays prepared inside a cleanroom biological testing facility.',
    credit: 'Medical Research Council / WorldScope Daily',
    category: 'Health',
  },
  {
    id: 'city-business',
    name: 'City of London Financial District',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    caption: 'The Bank of England and financial institutions in the City of London.',
    credit: 'Reuters / WorldScope Business',
    category: 'Business',
  },
  {
    id: 'culture-gallery',
    name: 'Museum & Architectural Gallery',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Exhibition hall showing high-contrast installations and modern sculpture.',
    credit: 'Tate Media / WorldScope Culture',
    category: 'Culture',
  },
];
