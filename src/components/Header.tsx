import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Bookmark, 
  Clock, 
  ShieldCheck, 
  LogOut,
  ArrowRight,
  Bell
} from 'lucide-react';
import { CategoryInfo, Article } from '../types';
import { getCategoryTheme } from '../data/categoryThemes';
import { Logo } from './Logo';

interface HeaderProps {
  categories: CategoryInfo[];
  allCategoriesList: string[];
  activeCategory: string; // 'Home' or category name
  activeSubCategory?: string;
  onSelectCategory: (category: string) => void;
  onSelectSubCategory: (subCat?: string) => void;
  onOpenArticle: (article: Article) => void;
  breakingArticles: Article[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Article[];
  currentUser?: { email: string; name: string } | null;
  onOpenAuth?: (mode: 'signin' | 'register') => void;
  onSignOut?: () => void;
}

interface NavSection {
  id: string;
  name: string;
  categoryTarget: string;
  hasSubmenu: boolean;
  subItems?: { name: string; category: string; subCategory?: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  allCategoriesList,
  activeCategory,
  activeSubCategory,
  onSelectCategory,
  onSelectSubCategory,
  onOpenArticle,
  breakingArticles,
  searchQuery,
  setSearchQuery,
  searchResults,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  // Navigation Menu Open State (matches 1.PNG when true, 2.PNG when false)
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Track which submenus are expanded in the menu list
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Account modal/drawer state for the user avatar icon
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  
  // Breaking ticker dismiss state
  const [dismissBreaking, setDismissBreaking] = useState(false);

  // Bulletproof lock for mobile background scrolling
  useEffect(() => {
    if (menuOpen || accountDrawerOpen) {
      const scrollY = window.scrollY;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalStyle;
        window.scrollTo(0, scrollY);
      };
    }
  }, [menuOpen, accountDrawerOpen]);

