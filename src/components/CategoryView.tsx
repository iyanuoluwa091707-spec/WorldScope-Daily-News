import React, { useState, useEffect } from 'react';
import { Article, CategoryInfo } from '../types';
import { ArticleCard } from './ArticleCard';
import { MostRead } from './MostRead';
import { SportView } from './SportView';
import { AudioView } from './AudioView';
import { VideoView } from './VideoView';
import { LiveView } from './LiveView';
import { LiveMarketChart } from './LiveMarketChart';
import { getCategoryTheme } from '../data/categoryThemes';
import { ChevronLeft, ChevronRight, Mail, ArrowRight } from 'lucide-react';

interface CategoryViewProps {
  categoryName: string;
  categoryInfo?: CategoryInfo;
  activeSubCategory?: string;
  onSelectSubCategory: (subCat?: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenNewsletters?: (initialId?: string) => void;
}

const ARTICLES_PER_PAGE = 50;

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryName,
  categoryInfo,
  activeSubCategory,
  onSelectSubCategory,
  articles,
  onSelectArticle,
  onOpenNewsletters,
}) => {
  // If it's the Sport page, render the specialized BBC Sport View matching 5.PNG, 6.PNG, 7.PNG
  if (categoryName.toLowerCase() === 'sport') {
    return (
      <SportView
        articles={articles}
        activeSubCategory={activeSubCategory}
        onSelectSubCategory={onSelectSubCategory}
        onSelectArticle={onSelectArticle}
        onOpenNewsletters={(initialId) => onOpenNewsletters?.(initialId || 'football-extra')}
      />
    );
  }

  // Specialized Audio View (BBC Sounds)
  if (categoryName.toLowerCase() === 'audio') {
    return (
      <AudioView
        articles={articles}
        onSelectArticle={onSelectArticle}
        onOpenNewsletters={onOpenNewsletters}
      />
    );
  }

  // Specialized Video View (BBC Video & Live Stream)
  if (categoryName.toLowerCase() === 'video') {
    return (
      <VideoView
        articles={articles}
        onSelectArticle={onSelectArticle}
      />
    );
  }

  // Specialized Live Coverage View
  if (categoryName.toLowerCase() === 'live') {
    return (
      <LiveView
        articles={articles}
        onSelectArticle={onSelectArticle}
      />
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const theme = getCategoryTheme(categoryName);

  // Reset to page 1 whenever category or subcategory changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName, activeSubCategory]);

  // Filter articles by category and optional subcategory
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = art.category.toLowerCase() === categoryName.toLowerCase();
    if (!matchesCategory) return false;
    if (activeSubCategory) {
      return (
        art.subCategory?.toLowerCase() === activeSubCategory.toLowerCase() ||
        art.tags.some((t) => t.toLowerCase() === activeSubCategory.toLowerCase())
      );
    }
    return true;
  });

  const totalArticles = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  // Slice exactly 50 articles for the current page
  const startIndex = (safePage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const leadArticle = pageArticles[0];
  const secondArticle = pageArticles[1];
  const thirdArticle = pageArticles[2];
  const streamArticles = pageArticles.slice(3);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build subtopics list from categoryInfo and articles
  const availableSubcategories = categoryInfo?.subCategories || Array.from(
    new Set(
      articles
        .filter((a) => a.category.toLowerCase() === categoryName.toLowerCase())
        .map((a) => a.subCategory)
        .filter(Boolean) as string[]
    )
  );

  return (
    <div className="w-full bg-white font-sans">
      
      {/* 
        ========================================================================
        1. AUTHENTIC BBC DESK BANNER WITH RESPECTIVE COLOR
        (Red for UK/News, Blue for Business, Purple for Tech, Teal for Health, Magenta for Culture)
        ========================================================================
      */}
      <div className={`w-full ${theme.bannerBg} ${theme.bannerText}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-0">
          
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase select-none">
                {theme.bannerTitle}
              </h1>
              <span className="text-xs font-bold tracking-widest opacity-80 uppercase hidden sm:inline-block">
                BBC {categoryName} Desk
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onOpenNewsletters?.(categoryName.toLowerCase())}
                className="bg-black/30 hover:bg-black/50 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 backdrop-blur-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{theme.newsletterInfo.title}</span>
              </button>
            </div>
          </div>

          {/* Subnav row on colored banner */}
          <nav className="flex items-center overflow-x-auto no-scrollbar space-x-1 sm:space-x-4 text-xs sm:text-sm font-bold border-t border-white/20 pt-2 pb-2">
            <button
              type="button"
              onClick={() => onSelectSubCategory(undefined)}
              className={`px-2 py-1 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                !activeSubCategory
                  ? 'border-white font-black'
                  : 'border-transparent hover:border-white/50 opacity-90'
              }`}
            >
              All {categoryName} ({articles.filter((a) => a.category.toLowerCase() === categoryName.toLowerCase()).length})
            </button>
            {availableSubcategories.map((sub) => {
              const isActive = activeSubCategory?.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSelectSubCategory(sub)}
                  className={`px-2 py-1 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-white font-black'
                      : 'border-transparent hover:border-white/50 opacity-90'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 
        ========================================================================
        2. SECONDARY BAR WITH DESK ACTIVE ACCENT
        ========================================================================
      */}
      <div className={`w-full ${theme.secondaryBarBg} ${theme.secondaryBarText} text-xs font-bold border-b border-neutral-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2.5">
          <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
            <span className={`border-b-2 ${theme.secondaryActiveIndicator} pb-0.5 flex items-center gap-1`}>
              <span>{activeSubCategory ? activeSubCategory : categoryName}</span>
              <span className="opacity-60">&gt;</span>
            </span>
            {theme.secondaryLinks.map((sec, i) => (
              <span key={i} className="text-neutral-300 hidden sm:inline-block font-medium">
                {sec.label}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400 whitespace-nowrap ml-4">
            <strong>50 latest articles per page</strong> • Page {safePage} of {totalPages}
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        LIVE STOCK MARKET TERMINAL & CHART (Business Page)
        ========================================================================
      */}
      {categoryName.toLowerCase() === 'business' && (
        <div className="w-full bg-[#121212] border-b-2 border-neutral-800">
          <LiveMarketChart
            initialSymbol={
              activeSubCategory?.toLowerCase().includes('tech') ? 'NVDA' :
              activeSubCategory?.toLowerCase().includes('company') || activeSubCategory?.toLowerCase().includes('companies') ? 'BP.L' :
              activeSubCategory?.toLowerCase().includes('crypto') || activeSubCategory?.toLowerCase().includes('currency') ? 'GBPUSD=X' :
              '^FTSE'
            }
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">

        {/* Lead Editorial Block (if lead articles available) */}
        {leadArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-gray-200 pb-10">
            {/* Primary Hero Lead */}
            <div className="lg:col-span-8">
              <ArticleCard
                article={leadArticle}
                variant="hero"
                onSelect={onSelectArticle}
              />
            </div>

            {/* Companion Stories on the right */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              {secondArticle && (
                <div className="pb-6 border-b border-gray-200">
                  <ArticleCard
                    article={secondArticle}
                    variant="secondary"
                    onSelect={onSelectArticle}
                  />
                </div>
              )}

              {thirdArticle && (
                <div>
                  <ArticleCard
                    article={thirdArticle}
                    variant="compact"
                    onSelect={onSelectArticle}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desk Newsletter Inset Banner */}
        <div className="bg-neutral-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-black relative overflow-hidden" style={{ borderLeftColor: theme.bannerBgHex }}>
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 mb-2 inline-block text-white" style={{ backgroundColor: theme.bannerBgHex }}>
              WorldScope {categoryName} Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white mb-1">
              {theme.newsletterInfo.title}
            </h3>
            <p className="text-xs text-neutral-300 mb-2">
              🗓️ {theme.newsletterInfo.cadence}
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {theme.newsletterInfo.description}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenNewsletters?.(categoryName.toLowerCase())}
              className="bg-white text-black hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Sign up free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 50 Articles Grid */}
        <section id="category-articles-grid" className="pt-2">
          <div className="border-b-2 border-black pb-3 mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                {activeSubCategory ? `${activeSubCategory} Reporting` : `All ${categoryName} Dispatches`}
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 uppercase tracking-wider ${theme.badgeBg}`}>
                50 per page
              </span>
            </div>

            <div className="text-xs text-gray-600">
              Showing articles {startIndex + 1} - {Math.min(startIndex + ARTICLES_PER_PAGE, totalArticles)} of {totalArticles} reports
            </div>
          </div>

          {pageArticles.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-gray-300 my-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                No articles filed in this subcategory yet.
              </p>
              <button
                type="button"
                onClick={() => onSelectSubCategory(undefined)}
                className="bg-black text-white text-xs font-bold px-4 py-2 uppercase tracking-wider cursor-pointer"
              >
                View all {categoryName} articles
              </button>
            </div>
          ) : (
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
          )}

          {/* Pagination Controls for 50 Articles */}
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
    </div>
  );
};
