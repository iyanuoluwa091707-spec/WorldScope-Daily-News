import React from 'react';
import { Clock, MessageSquare, Radio, CircleDot } from 'lucide-react';
import { Article } from '../types';
import { getCategoryTheme } from '../data/categoryThemes';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'secondary' | 'compact' | 'grid' | 'live';
  onSelect: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
  onSelect,
}) => {
  const theme = getCategoryTheme(article.category);
  const isSport = article.category.toLowerCase() === 'sport';
  const tagText = article.subCategory || article.category;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(article);
  };

  // 1. HERO VARIANT (BBC front-page lead story)
  if (variant === 'hero') {
    return (
      <article className="w-full h-80 sm:h-96 bg-gray-100 relative group cursor-pointer overflow-hidden rounded-none shadow-xs" onClick={handleClick}>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {article.isLive && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white px-2.5 py-1 text-xs font-black tracking-widest uppercase flex items-center shadow-xs">
            {isSport ? (
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#138048] bg-transparent mr-1.5 animate-pulse inline-block" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5 animate-pulse" />
            )}
            LIVE
          </div>
        )}
        {article.isBreaking && !article.isLive && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-2.5 py-1 text-xs font-black tracking-widest uppercase shadow-xs">
            BREAKING
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 text-white z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 max-w-2xl group-hover:underline decoration-2 underline-offset-4">
            {article.title}
          </h2>
          <p className="text-sm opacity-90 line-clamp-2 max-w-xl text-gray-200">
            {article.lead}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
            <span className={`font-bold uppercase tracking-wider ${isSport ? 'text-[#34d399]' : 'text-gray-300'}`}>
              {tagText} • {article.timestampDisplay}
            </span>
            {article.commentsCount > 0 && (
              <span className="flex items-center gap-1 text-gray-300">
                <MessageSquare className="w-3.5 h-3.5" />
                {article.commentsCount}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 2. SECONDARY VARIANT (BBC companion lead story below hero)
  if (variant === 'secondary') {
    return (
      <article className="group cursor-pointer flex flex-col justify-between" onClick={handleClick}>
        <div>
          {article.imageUrl && (
            <div className="overflow-hidden bg-gray-100 mb-3 relative aspect-[16/9]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {article.isLive && (
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1 animate-pulse ${isSport ? 'bg-[#138048]' : 'bg-red-600'}`} />
                  LIVE
                </div>
              )}
            </div>
          )}
          <h3 className="font-bold text-lg leading-tight hover:underline cursor-pointer text-black">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {article.lead}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs font-semibold pt-2 border-t border-gray-100">
          <span className={`font-bold ${theme.tagColor}`}>
            {tagText}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 font-medium">{article.timestampDisplay}</span>
          {article.commentsCount > 0 && (
            <span className="flex items-center gap-1 ml-auto text-gray-400">
              <MessageSquare className="w-3 h-3" />
              {article.commentsCount}
            </span>
          )}
        </div>
      </article>
    );
  }

  // 3. COMPACT VARIANT (Text on left, square thumbnail on right, BBC sidebar style)
  if (variant === 'compact') {
    return (
      <article className="group cursor-pointer flex items-start space-x-3 py-3 border-b border-neutral-200" onClick={handleClick}>
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${theme.tagColor}`}>
            {tagText} • {article.timestampDisplay}
          </div>
          <h4 className="text-sm font-bold text-black leading-snug group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
            {article.title}
          </h4>
        </div>

        <div className="w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 bg-neutral-100 overflow-hidden">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      </article>
    );
  }

  // 4. LIVE REPORT VARIANT
  if (variant === 'live') {
    return (
      <article className="group cursor-pointer bg-gray-50 border border-gray-200 p-4 relative hover:border-black transition-colors rounded-sm" onClick={handleClick}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold uppercase flex items-center gap-2 text-black">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isSport ? 'bg-[#138048]' : 'bg-red-600'}`} />
            Live Reporting
          </div>
          <span className="text-[11px] text-gray-500 font-semibold">
            {article.liveUpdates ? `${article.liveUpdates.length} Updates` : 'Continuous Feed'}
          </span>
        </div>

        <h3 className="text-sm font-bold text-black leading-snug group-hover:underline cursor-pointer mb-2">
          {article.title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {article.lead}
        </p>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-200">
          <span className={`font-bold ${theme.tagColor}`}>
            {tagText} • {article.timestampDisplay}
          </span>
        </div>
      </article>
    );
  }

  // 5. STANDARD GRID CARD
  return (
    <article className="group cursor-pointer flex flex-col justify-between h-full border-b sm:border-b-0 pb-4 sm:pb-0" onClick={handleClick}>
      <div>
        <div className="overflow-hidden bg-gray-100 mb-2.5 aspect-video relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isLive && (
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase flex items-center shadow-xs">
              <span className={`w-1.5 h-1.5 rounded-full mr-1 animate-pulse ${isSport ? 'bg-[#138048]' : 'bg-red-600'}`} />
              LIVE
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-black leading-snug group-hover:underline decoration-1 underline-offset-2 mb-1.5 line-clamp-3">
          {article.title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2 font-normal">
          {article.lead}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold text-xs ${theme.tagColor}`}>
            {tagText}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 font-medium text-[11px]">{article.timestampDisplay}</span>
        </div>
        {article.commentsCount > 0 && (
          <span className="flex items-center text-gray-400 text-[11px]">
            <MessageSquare className="w-3 h-3 mr-1" />
            {article.commentsCount}
          </span>
        )}
      </div>
    </article>
  );
};