  // Search input ref to auto-focus when clicking the Q icon
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when menu opens via search icon
  const handleOpenSearch = () => {
    setMenuOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleSectionExpand = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleNavigate = (category: string, subCategory?: string) => {
    onSelectCategory(category);
    onSelectSubCategory(subCategory);
    setMenuOpen(false);
  };

  // Sections matching 1.PNG and 12.PNG
  const navSections: NavSection[] = [
    {
      id: 'home',
      name: 'Home',
      categoryTarget: 'Home',
      hasSubmenu: false,
    },
    {
      id: 'news',
      name: 'News',
      categoryTarget: 'UK',
      hasSubmenu: true,
      subItems: [
        { name: 'All News', category: 'Home' },
        { name: 'UK News', category: 'UK' },
        { name: 'Politics', category: 'UK', subCategory: 'Politics' },
        { name: 'England', category: 'UK', subCategory: 'England' },
        { name: 'Scotland', category: 'UK', subCategory: 'Scotland' },
        { name: 'Wales', category: 'UK', subCategory: 'Wales' },
        { name: 'Northern Ireland', category: 'UK', subCategory: 'Northern Ireland' },
      ],
    },
    {
      id: 'sport',
      name: 'Sport',
      categoryTarget: 'Sport',
      hasSubmenu: true,
      subItems: [
        { name: 'All Sport', category: 'Sport' },
        { name: 'Football', category: 'Sport', subCategory: 'Football' },
        { name: 'Premier League', category: 'Sport', subCategory: 'Premier League' },
        { name: 'Formula 1', category: 'Sport', subCategory: 'Formula 1' },
        { name: 'Cricket', category: 'Sport', subCategory: 'Cricket' },
      ],
    },
    {
      id: 'business',
      name: 'Business',
      categoryTarget: 'Business',
      hasSubmenu: true,
      subItems: [
        { name: 'All Business', category: 'Business' },
        { name: 'UK Economy', category: 'Business', subCategory: 'Economy' },
        { name: 'Markets', category: 'Business', subCategory: 'Markets' },
        { name: 'Companies', category: 'Business', subCategory: 'Companies' },
        { name: 'Work & Careers', category: 'Business', subCategory: 'Work & Careers' },
      ],
    },
    {
      id: 'technology',
      name: 'Technology',
      categoryTarget: 'Technology',
      hasSubmenu: true,
      subItems: [
        { name: 'All Technology', category: 'Technology' },
        { name: 'Artificial Intelligence', category: 'Technology', subCategory: 'Artificial Intelligence' },
        { name: 'Cybersecurity', category: 'Technology', subCategory: 'Cybersecurity' },
        { name: 'Gadgets & Silicon', category: 'Technology', subCategory: 'Gadgets' },
        { name: 'Computing', category: 'Technology', subCategory: 'Computing' },
      ],
    },
    {
      id: 'health',
      name: 'Health',
      categoryTarget: 'Health',
      hasSubmenu: true,
      subItems: [
        { name: 'All Health', category: 'Health' },
        { name: 'NHS Updates', category: 'Health', subCategory: 'NHS' },
        { name: 'Medical Science', category: 'Health', subCategory: 'Medical Science' },
        { name: 'Public Health', category: 'Health', subCategory: 'Public Health' },
        { name: 'Mental Health', category: 'Health', subCategory: 'Mental Health' },
      ],
    },
    {
      id: 'culture',
      name: 'Culture',
      categoryTarget: 'Culture',
      hasSubmenu: true,
      subItems: [
        { name: 'All Culture', category: 'Culture' },
        { name: 'Film & TV', category: 'Culture', subCategory: 'Film & TV' },
        { name: 'Music', category: 'Culture', subCategory: 'Music' },
        { name: 'Books', category: 'Culture', subCategory: 'Books' },
        { name: 'Architecture', category: 'Culture', subCategory: 'Architecture' },
      ],
    },
    {
      id: 'arts',
      name: 'Arts',
      categoryTarget: 'Arts',
      hasSubmenu: true,
      subItems: [
        { name: 'All Arts', category: 'Arts' },
        { name: 'Visual Arts', category: 'Arts', subCategory: 'Visual Arts' },
        { name: 'Theatre', category: 'Arts', subCategory: 'Theatre' },
        { name: 'Exhibitions', category: 'Arts', subCategory: 'Exhibitions' },
      ],
    },
    {
      id: 'travel',
      name: 'Travel',
      categoryTarget: 'Travel',
      hasSubmenu: true,
      subItems: [
        { name: 'All Travel', category: 'Travel' },
        { name: 'Destinations', category: 'Travel', subCategory: 'Destinations' },
        { name: 'Journeys', category: 'Travel', subCategory: 'Journeys' },
        { name: 'Food & Drink', category: 'Travel', subCategory: 'Food & Drink' },
        { name: 'Sustainable Travel', category: 'Travel', subCategory: 'Sustainable Travel' },
      ],
    },
    {
      id: 'earth',
      name: 'Earth',
      categoryTarget: 'Earth',
      hasSubmenu: true,
      subItems: [
        { name: 'All Earth', category: 'Earth' },
        { name: 'Green Energy', category: 'Earth', subCategory: 'Green Energy' },
        { name: 'Wildlife', category: 'Earth', subCategory: 'Wildlife' },
        { name: 'Conservation', category: 'Earth', subCategory: 'Conservation' },
        { name: 'Oceans', category: 'Earth', subCategory: 'Oceans' },
        { name: 'Climate', category: 'Earth', subCategory: 'Climate' },
      ],
    },
    {
      id: 'audio',
      name: 'Audio',
      categoryTarget: 'Audio',
      hasSubmenu: true,
      subItems: [
        { name: 'All Audio', category: 'Audio' },
        { name: 'Podcasts', category: 'Audio', subCategory: 'Podcasts' },
        { name: 'Radio 4', category: 'Audio', subCategory: 'Radio 4' },
        { name: 'Radio 5 Live', category: 'Audio', subCategory: 'Radio 5 Live' },
        { name: 'World Service', category: 'Audio', subCategory: 'World Service' },
      ],
    },
    {
      id: 'video',
      name: 'Video',
      categoryTarget: 'Video',
      hasSubmenu: true,
      subItems: [
        { name: 'All Video', category: 'Video' },
        { name: 'Watch Live', category: 'Video', subCategory: 'Watch Live' },
        { name: 'Investigations', category: 'Video', subCategory: 'Investigations' },
        { name: 'Explainers', category: 'Video', subCategory: 'Explainers' },
        { name: 'Sport Highlights', category: 'Video', subCategory: 'Sport Highlights' },
      ],
    },
    {
      id: 'live',
      name: 'Live',
      categoryTarget: 'Live',
      hasSubmenu: true,
      subItems: [
        { name: 'All Live Feeds', category: 'Live' },
        { name: 'Live News Wire', category: 'Live', subCategory: 'Live News Wire' },
        { name: 'Live Sport', category: 'Live', subCategory: 'Live Sport' },
        { name: 'Global Conflicts', category: 'Live', subCategory: 'Global Conflicts' },
      ],
    },
  ];

  // Additional custom desks created by users
  const standardCategoryIds = ['home', 'uk', 'sport', 'business', 'technology', 'health', 'culture'];
  const customCategories = allCategoriesList.filter(
    (c) => !standardCategoryIds.includes(c.toLowerCase())
  );

  // Active category info for secondary horizontal desk bar on desktop
  const currentCatInfo = categories.find((c) => c.name.toLowerCase() === activeCategory.toLowerCase());

  const mainNavItems = [
    { id: 'Home', label: 'Home', target: 'Home' },
    { id: 'News', label: 'News', target: 'UK' },
    { id: 'Sport', label: 'Sport', target: 'Sport' },
    { id: 'Business', label: 'Business', target: 'Business' },
    { id: 'Technology', label: 'Technology', target: 'Technology' },
    { id: 'Health', label: 'Health', target: 'Health' },
    { id: 'Culture', label: 'Culture', target: 'Culture' },
    { id: 'Arts', label: 'Arts', target: 'Arts' },
    { id: 'Travel', label: 'Travel', target: 'Travel' },
    { id: 'Earth', label: 'Earth', target: 'Earth' },
  ];

  const mediaNavItems = [
    { id: 'Audio', label: 'Audio', target: 'Audio' },
    { id: 'Video', label: 'Video', target: 'Video' },
    { id: 'Live', label: 'Live', target: 'Live' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs">
      
      {/* 
        ========================================================================
        ROW 1: PRIMARY WORLDSCOPE DAILY UNIVERSAL HEADER
        ========================================================================
      */}
      <div className="w-full bg-white border-b border-neutral-300 h-14 sm:h-16 px-2.5 sm:px-6 relative z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between relative">
          
          {/* Left: ≡Q Combined Button or ✕ Close Button when menu is open */}
          <div className="flex items-center z-10 shrink-0">
            {!menuOpen ? (
              <div className="flex items-center bg-neutral-200 hover:bg-neutral-300 transition-colors p-1 sm:p-1.5 gap-0.5 sm:gap-1.5 rounded-xs">
                <button
                  id="worldscope-hamburger-button"
                  type="button"
                  onClick={handleToggleMenu}
                  className="p-1 text-black hover:opacity-75 focus:outline-none cursor-pointer"
                  title="Open Navigation Menu"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>
                <button
                  id="worldscope-search-icon-button"
                  type="button"
                  onClick={handleOpenSearch}
                  className="p-1 text-black hover:opacity-75 focus:outline-none cursor-pointer"
                  title="Search WorldScope Daily"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                id="worldscope-close-menu-button"
                type="button"
                onClick={handleToggleMenu}
                className="bg-black text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs"
                aria-label="Close WorldScope Navigation Menu"
                title="Close Menu"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Center: Iconic WorldScope Daily Logo - Centered with flex-nowrap to guarantee Daily never covers WorldScope */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 flex items-center justify-center pointer-events-auto max-w-[calc(100%-120px)] sm:max-w-none">
            <button
              id="worldscope-center-logo"
              type="button"
              onClick={() => {
                onSelectCategory('Home');
                onSelectSubCategory(undefined);
                setMenuOpen(false);
              }}
              className="flex items-center focus:outline-none cursor-pointer group flex-nowrap whitespace-nowrap"
              title="WorldScope Daily Homepage"
              aria-label="WorldScope Daily Homepage"
            >
              <Logo variant="header" theme="light" />
            </button>
          </div>

          {/* Right: Register + Sign In */}
          <div className="flex items-center gap-1 sm:gap-3 z-10 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('signin')}
                  className="flex items-center gap-1 text-xs sm:text-sm font-bold text-black hover:underline cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#006def] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-bold">{currentUser.name}</span>
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-xs text-neutral-600 hover:text-black font-semibold underline cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  id="worldscope-register-button"
                  type="button"
                  onClick={() => onOpenAuth?.('register')}
                  className="hidden sm:inline-flex items-center bg-black text-white hover:bg-neutral-800 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap rounded-xs"
                >
                  Register
                </button>
                <button
                  id="worldscope-signin-button"
                  type="button"
                  onClick={() => onOpenAuth?.('signin')}
                  className="text-black font-bold text-xs sm:text-sm hover:underline px-2 py-1 sm:py-1.5 cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5 sm:hidden" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        ROW 2: UNIFIED HORIZONTAL NAVIGATION (Exact match to 12.PNG & Capture.PNG)
        ========================================================================
      */}
      {!menuOpen && (
        <nav className="hidden lg:block w-full bg-white border-b border-neutral-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar text-xs sm:text-sm h-10 sm:h-11">
            {mainNavItems.map((item) => {
              const isSelected =
                item.id === 'Home'
                  ? activeCategory.toLowerCase() === 'home'
                  : activeCategory.toLowerCase() === item.target.toLowerCase() ||
                    (item.id === 'News' && activeCategory.toLowerCase() === 'uk');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id.toLowerCase()}`}
                  type="button"
                  onClick={() => {
                    onSelectCategory(item.target);
                    onSelectSubCategory(undefined);
                  }}
                  className={`h-full flex items-center px-1 font-bold whitespace-nowrap transition-colors border-b-4 cursor-pointer ${
                    isSelected
                      ? 'border-black text-black font-black'
                      : 'border-transparent text-neutral-800 hover:text-black hover:border-neutral-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <span className="text-neutral-300 font-light select-none px-0.5">|</span>

            {mediaNavItems.map((item) => {
              const isSelected = activeCategory.toLowerCase() === item.target.toLowerCase();
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id.toLowerCase()}`}
                  type="button"
                  onClick={() => {
                    onSelectCategory(item.target);
                    onSelectSubCategory(undefined);
                  }}
                  className={`h-full flex items-center px-1 font-bold whitespace-nowrap transition-colors border-b-4 cursor-pointer ${
                    isSelected
                      ? 'border-black text-black font-black'
                      : 'border-transparent text-neutral-800 hover:text-black hover:border-neutral-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 
        ========================================================================
        OPEN MENU SYSTEM (Identical replica of 1.PNG for mobile & desktop)
        ========================================================================
      */}
      {menuOpen && (
        <div 
          id="worldscope-full-navigation-overlay"
          className="fixed inset-x-0 top-14 sm:top-16 bottom-0 bg-white z-40 overflow-y-auto overscroll-contain touch-pan-y animate-in slide-in-from-top-2 duration-150 border-b border-black"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Top Account Strip in Menu (Matches 1.PNG) */}
          <div className="bg-neutral-100 border-b border-neutral-200 px-4 sm:px-6 py-2.5">
            {currentUser ? (
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#006def] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-black">{currentUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut?.();
                    setMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-neutral-600 hover:text-black underline cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto">
                <span className="text-xs sm:text-sm font-medium text-neutral-600">WorldScope Account</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuth?.('signin');
                      setMenuOpen(false);
                    }}
                    className="text-xs sm:text-sm font-bold text-black hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuth?.('register');
                      setMenuOpen(false);
                    }}
                    className="text-xs sm:text-sm font-bold text-black hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1. Search Box with Black Square Button (1.PNG) */}
          <div className="p-3 sm:p-4 bg-white border-b border-neutral-200">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // If there are search results, highlight them or keep menu open
              }}
              className="flex items-stretch border border-neutral-300 focus-within:border-black max-w-3xl mx-auto w-full"
            >
              <input
                ref={searchInputRef}
                id="worldscope-menu-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, topics and more"
                className="flex-1 px-3.5 sm:px-4 py-2.5 text-sm sm:text-base text-black placeholder:text-neutral-500 focus:outline-none bg-white font-medium"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-neutral-400 hover:text-black flex items-center justify-center"
                  title="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Black Square Button with White Search Icon (1.PNG) */}
              <button
                type="submit"
                className="bg-black text-white w-12 sm:w-14 flex items-center justify-center hover:bg-neutral-800 transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
            </form>

            {/* Instant Search Results Panel (if user has typed a query) */}
            {searchQuery.trim().length > 0 && (
              <div className="max-w-3xl mx-auto mt-3 bg-neutral-50 border border-neutral-200 divide-y divide-neutral-200 max-h-64 overflow-y-auto overscroll-contain touch-pan-y">
                <div className="p-2.5 bg-neutral-100 flex items-center justify-between text-xs font-bold uppercase text-neutral-600">
                  <span>{searchResults.length} {searchResults.length === 1 ? 'Article' : 'Articles'} Found</span>
                  <span>Select to read</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No articles found matching "{searchQuery}".
                  </div>
                ) : (
                  searchResults.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onOpenArticle(item);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-white transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                          {item.category}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-black group-hover:underline truncate">
                          {item.title}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 2. Navigation List with Dividers and Chevrons (Exact replica of 1.PNG) */}
          <nav className="max-w-3xl mx-auto w-full pb-24">
            {navSections.map((section) => {
              const isExpanded = expandedSections[section.id];
              const isSectionActive = 
                section.id === 'home' 
                  ? activeCategory.toLowerCase() === 'home'
                  : activeCategory.toLowerCase() === section.categoryTarget.toLowerCase();

              return (
                <div key={section.id} className="border-b border-neutral-200">
                  {/* Row Header */}
                  <div 
                    onClick={() => {
                      if (section.hasSubmenu) {
                        setExpandedSections((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }));
                      } else {
                        handleNavigate(section.categoryTarget);
                      }
                    }}
                    className={`py-3.5 sm:py-4 px-4 sm:px-6 flex items-center justify-between cursor-pointer transition-colors ${
                      isSectionActive ? 'bg-neutral-50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-bold text-black tracking-tight">
                      {section.name}
                    </span>

                    {/* Down chevron icon if section has sub-menu (1.PNG) */}
                    {section.hasSubmenu ? (
                      <button
                        type="button"
                        onClick={(e) => toggleSectionExpand(section.id, e)}
                        className="p-1 text-black hover:opacity-70 focus:outline-none"
                        aria-label={`Toggle ${section.name} sub-menu`}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-black stroke-[2.5]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-black stroke-[2.5]" />
                        )}
                      </button>
                    ) : (
                      // If no submenu, show direct navigation arrow or check if active
                      isSectionActive && <Check className="w-4 h-4 text-black" />
                    )}
                  </div>

                  {/* Expanded Sub-categories list */}
                  {section.hasSubmenu && isExpanded && section.subItems && (
                    <div className="bg-neutral-50 border-t border-neutral-200 py-2 px-6 sm:px-8 space-y-1">
                      {section.subItems.map((subItem) => {
                        const isSubActive =
                          activeCategory.toLowerCase() === subItem.category.toLowerCase() &&
                          (subItem.subCategory ? activeSubCategory === subItem.subCategory : !activeSubCategory);

                        return (
                          <button
                            key={subItem.name}
                            type="button"
                            onClick={() => handleNavigate(subItem.category, subItem.subCategory)}
                            className={`w-full text-left py-2 px-3 text-xs sm:text-sm font-semibold rounded-xs transition-colors flex items-center justify-between ${
                              isSubActive 
                                ? 'bg-black text-white font-bold' 
                                : 'text-neutral-700 hover:text-black hover:bg-neutral-200/60'
                            }`}
                          >
                            <span>{subItem.name}</span>
                            {isSubActive && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Custom Desks (if any created by user) */}
            {customCategories.length > 0 && (
              <div className="border-b border-neutral-200">
                <div 
                  onClick={() => {
                    setExpandedSections((prev) => ({
                      ...prev,
                      moreDesks: !prev.moreDesks,
                    }));
                  }}
                  className="py-3.5 sm:py-4 px-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                >
                  <span className="text-base sm:text-lg font-bold text-black tracking-tight">
                    More Desks
                  </span>
                  <ChevronDown className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                {expandedSections.moreDesks && (
                  <div className="bg-neutral-50 border-t border-neutral-200 py-2 px-6 sm:px-8 space-y-1">
                    {customCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleNavigate(c)}
                        className="w-full text-left py-2 px-3 text-xs sm:text-sm font-semibold text-neutral-700 hover:text-black hover:bg-neutral-200/60 transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </nav>
        </div>
      )}

      {/* 
        ========================================================================
        SUB-CATEGORY RIBBON (For active category sub-topics)
        ========================================================================
      */}
      {!menuOpen && currentCatInfo && currentCatInfo.subCategories.length > 0 && (
        <div className="bg-neutral-100 border-b border-neutral-200 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center space-x-2 text-xs overflow-x-auto scrollbar-none">
            <span className="font-bold text-black pr-2 uppercase tracking-wide border-r border-neutral-300">
              {currentCatInfo.name}:
            </span>
            <button
              type="button"
              onClick={() => onSelectSubCategory(undefined)}
              className={`px-2.5 py-1 transition-colors ${
                !activeSubCategory ? 'bg-black text-white font-bold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              All {currentCatInfo.name}
            </button>
            {currentCatInfo.subCategories.map((sub) => {
              const isSubSelected = activeSubCategory === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelectSubCategory(sub)}
                  className={`px-2.5 py-1 whitespace-nowrap transition-colors ${
                    isSubSelected ? 'bg-black text-white font-bold' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        BREAKING NEWS TICKER
        ========================================================================
      */}
      {breakingArticles.length > 0 && !dismissBreaking && (
        <div className="bg-white text-black border-b border-black py-2 px-4 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="inline-flex items-center px-2 py-0.5 bg-black text-white text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                BREAKING
              </span>
              <button
                type="button"
                onClick={() => onOpenArticle(breakingArticles[0])}
                className="text-xs sm:text-sm font-bold text-black hover:underline truncate text-left"
              >
                {breakingArticles[0].title}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDismissBreaking(true)}
              className="text-neutral-500 hover:text-black text-xs font-semibold p-1 ml-2"
              title="Dismiss Breaking Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        WORLDSCOPE ACCOUNT POPUP / DRAWER
        ========================================================================
      */}
      {accountDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-black w-full max-w-sm shadow-2xl p-5 mt-12 animate-in slide-in-from-top-4 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">WorldScope Account</h3>
                  <p className="text-[11px] text-neutral-500">Editorial Newsroom</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAccountDrawerOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-neutral-100 border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Status</span>
                  <span className="font-bold text-black">WorldScope Account (Active)</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Editorial Access</span>
                <span className="text-xs text-neutral-700 font-medium block">
                  Full access to WorldScope Daily News, Sport, Innovation, Culture & World wire.
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 space-y-2 text-neutral-700">
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  Authoritative, independent global journalism and editorial wire.
                </p>
                <button
                  type="button"
                  onClick={() => setAccountDrawerOpen(false)}
                  className="w-full text-center py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold uppercase tracking-wider text-[11px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
