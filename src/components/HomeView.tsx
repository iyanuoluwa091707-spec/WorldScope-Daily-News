import React, { useState } from 'react';
import { Article, CategoryInfo } from '../types';
import { ArticleCard } from './ArticleCard';
import { MostRead } from './MostRead';
import { DailyBriefing } from './DailyBriefing';
import { ArrowRight, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  categories: CategoryInfo[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (cat: string) => void;
  bookmarks?: Article[];
  onToggleBookmark?: (article: Article) => void;
  onOpenBookmarks?: () => void;
}

const FEED_PAGE_SIZE = 50;

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  categories,
  onSelectArticle,
  onSelectCategory,
  bookmarks = [],
  onToggleBookmark,
  onOpenBookmarks,
}) => {
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('All');
  const [feedPage, setFeedPage] = useState<number>(1);

  const renderArticleCard = (
    art: Article, 
    variant: 'hero' | 'secondary' | 'compact' | 'grid' | 'live' = 'grid'
  ) => {
    const isBookmarked = Boolean(bookmarks?.some((b) => b.id === art.id));
    return (
      <ArticleCard
        key={art.id}
        article={art}
        variant={variant}
        onSelect={onSelectArticle}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
      />
    );
  };

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-2xl font-bold mb-4">No stories found</h2>
        <p className="text-neutral-600">The WorldScope Daily wire is currently updating. Please refresh or check back shortly.</p>
      </div>
    );
  }

  // Lead hero story
  const heroArticle = articles[0];
  // 2 companion stories
  const companionStories = articles.slice(1, 3);
  // Live stories
  const liveStories = articles.filter((a) => a.isLive);
  
  // Category splits for editorial ribbons
  const ukArticles = articles.filter((a) => a.category.toLowerCase() === 'uk').slice(0, 4);
  const sportArticles = articles.filter((a) => a.category.toLowerCase() === 'sport').slice(0, 4);
  const healthArticles = articles.filter((a) => a.category.toLowerCase() === 'health').slice(0, 4);
  const techArticles = articles.filter((a) => a.category.toLowerCase() === 'technology').slice(0, 4);
  const bizArticles = articles.filter((a) => a.category.toLowerCase() === 'business').slice(0, 4);
  const cultureArticles = articles.filter((a) => a.category.toLowerCase() === 'culture').slice(0, 4);

  // Custom category stories (categories other than the core ones)
  const coreCats = ['uk', 'sport', 'health', 'technology', 'business', 'culture'];
  const customArticles = articles.filter((a) => !coreCats.includes(a.category.toLowerCase()));

  // 50-article stream filter & pagination
  const streamPool = feedCategoryFilter === 'All'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === feedCategoryFilter.toLowerCase());

  const totalStreamArticles = streamPool.length;
  const totalStreamPages = Math.max(1, Math.ceil(totalStreamArticles / FEED_PAGE_SIZE));
  const safeFeedPage = Math.min(feedPage, totalStreamPages);

  const startStreamIdx = (safeFeedPage - 1) * FEED_PAGE_SIZE;
  const currentFeedArticles = streamPool.slice(startStreamIdx, startStreamIdx + FEED_PAGE_SIZE);

  const handleCategoryFilterClick = (cat: string) => {
    setFeedCategoryFilter(cat);
    setFeedPage(1);
  };

  const handleFeedPageChange = (p: number) => {
    setFeedPage(p);
    const feedElement = document.getElementById('latest-50-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 font-sans">
      
      {/* SECTION 1: EDITORIAL AESTHETIC LEAD GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Main Hero & Companions (Cols 1 to 8) with border-r border-gray-100 */}
        <section className="lg:col-span-8 flex flex-col lg:border-r lg:border-gray-100 lg:pr-8">
          {/* Top Lead Story */}
          {heroArticle && renderArticleCard(heroArticle, 'hero')}

          {/* Companion Stories underneath Hero */}
          {companionStories.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {companionStories.map((art) => renderArticleCard(art, 'secondary'))}
            </div>
          )}
        </section>

        {/* Right Column Aside: Most Read & Breaking News (Cols 9 to 12) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Most Read 1-5 Ranking */}
          <MostRead articles={articles} onSelectArticle={onSelectArticle} />

          {/* Breaking News Card from Editorial Aesthetic */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h4 className="text-xs font-bold uppercase mb-2 flex items-center gap-2 text-black tracking-wide">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Breaking News
            </h4>
            <p className="text-sm font-bold text-black leading-snug">
              {articles.find(a => a.isBreaking)?.title || 'Record clean energy transport bill introduced in Parliament.'}
            </p>
          </div>

          {/* Live Reporting Card if active */}
          {liveStories.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Live Stream Dispatch
              </h4>
              {liveStories.slice(0, 2).map((liveArt) => renderArticleCard(liveArt, 'live'))}
            </div>
          )}

          {/* WorldScope Independent Journalism & Verification Card */}
          <div className="bg-neutral-900 text-white p-5 rounded-sm border border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              WorldScope Daily Wire
            </span>
            <h4 className="text-base font-bold mb-2 leading-tight">
              Trusted, Impartial Global Journalism
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Access comprehensive, verified reporting across World, UK, Sport, Business, Innovation, Culture, and Science desks updated in real-time.
            </p>
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-400">
              <span>Verified Fact-Checked Wire</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </aside>
      </main>

      {/* GEMINI DAILY BRIEFING COMPONENT (Morning & Evening Executive Digest) */}
      <DailyBriefing articles={articles} onSelectArticle={onSelectArticle} />

      {/* SECTION 2: UK NEWS RIBBON */}
      {ukArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#B80000]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#B80000] inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                UK News
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('UK')}
              className="group text-xs font-bold text-[#B80000] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all UK (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ukArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 3: SPORT RIBBON (Yellow banner with Sport green highlights) */}
      {sportArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#FFD200]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#FFD200] border border-black/20 inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Sport
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('Sport')}
              className="group text-xs font-bold text-[#138048] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all Sport (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sportArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 4: HEALTH & MEDICAL SCIENCE (Teal theme) */}
      {healthArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#007F7F]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#007F7F] inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Health & Medical Science
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('Health')}
              className="group text-xs font-bold text-[#0f766e] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all Health (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 5: TECHNOLOGY (Purple theme) */}
      {techArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#5A2D81]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#5A2D81] inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Technology & Silicon
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('Technology')}
              className="group text-xs font-bold text-[#6d28d9] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all Technology (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 6: BUSINESS & MARKETS (Blue theme) */}
      {bizArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#005A9C]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#005A9C] inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Business & Economy
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('Business')}
              className="group text-xs font-bold text-[#005A9C] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all Business (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bizArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 7: CULTURE & ARTS (Magenta theme) */}
      {cultureArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-[#9B1B59]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3.5 h-3.5 bg-[#9B1B59] inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Culture, Arts & Heritage
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory('Culture')}
              className="group text-xs font-bold text-[#be185d] uppercase tracking-wider flex items-center hover:underline"
            >
              <span>View all Culture (50 articles)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 8: SPECIAL DESKS (If user added any) */}
      {customArticles.length > 0 && (
        <section className="mb-14 pt-6 border-t-2 border-black">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-black inline-block" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Special Desks & Custom Topics
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customArticles.map((art) => renderArticleCard(art, 'grid'))}
          </div>
        </section>
      )}

      {/* SECTION 9: 50 LATEST ARTICLES STREAM WITH FULL PAGINATION */}
      <section id="latest-50-feed" className="mt-16 pt-8 border-t-4 border-black">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
              <Layers className="w-4 h-4 text-black" />
              <span>WorldScope Editorial Continuous Wire</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              Latest 50 Articles per Page
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Browse the latest 50 reports chronologically across all desks or filter by specialized topic.
            </p>
          </div>

          {/* Desk Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {['All', 'UK', 'Sport', 'Health', 'Technology', 'Business', 'Culture'].map((desk) => {
              const isActive = feedCategoryFilter === desk;
              const count = desk === 'All'
                ? articles.length
                : articles.filter((a) => a.category.toLowerCase() === desk.toLowerCase()).length;
              return (
                <button
                  key={desk}
                  type="button"
                  onClick={() => handleCategoryFilterClick(desk)}
                  className={`px-3 py-1.5 font-bold uppercase tracking-wider whitespace-nowrap rounded-xs transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {desk} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 50 Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentFeedArticles.map((art, idx) => (
            <div key={art.id} className="relative flex flex-col">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Story #{startStreamIdx + idx + 1}</span>
                <span>{art.category}</span>
              </div>
              {renderArticleCard(art, 'grid')}
            </div>
          ))}
        </div>

        {/* Pagination Bar for the 50-article feed */}
        <div className="mt-12 pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-600 font-medium">
            Showing <strong className="text-black">{startStreamIdx + 1}–{startStreamIdx + currentFeedArticles.length}</strong> of{' '}
            <strong className="text-black">{totalStreamArticles}</strong> latest dispatches (Page {safeFeedPage} of {totalStreamPages})
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeFeedPage <= 1}
              onClick={() => handleFeedPageChange(safeFeedPage - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-black text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous 50</span>
            </button>

            {Array.from({ length: totalStreamPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleFeedPageChange(p)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold border transition-colors ${
                  p === safeFeedPage
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-black hover:border-black'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={safeFeedPage >= totalStreamPages}
              onClick={() => handleFeedPageChange(safeFeedPage + 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-black text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              <span>Next 50</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
