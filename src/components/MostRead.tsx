import React from 'react';
import { Article } from '../types';
import { Flame } from 'lucide-react';

interface MostReadProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const MostRead: React.FC<MostReadProps> = ({ articles, onSelectArticle }) => {
  // Sort by views descending and take top 5
  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Top Stories
        </h4>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Most Read
        </span>
      </div>

      <div className="space-y-4">
        {topArticles.map((article, index) => {
          const rank = index + 1;
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="flex gap-4 items-start group cursor-pointer"
            >
              {/* Massive subtle number from design HTML */}
              <span className="text-3xl font-black text-gray-300 group-hover:text-black transition-colors w-6 flex-shrink-0 select-none">
                {rank}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug hover:text-gray-700 cursor-pointer text-black">
                  {article.title}
                </p>
                <span className="text-[10px] text-gray-400 uppercase mt-1 block font-semibold">
                  {article.category} {article.subCategory ? `• ${article.subCategory}` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
