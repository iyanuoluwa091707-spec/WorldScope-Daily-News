import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';
import { 
  Play, 
  Volume2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  Trophy, 
  Flame, 
  X,
  Radio,
  ExternalLink,
  Table,
  Activity,
  Award,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { LiveScoreHub } from './LiveScoreHub';
import {
  PREMIER_LEAGUE_FIXTURES,
  CHAMPIONSHIP_FIXTURES,
  PREMIER_LEAGUE_TABLE,
  CHAMPIONSHIP_TABLE,
  CHAMPIONS_LEAGUE_TABLE,
  LEAGUE_ONE_TABLE,
  BBC_PUNDIT_STORIES,
  MatchFixture
} from '../data/sportFootballData';

interface SportViewProps {
  articles: Article[];
  activeSubCategory?: string;
  onSelectSubCategory: (subCat?: string) => void;
  onSelectArticle: (article: Article) => void;
  onOpenNewsletters: (initialId?: string) => void;
}

const ARTICLES_PER_PAGE = 50;

const SPORT_SUBNAV = [
  { label: 'Home', value: undefined },
  { label: 'LiveScores & Tables', value: 'LiveScores' },
  { label: 'Champions League', value: 'Champions League' },
  { label: 'Premier League', value: 'Premier League' },
  { label: 'Championship', value: 'Championship' },
  { label: 'League One', value: 'League One' },
  { label: 'Football', value: 'Football' },
  { label: 'Pundits', value: 'Pundits' },
  { label: 'Cricket', value: 'Cricket' },
  { label: 'Formula 1', value: 'Formula 1' },
  { label: 'Rugby U', value: 'Rugby Union' },
  { label: 'Tennis', value: 'Tennis' },
  { label: 'Golf', value: 'Golf' },
];

const PREMIER_LEAGUE_CLUBS = [
  'Arsenal',
  'Man City',
  'Liverpool',
  'Aston Villa',
  'Chelsea',
  'Tottenham',
  'Man Utd',
  'Newcastle',
  'Everton',
];

const VIDEO_ITEMS = [
  {
    id: 'vid-1',
    title: "PFA Young Player of the Year - 'A huge award' - O'Reilly",
    duration: '3:08',
    tag: 'Football • 16h',
    badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'vid-2',
    title: "PFA Young Player of the Year - 'Super proud' - Smith wins",
    duration: '3:35',
    tag: 'Football • 16h',
    badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'vid-3',
    title: 'Alonso says Chelsea had a difficult test',
    duration: '1:31',
    tag: 'Arsenal • 18h',
    badge: 'REACTION',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'vid-4',
    title: 'Watch: Moment humanoid robot opens tournament',
    duration: '0:46',
    tag: 'Golf • 15h',
    badge: null,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  },
  {
    id: 'vid-5',
    title: 'I saw some things I liked in camp - coach',
    duration: '2:15',
    tag: 'Athletics • 1d',
    badge: 'INTERVIEW',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  },
];

const PODCAST_ITEMS = [
  {
    id: 'pod-1',
    title: 'The Cartel - with Steven Finn & Mark Wood',
    duration: '54 mins',
    station: 'WorldScope 5 Live',
    availability: 'Available for over a year',
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pod-2',
    title: 'US Open: 30 years of the Williams sisters',
    duration: '35 mins',
    station: 'WorldScope 5 Live',
    availability: 'Available for over a year',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pod-3',
    title: "Discover the WorldScope's best sports podcasts",
    duration: '42 mins',
    station: 'WorldScope Audio',
    availability: 'Updated weekly',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
  },
];

const LIVE_SCORES = [
  { home: 'Arsenal', homeScore: '2', away: 'Chelsea', awayScore: '1', status: 'FT', comp: 'Premier League' },
  { home: 'Man City', homeScore: '3', away: 'Brighton', awayScore: '1', status: 'FT', comp: 'Premier League' },
  { home: 'Liverpool', homeScore: '1', away: 'Man Utd', awayScore: '0', status: '82\'', comp: 'Premier League' },
  { home: 'Tottenham', homeScore: '2', away: 'Newcastle', awayScore: '2', status: 'FT', comp: 'Premier League' },
  { home: 'Real Madrid', homeScore: '3', away: 'Sevilla', awayScore: '0', status: 'FT', comp: 'La Liga' },
];

export const SportView: React.FC<SportViewProps> = ({
  articles,
  activeSubCategory,
  onSelectSubCategory,
  onSelectArticle,
  onOpenNewsletters,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<(typeof VIDEO_ITEMS)[0] | null>(null);
  const [activeAudio, setActiveAudio] = useState<(typeof PODCAST_ITEMS)[0] | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [scoreboardComp, setScoreboardComp] = useState<'Champions League' | 'Premier League' | 'Championship' | 'League One'>('Champions League');
  const [showTableModal, setShowTableModal] = useState(false);
  const [activeTableTab, setActiveTableTab] = useState<'Champions League' | 'Premier League' | 'Championship' | 'League One'>('Premier League');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedClubFilter(null);
    if (activeSubCategory === 'LiveScores' || activeSubCategory === 'Champions League' || activeSubCategory === 'Premier League' || activeSubCategory === 'Championship' || activeSubCategory === 'League One') {
      setShowScoreboard(true);
      if (activeSubCategory !== 'LiveScores') {
        setScoreboardComp(activeSubCategory as any);
        setActiveTableTab(activeSubCategory as any);
      }
    }
  }, [activeSubCategory]);

  // Filter sport articles
  const sportArticles = articles.filter(
    (a) => a.category.toLowerCase() === 'sport'
  );

  const subCatFiltered = activeSubCategory
    ? sportArticles.filter((a) => {
        const target = activeSubCategory.toLowerCase();
        if (target === 'livescores') {
          return true;
        }
        if (target === 'football') {
          return (
            a.subCategory?.toLowerCase() === 'football' ||
            a.subCategory?.toLowerCase() === 'premier league' ||
            a.subCategory?.toLowerCase() === 'champions league' ||
            a.subCategory?.toLowerCase() === 'championship' ||
            a.subCategory?.toLowerCase() === 'league one' ||
            a.subCategory?.toLowerCase() === 'pundits' ||
            a.tags.some((t) =>
              ['football', 'premier league', 'champions league', 'championship', 'league one', 'pundits'].includes(t.toLowerCase())
            )
          );
        }
        if (target === 'champions league') {
          return (
            a.subCategory?.toLowerCase() === 'champions league' ||
            a.tags.some((t) => t.toLowerCase().includes('champions') || t.toLowerCase() === 'ucl') ||
            a.title.toLowerCase().includes('champions league') ||
            a.title.toLowerCase().includes('madrid') ||
            a.title.toLowerCase().includes('bayern') ||
            a.title.toLowerCase().includes('barcelona') ||
            a.title.toLowerCase().includes('inter') ||
            a.title.toLowerCase().includes('psg')
          );
        }
        if (target === 'league one') {
          return (
            a.subCategory?.toLowerCase() === 'league one' ||
            a.tags.some((t) => t.toLowerCase() === 'league one' || t.toLowerCase() === 'efl') ||
            a.title.toLowerCase().includes('wrexham') ||
            a.title.toLowerCase().includes('birmingham') ||
            a.title.toLowerCase().includes('league one')
          );
        }
        return (
          a.subCategory?.toLowerCase() === target ||
          a.tags.some((t) => t.toLowerCase() === target) ||
          a.title.toLowerCase().includes(target)
        );
      })
    : sportArticles;

  const filteredArticles = selectedClubFilter
    ? subCatFiltered.filter(
        (a) =>
          a.title.toLowerCase().includes(selectedClubFilter.toLowerCase()) ||
          a.lead.toLowerCase().includes(selectedClubFilter.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase() === selectedClubFilter.toLowerCase())
      )
    : subCatFiltered;

  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  // Pick lead stories matching 5.PNG and 6.PNG
  const heroLive = pageArticles.find((a) => a.isLive) || pageArticles[0];
  const middleStory1 = pageArticles.find((a) => a.title.includes('Havertz') || a.id !== heroLive?.id) || pageArticles[1];
  const middleStory2 = pageArticles.find((a) => a.title.includes('Irish Open') || (a.id !== heroLive?.id && a.id !== middleStory1?.id)) || pageArticles[2];
  
  const rightHeadlines = pageArticles.filter(
    (a) => a.id !== heroLive?.id && a.id !== middleStory1?.id && a.id !== middleStory2?.id
  ).slice(0, 4);

  // Section 2 feature (Katie Taylor boxing story - 6.PNG)
  const boxingFeature = pageArticles.find((a) => a.title.includes('Taylor') || a.subCategory === 'Boxing') || pageArticles[3];
  
  // 2x3 Grid stories (6.PNG)
  const gridStories = pageArticles.filter(
    (a) =>
      a.id !== heroLive?.id &&
      a.id !== middleStory1?.id &&
      a.id !== middleStory2?.id &&
      !rightHeadlines.some((rh) => rh.id === a.id) &&
      a.id !== boxingFeature?.id
  ).slice(0, 6);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById('sport-continuous-feed');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white font-sans">
      
      {/* 
        ========================================================================
        1. BBC SPORT HEADER BANNER (Vibrant Yellow #FFD200 - Exact match to 5.PNG)
        ========================================================================
      */}
      <div className="w-full bg-[#FFD200] text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-0">
          
          {/* Main Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black uppercase select-none">
                SPORT
              </h1>
              <span className="text-xs font-bold tracking-widest text-black/80 uppercase hidden sm:inline-block">
                WorldScope Sport Online
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onOpenNewsletters('football-extra')}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Football Extra Newsletter</span>
              </button>
            </div>
          </div>

          {/* Subnav row on Yellow Banner (5.PNG) */}
          <nav className="flex items-center overflow-x-auto no-scrollbar space-x-1 sm:space-x-3 text-xs sm:text-sm font-bold text-black border-t border-black/15 pt-2 pb-2">
            {SPORT_SUBNAV.map((sub) => {
              const isActive = activeSubCategory === sub.value;
              return (
                <button
                  key={sub.label}
                  type="button"
                  onClick={() => onSelectSubCategory(sub.value)}
                  className={`px-2 py-1 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-black font-black'
                      : 'border-transparent hover:border-black/50 text-neutral-900'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onSelectSubCategory(undefined)}
              className="px-2 py-1 whitespace-nowrap text-neutral-800 hover:text-black cursor-pointer font-bold"
            >
              All Topics ({totalArticles})
            </button>
          </nav>
        </div>
      </div>

      {/* 
        ========================================================================
        2. SECONDARY BLACK RIBBON (Exact match to 5.PNG)
        ========================================================================
      */}
      <div className="w-full bg-black text-white text-xs font-bold border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-2.5">
            <button
              type="button"
              onClick={() => onSelectSubCategory(undefined)}
              className="border-b-2 border-[#FFD200] pb-0.5 text-white flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap"
            >
              <span>{activeSubCategory ? activeSubCategory : 'Home'}</span>
              <ChevronRight className="w-3 h-3 text-[#FFD200]" />
            </button>
            <button
              type="button"
              onClick={() => setShowScoreboard((prev) => !prev)}
              className="text-[#FFD200] hover:text-white flex items-center gap-1 cursor-pointer whitespace-nowrap font-bold"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FFD200]" />
              <span>LiveScore API, Tables & Fixtures</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showScoreboard ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => onOpenNewsletters('football-extra')}
              className="text-neutral-300 hover:text-white hidden sm:inline-block cursor-pointer whitespace-nowrap"
            >
              Newsletter Special
            </button>
          </div>

          <div className="text-[11px] text-neutral-400 hidden md:block whitespace-nowrap">
            Showing 50 latest articles per page
          </div>
        </div>

        {/* Expandable LiveScore API Hub & Standings */}
        {showScoreboard && (
          <div className="bg-black">
            <LiveScoreHub 
              initialComp={
                ['Champions League', 'Premier League', 'Championship', 'League One'].includes(activeSubCategory || '')
                  ? activeSubCategory
                  : scoreboardComp
              }
              onSelectTeamFilter={(team) => {
                setSelectedClubFilter(team);
                const feed = document.getElementById('sport-continuous-feed');
                if (feed) feed.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>

      {/* Main Sport Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">

        {/* 
          ======================================================================
          3. LEAD SPORT 3-COLUMN GRID (Exact replica of Image 5.PNG)
          ======================================================================
        */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 border-b border-gray-200 pb-10">
          
          {/* Column 1: Wide Lead Story (Arsenal / Arteta & Carrick live story) */}
          {heroLive && (
            <div
              className="lg:col-span-5 group cursor-pointer"
              onClick={() => onSelectArticle(heroLive)}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                <img
                  src={heroLive.imageUrl}
                  alt={heroLive.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Green LIVE circle & Title (5.PNG) */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-black group-hover:underline">
                  <span className="inline-flex items-center text-[#138048] mr-2 font-black">
                    <span className="w-3 h-3 rounded-full border-2 border-[#138048] inline-block mr-1.5 animate-pulse" />
                    LIVE
                  </span>
                  {heroLive.title}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {heroLive.lead}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                  <span>{heroLive.subCategory || 'Football'}</span>
                  <span>•</span>
                  <span>{heroLive.timestampDisplay}</span>
                </div>
              </div>
            </div>
          )}

          {/* Column 2: Middle 2 Stories with Photos (Havertz & Irish Open - 5.PNG) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            {middleStory1 && (
              <div
                className="group cursor-pointer flex flex-col"
                onClick={() => onSelectArticle(middleStory1)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-2.5">
                  <img
                    src={middleStory1.imageUrl}
                    alt={middleStory1.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black leading-snug group-hover:underline">
                  {middleStory1.title}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                  <span>{middleStory1.subCategory || 'Arsenal'}</span>
                  <span>•</span>
                  <span>{middleStory1.timestampDisplay}</span>
                </div>
              </div>
            )}

            {middleStory2 && (
              <div
                className="group cursor-pointer flex flex-col pt-4 border-t border-gray-200"
                onClick={() => onSelectArticle(middleStory2)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-2.5">
                  <img
                    src={middleStory2.imageUrl}
                    alt={middleStory2.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black leading-snug group-hover:underline">
                  {middleStory2.title}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                  <span>{middleStory2.subCategory || 'Golf'}</span>
                  <span>•</span>
                  <span>{middleStory2.timestampDisplay}</span>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Right Text Headlines Stream (Quiz coach, Alcaraz, Dunkley, Police - 5.PNG) */}
          <div className="lg:col-span-3 flex flex-col justify-between divide-y divide-gray-200">
            {rightHeadlines.map((item, idx) => (
              <div
                key={item.id}
                className={`group cursor-pointer ${idx === 0 ? 'pb-4' : 'py-4'} flex flex-col justify-between`}
                onClick={() => onSelectArticle(item)}
              >
                <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline">
                  {item.title}
                </h4>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                  <span>{item.subCategory || 'Sport'}</span>
                  <span>•</span>
                  <span>{item.timestampDisplay}</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 
          ======================================================================
          4. SECOND SECTION (Exact replica of Image 6.PNG)
             - Left: Katie Taylor Swansong (Boxing)
             - Right: 2x3 Grid of Sport Cards
          ======================================================================
        */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 border-b border-gray-200 pb-12">
          
          {/* Left Feature: Katie Taylor swansong (6.PNG) */}
          {boxingFeature && (
            <div
              className="lg:col-span-5 group cursor-pointer"
              onClick={() => onSelectArticle(boxingFeature)}
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-gray-100 mb-3">
                <img
                  src={boxingFeature.imageUrl}
                  alt={boxingFeature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight group-hover:underline mb-2">
                {boxingFeature.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {boxingFeature.lead}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                <span>{boxingFeature.subCategory || 'Boxing'}</span>
                <span>•</span>
                <span>{boxingFeature.timestampDisplay}</span>
              </div>
            </div>
          )}

          {/* Right: 2x3 Grid of Sport Cards (6.PNG) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {gridStories.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectArticle(item)}
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline line-clamp-3">
                    {item.title}
                  </h4>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#138048]">
                  <span>{item.subCategory || 'Sport'}</span>
                  <span>•</span>
                  <span>{item.timestampDisplay}</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 
          ======================================================================
          PREMIER LEAGUE MATCH CENTER & CLUB HUBS
          ======================================================================
        */}
        <section className="border-b border-gray-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b-2 border-black gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFD200] text-black text-[11px] font-black uppercase px-2 py-0.5 tracking-wider">
                  MATCHDAY ROUND-UP
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                  Live Debriefs
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1">
                Premier League Games & Title Race
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Arsenal edge Chelsea in London derby drama, Haaland powers Man City, and Liverpool triumph in contentious Anfield clash.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTableTab('Premier League');
                  setShowTableModal(true);
                }}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3.5 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Table className="w-3.5 h-3.5 text-[#FFD200]" />
                <span>Premier League Table</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectSubCategory('Premier League')}
                className="border border-black hover:bg-gray-100 text-black text-xs font-bold px-3.5 py-2 uppercase tracking-wider transition-colors cursor-pointer"
              >
                All PL Stories
              </button>
            </div>
          </div>

          {/* Club Filter Chips */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex-shrink-0">
              Club Focus:
            </span>
            <button
              type="button"
              onClick={() => setSelectedClubFilter(null)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                selectedClubFilter === null
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              All Clubs
            </button>
            {PREMIER_LEAGUE_CLUBS.map((club) => (
              <button
                key={club}
                type="button"
                onClick={() => setSelectedClubFilter(selectedClubFilter === club ? null : club)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  selectedClubFilter === club
                    ? 'bg-[#FFD200] text-black border border-black'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {club}
              </button>
            ))}
          </div>

          {/* Premier League Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Game 1: Arsenal 2-1 Chelsea */}
            <div
              className="bg-neutral-50 border border-neutral-200 p-5 hover:border-black transition-colors cursor-pointer flex flex-col justify-between group"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Havertz') || a.title.includes('Arsenal'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3">
                  <span className="uppercase tracking-wider">Emirates Stadium</span>
                  <span className="bg-black text-[#FFD200] px-2 py-0.5 text-[10px] font-mono">FT: 2 - 1</span>
                </div>
                <h4 className="text-lg font-bold text-black group-hover:underline leading-snug mb-2">
                  No striker, no problem: Havertz & Odegaard dissect Chelsea
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Arteta's side executed a high-pressing masterclass in north London, holding off late Enzo Maresca tactical shifts.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="font-bold text-[#138048]">Tactical Match Report</span>
                <span className="text-gray-400 group-hover:text-black transition-colors">Read debrief →</span>
              </div>
            </div>

            {/* Game 2: Liverpool 1-0 Man Utd */}
            <div
              className="bg-neutral-50 border border-neutral-200 p-5 hover:border-black transition-colors cursor-pointer flex flex-col justify-between group"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Man Utd') || a.title.includes('Salah'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3">
                  <span className="uppercase tracking-wider">Anfield</span>
                  <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-mono animate-pulse">88' LIVE: 1 - 0</span>
                </div>
                <h4 className="text-lg font-bold text-black group-hover:underline leading-snug mb-2">
                  Salah penalty settles ferocious northwest derby
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Slot's relentless Liverpool controlled territory as Amorim's Manchester United struggled to generate clear-cut opportunities.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="font-bold text-red-600">Live Commentary & xG</span>
                <span className="text-gray-400 group-hover:text-black transition-colors">Join live text →</span>
              </div>
            </div>

            {/* Game 3: Man City 3-1 Brighton */}
            <div
              className="bg-neutral-50 border border-neutral-200 p-5 hover:border-black transition-colors cursor-pointer flex flex-col justify-between group"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Haaland') || a.title.includes('Shearer'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-3">
                  <span className="uppercase tracking-wider">Etihad Stadium</span>
                  <span className="bg-black text-[#FFD200] px-2 py-0.5 text-[10px] font-mono">FT: 3 - 1</span>
                </div>
                <h4 className="text-lg font-bold text-black group-hover:underline leading-snug mb-2">
                  Haaland double keeps champions on Arsenal's heels
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Guardiola praised the Norwegian's blindside runs and Phil Foden's spatial awareness against Fabian Hürzeler's energetic Seagulls.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="font-bold text-[#138048]">Manager Reaction & Video</span>
                <span className="text-gray-400 group-hover:text-black transition-colors">View analysis →</span>
              </div>
            </div>
          </div>
        </section>

        {/* 
          ======================================================================
          BBC PUNDITS & MATCH OF THE DAY ANALYSIS SECTION
          ======================================================================
        */}
        <section className="border-b border-gray-200 pb-12">
          <div className="bg-black text-white p-6 sm:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FFD200] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">
                    WORLDSCOPE SPORT EXCLUSIVE
                  </span>
                  <span className="text-neutral-400 text-xs font-bold">
                    Match of the Day & WorldScope Live
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  WorldScope Pundits & Analysis
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
                  Alan Shearer, Gary Lineker, Chris Sutton, Micah Richards, Pat Nevin and Karen Carney dissect the weekend's pivotal tactical battles and refereeing controversies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectSubCategory('Pundits')}
                className="self-start md:self-auto bg-[#FFD200] text-black hover:bg-yellow-400 font-black text-xs px-4 py-2.5 uppercase tracking-wider cursor-pointer transition-colors whitespace-nowrap"
              >
                All Pundit Columns ({BBC_PUNDIT_STORIES.length})
              </button>
            </div>
          </div>

          {/* 6 Pundit Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BBC_PUNDIT_STORIES.map((pundit) => (
              <div
                key={pundit.id}
                onClick={() => {
                  const match = articles.find(
                    (a) =>
                      a.title.toLowerCase().includes(pundit.punditName.toLowerCase()) ||
                      a.lead.toLowerCase().includes(pundit.punditName.toLowerCase())
                  );
                  if (match) {
                    onSelectArticle(match);
                  } else {
                    onSelectSubCategory('Pundits');
                  }
                }}
                className="bg-white border border-neutral-200 hover:border-black p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group hover:shadow-md"
              >
                <div>
                  {/* Pundit Header Avatar & Role */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={pundit.punditImage}
                      alt={pundit.punditName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FFD200]"
                    />
                    <div>
                      <h4 className="text-sm font-black text-black group-hover:underline leading-tight">
                        {pundit.punditName}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                        {pundit.punditRole}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="inline-block bg-neutral-100 text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-wider mb-2">
                    {pundit.tag}
                  </div>

                  {/* Title */}
                  <h5 className="text-base font-bold text-black leading-snug group-hover:underline mb-3">
                    {pundit.title}
                  </h5>

                  {/* Pull Quote */}
                  <blockquote className="bg-neutral-50 border-l-3 border-[#FFD200] p-3 text-xs italic text-gray-700 leading-relaxed mb-4">
                    “{pundit.quote}”
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#138048]">{pundit.topicCategory} • {pundit.readTime}</span>
                  <span className="text-neutral-400 group-hover:text-black flex items-center gap-1">
                    Read column <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 
          ======================================================================
          EFL CHAMPIONSHIP CENTRAL: THE 46-GAME MARATHON
          ======================================================================
        */}
        <section className="border-b border-gray-200 pb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b-2 border-black gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#138048] text-white text-[11px] font-black uppercase px-2 py-0.5 tracking-wider">
                  EFL CHAMPIONSHIP
                </span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  The 46-Game Marathon
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1">
                Championship Promotion Race & Battles
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Leeds storm back to the top of the table, Sheffield derby thriller decided at Bramall Lane, and Burnley lock down their fourth straight clean sheet.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTableTab('Championship');
                  setShowTableModal(true);
                }}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-3.5 py-2 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Table className="w-3.5 h-3.5 text-[#FFD200]" />
                <span>Championship Table</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectSubCategory('Championship')}
                className="border border-black hover:bg-gray-100 text-black text-xs font-bold px-3.5 py-2 uppercase tracking-wider transition-colors cursor-pointer"
              >
                All Championship Stories
              </button>
            </div>
          </div>

          {/* Promotion & Playoff Tracker Ribbon */}
          <div className="bg-neutral-900 text-white p-4 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black uppercase text-[#FFD200] tracking-widest flex-shrink-0">
                TOP SIX STANDINGS:
              </span>
              {CHAMPIONSHIP_TABLE.slice(0, 6).map((tm) => (
                <div
                  key={tm.pos}
                  className="inline-flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 text-xs flex-shrink-0"
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    tm.pos <= 2 ? 'bg-[#138048] text-white' : 'bg-[#FFD200] text-black'
                  }`}>
                    {tm.pos}
                  </span>
                  <span className="font-bold">{tm.team}</span>
                  <span className="text-gray-400 font-mono text-[11px]">{tm.pts}pts</span>
                </div>
              ))}
            </div>

            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              🟢 Top 2 Automatic • 🟡 3-6 Playoffs
            </span>
          </div>

          {/* Championship Featured Stories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Story 1: Leeds United */}
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Leeds'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                    alt="Leeds United Elland Road"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#FFD200] text-black px-2 py-0.5 text-[9px] font-black uppercase">
                    FT: Leeds 3-1 Sunderland
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline">
                  Leeds storm back to Championship summit in high-octane Elland Road triumph
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  Daniel Farke's pressing structure overwhelmed Sunderland to reclaim pole position in the promotion race.
                </p>
              </div>
              <div className="mt-2 text-xs font-bold text-[#138048]">
                Championship • 2h ago
              </div>
            </div>

            {/* Story 2: Steel City Derby */}
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Sheffield'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80"
                    alt="Steel City derby"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-[9px] font-black uppercase">
                    DERBY DRAMA
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline">
                  Steel City derby glory: Sheffield United edge Wednesday in electric Bramall Lane atmosphere
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  Gustavo Hamer's sublime first-half volley decides the fiercest cross-city clash in Yorkshire.
                </p>
              </div>
              <div className="mt-2 text-xs font-bold text-[#138048]">
                Championship • 4h ago
              </div>
            </div>

            {/* Story 3: Sunderland */}
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Sunderland') || a.tags.includes('Sunderland'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
                    alt="Sunderland wonderkids"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase">
                    FEATURE
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline">
                  Inside Sunderland's youthful revolution: Why the Black Cats refuse to fear anyone
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  How a squad with the lowest average age in the league is challenging for automatic promotion.
                </p>
              </div>
              <div className="mt-2 text-xs font-bold text-[#138048]">
                Championship • 6h ago
              </div>
            </div>

            {/* Story 4: Burnley */}
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => {
                const report = articles.find((a) => a.title.includes('Burnley') || a.title.includes('West Brom'));
                if (report) onSelectArticle(report);
              }}
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80"
                    alt="Burnley defense"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-[#138048] text-white px-2 py-0.5 text-[9px] font-black uppercase">
                    CLEAN SHEET #4
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline">
                  Burnley conquer The Hawthorns: Parker's defensive granite fuels Clarets revival
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  Scott Parker's side grind out professional 2-0 victory against playoff contenders West Brom.
                </p>
              </div>
              <div className="mt-2 text-xs font-bold text-[#138048]">
                Championship • 8h ago
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-gray-200 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
              More video
            </h3>
            <span className="text-xs font-bold text-[#138048] uppercase tracking-wider">
              WorldScope Sport Video Hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {VIDEO_ITEMS.map((vid) => (
              <div
                key={vid.id}
                className="group cursor-pointer flex flex-col justify-between"
                onClick={() => setActiveVideo(vid)}
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-900 mb-2">
                    <img
                      src={vid.imageUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play Badge (6.PNG) */}
                    <div className="absolute bottom-2 left-2 bg-black/90 text-white px-2 py-0.5 text-[11px] font-bold flex items-center gap-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{vid.duration}</span>
                    </div>

                    {vid.badge && (
                      <div className="absolute top-2 left-2 bg-[#FFD200] text-black px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase">
                        {vid.badge}
                      </div>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-black leading-snug group-hover:underline line-clamp-3">
                    {vid.title}
                  </h4>
                </div>

                <div className="mt-2 text-xs font-bold text-[#138048]">
                  {vid.tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 
          ======================================================================
          6. AUDIO & PODCASTS SECTION
          ======================================================================
        */}
        <section className="border-b border-gray-200 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
              Audio & Podcasts
            </h3>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              WorldScope Audio
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PODCAST_ITEMS.map((pod) => (
              <div
                key={pod.id}
                className="border border-gray-200 hover:border-black p-4 transition-colors cursor-pointer flex gap-4 items-center group bg-white"
                onClick={() => setActiveAudio(pod)}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative bg-neutral-100 overflow-hidden">
                  <img
                    src={pod.imageUrl}
                    alt={pod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 left-1 bg-black/85 text-white px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-[#FFD200]" />
                    <span>{pod.duration}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    {pod.station}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-black leading-snug group-hover:underline line-clamp-2 mb-1">
                    {pod.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 block">
                    {pod.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 
          ======================================================================
          7. FOOTBALL EXTRA NEWSLETTER BANNER (Exact replica of Image 7.PNG)
          ======================================================================
        */}
        <section className="bg-black text-white relative overflow-hidden p-6 sm:p-10">
          <div className="max-w-3xl relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFD200] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                EXCLUSIVE
              </span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Delivered straight to your inbox
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
              Football Extra newsletter
            </h3>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Football Extra World Cup special. Get the latest news and exclusive columns from the tournament through our newsletter - delivered daily.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenNewsletters('football-extra')}
                className="bg-white hover:bg-gray-100 text-black font-bold text-sm px-6 py-2.5 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Green pitch line & soccer graphic accent on the right */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 sm:w-80 sm:h-80 opacity-20 pointer-events-none rounded-full border-8 border-[#138048]" />
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-[#138048]/20 to-transparent pointer-events-none hidden md:block" />
        </section>

        {/* 
          ======================================================================
          8. THINGS YOU NEED TO KNOW SECTION (Exact replica of Image 7.PNG)
          ======================================================================
        */}
        <section className="border-b border-gray-200 pb-12">
          <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight mb-4">
            Things you need to know
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { title: 'WorldScope News App Alerts', desc: 'Customise your notifications', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80' },
              { title: 'WorldScope Sport TV Guide', desc: 'Live broadcast schedules', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80' },
              { title: 'Premier League Hub', desc: 'Fixtures, tables and stats', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80' },
              { title: 'Champions League', desc: 'European matchday coverage', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80' },
              { title: 'WorldScope Sport Mobile', desc: 'Scores and audio on the go', img: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group cursor-pointer bg-neutral-50 border border-neutral-200 hover:border-black p-3 transition-colors"
                onClick={() => onSelectSubCategory(undefined)}
              >
                <div className="aspect-video overflow-hidden bg-neutral-200 mb-2">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-bold text-black group-hover:underline line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 
          ======================================================================
          9. 50 LATEST SPORT ARTICLES CHRONOLOGICAL FEED (With Pagination)
          ======================================================================
        */}
        <section id="sport-continuous-feed" className="pt-4">
          <div className="border-b-2 border-black pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                    {activeSubCategory ? `${activeSubCategory} Archive` : 'All Sport Dispatches'}
                  </h3>
                  <span className="bg-[#FFD200] text-black text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                    50 per page
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Showing articles {totalArticles > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ARTICLES_PER_PAGE, totalArticles)} of {totalArticles} total reports
                </p>
              </div>

              {totalPages > 1 && (
                <div className="text-xs font-bold text-gray-700">
                  Page {safePage} of {totalPages}
                </div>
              )}
            </div>

            {/* Quick Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
              {[
                { label: 'All Sport', val: undefined },
                { label: 'Premier League', val: 'Premier League' },
                { label: 'Championship', val: 'Championship' },
                { label: 'Pundits', val: 'Pundits' },
                { label: 'Football', val: 'Football' },
                { label: 'Cricket', val: 'Cricket' },
                { label: 'Formula 1', val: 'Formula 1' },
                { label: 'Rugby Union', val: 'Rugby Union' },
                { label: 'Tennis', val: 'Tennis' },
                { label: 'Golf', val: 'Golf' },
              ].map((chip) => {
                const active = activeSubCategory === chip.val;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      onSelectSubCategory(chip.val);
                      setSelectedClubFilter(null);
                    }}
                    className={`px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                      active
                        ? 'bg-black text-white border-black'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}

              {selectedClubFilter && (
                <button
                  type="button"
                  onClick={() => setSelectedClubFilter(null)}
                  className="bg-[#FFD200] text-black text-xs font-bold px-3 py-1 flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-black"
                >
                  <span>Club: {selectedClubFilter}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of 50 Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
            {pageArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="grid"
                onSelect={onSelectArticle}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous 50 Articles</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                      safePage === p
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs px-5 py-2.5 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Next 50 Articles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-black text-white max-w-3xl w-full border border-neutral-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD200]">
                WorldScope Sport Video
              </span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-neutral-950">
              <h3 className="text-lg font-bold text-white mb-1">
                {activeVideo.title}
              </h3>
              <p className="text-xs text-[#138048] font-bold">
                {activeVideo.tag} • Duration: {activeVideo.duration}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Player Modal */}
      {activeAudio && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 text-white max-w-md w-full border border-neutral-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD200]">
                {activeAudio.station}
              </span>
              <button
                type="button"
                onClick={() => setActiveAudio(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-square bg-neutral-800 mb-4 overflow-hidden">
              <img
                src={activeAudio.imageUrl}
                alt={activeAudio.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {activeAudio.title}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Duration: {activeAudio.duration} • {activeAudio.availability}
            </p>
            <div className="bg-neutral-800 p-3 flex items-center justify-center gap-3">
              <Volume2 className="w-5 h-5 text-[#FFD200] animate-pulse" />
              <span className="text-xs font-bold text-gray-200">
                Simulated Live Audio Broadcast Playing...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* League Standings Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-black max-w-4xl w-full border-2 border-black shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#FFD200] px-6 py-4 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-black" />
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-black">
                    Official League Standings & Form
                  </h3>
                  <p className="text-xs font-bold text-neutral-800">
                    WorldScope Sport Matchday Statistics
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="text-black hover:bg-black/10 p-1.5 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Division Switcher */}
            <div className="bg-neutral-900 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 gap-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-neutral-800 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTableTab('Champions League')}
                  className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTableTab === 'Champions League'
                      ? 'bg-[#FFD200] text-black'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  Champions League
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTableTab('Premier League')}
                  className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTableTab === 'Premier League'
                      ? 'bg-[#FFD200] text-black'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  Premier League
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTableTab('Championship')}
                  className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTableTab === 'Championship'
                      ? 'bg-[#FFD200] text-black'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  Championship
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTableTab('League One')}
                  className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTableTab === 'League One'
                      ? 'bg-[#FFD200] text-black'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  League One
                </button>
              </div>

              <span className="text-xs text-neutral-400 hidden sm:inline-block">
                Click any team to filter stories
              </span>
            </div>

            {/* Table Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-black font-black uppercase tracking-wider text-gray-600 text-[11px]">
                    <th className="py-2.5 px-2 w-10 text-center">Pos</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-2 text-center">P</th>
                    <th className="py-2.5 px-2 text-center">W</th>
                    <th className="py-2.5 px-2 text-center">D</th>
                    <th className="py-2.5 px-2 text-center">L</th>
                    <th className="py-2.5 px-2 text-center">GD</th>
                    <th className="py-2.5 px-2 text-center font-black text-black">Pts</th>
                    <th className="py-2.5 px-3 text-center hidden md:table-cell">Last 5 (Form)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {(() => {
                    const tableData =
                      activeTableTab === 'Champions League'
                        ? CHAMPIONS_LEAGUE_TABLE
                        : activeTableTab === 'Premier League'
                        ? PREMIER_LEAGUE_TABLE
                        : activeTableTab === 'Championship'
                        ? CHAMPIONSHIP_TABLE
                        : LEAGUE_ONE_TABLE;

                    return tableData.map((team) => {
                      const isUCL = activeTableTab === 'Champions League';
                      const isPL = activeTableTab === 'Premier League';
                      const isChamp = activeTableTab === 'Championship';
                      const isL1 = activeTableTab === 'League One';

                      const isTopZone = isUCL ? team.pos <= 8 : isPL ? team.pos <= 4 : team.pos <= 2;
                      const isMidZone = isUCL ? (team.pos >= 9 && team.pos <= 24) : isPL ? team.pos === 5 : (team.pos >= 3 && team.pos <= 6);
                      const isRelegation = isPL ? team.pos >= 18 : isChamp ? team.pos >= 22 : isL1 ? team.pos >= 21 : false;

                      return (
                        <tr
                          key={team.team}
                          onClick={() => {
                            setSelectedClubFilter(team.team);
                            setShowTableModal(false);
                            const el = document.getElementById('sport-continuous-feed');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                        >
                          <td className="py-2 px-2 text-center font-bold">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                isTopZone
                                  ? 'bg-[#138048] text-white'
                                  : isMidZone
                                  ? 'bg-[#FFD200] text-black'
                                  : isRelegation
                                  ? 'bg-red-600 text-white'
                                  : 'text-gray-700'
                              }`}
                            >
                              {team.pos}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-bold text-black group-hover:text-blue-700">
                            {team.team}
                          </td>
                          <td className="py-2 px-2 text-center font-medium text-gray-700">{team.played}</td>
                          <td className="py-2 px-2 text-center font-medium text-gray-700">{team.won}</td>
                          <td className="py-2 px-2 text-center font-medium text-gray-700">{team.drawn}</td>
                          <td className="py-2 px-2 text-center font-medium text-gray-700">{team.lost}</td>
                          <td className="py-2 px-2 text-center font-mono font-medium text-gray-700">{team.gd}</td>
                          <td className="py-2 px-2 text-center font-black text-black text-sm">{team.pts}</td>
                          <td className="py-2 px-3 text-center hidden md:table-cell">
                            <div className="flex items-center justify-center gap-1">
                              {team.form.map((res, i) => (
                                <span
                                  key={i}
                                  className={`w-5 h-5 rounded-xs flex items-center justify-center text-[10px] font-bold ${
                                    res === 'W'
                                      ? 'bg-[#138048] text-white'
                                      : res === 'D'
                                      ? 'bg-gray-400 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}
                                >
                                  {res}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Modal Footer with Legend */}
            <div className="bg-neutral-100 px-6 py-3.5 border-t border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-600 gap-2">
              <div className="flex items-center gap-4 flex-wrap font-medium">
                {activeTableTab === 'Champions League' ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138048]" />
                      Round of 16 Qualification (Top 8)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200]" />
                      Knockout Play-offs (9-24)
                    </span>
                  </>
                ) : activeTableTab === 'Premier League' ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138048]" />
                      UEFA Champions League (1-4)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200]" />
                      Europa League (5)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      Relegation Zone (18-20)
                    </span>
                  </>
                ) : activeTableTab === 'Championship' ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138048]" />
                      Automatic Promotion (1-2)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200]" />
                      Championship Playoffs (3-6)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      Relegation Zone (22-24)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#138048]" />
                      Automatic Promotion (1-2)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFD200]" />
                      Playoffs (3-6)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      Relegation Zone (21-24)
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="bg-black text-white hover:bg-neutral-800 text-xs font-bold px-4 py-1.5 uppercase tracking-wider cursor-pointer self-end sm:self-auto"
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
