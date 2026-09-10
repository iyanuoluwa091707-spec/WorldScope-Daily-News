import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Article } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (article: Article) => void;
  onClearAllBookmarks?: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectArticle,
  onRemoveBookmark,
  onClearAllBookmarks,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#181818] w-full max-w-2xl max-h-[92dvh] sm:max-h-[85vh] shadow-2xl border-t-4 border-[#B80000] flex flex-col rounded-t-sm sm:rounded-none overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmarks-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-1.5 bg-[#B80000] text-white rounded-xs shrink-0">
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 id="bookmarks-modal-title" className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight text-black dark:text-white truncate">
                Saved Articles
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                {bookmarks.length} {bookmarks.length === 1 ? 'story' : 'stories'} saved in your list
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {bookmarks.length > 0 && onClearAllBookmarks && (
              <button
                type="button"
                onClick={onClearAllBookmarks}
                className="text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-[#B80000] px-2 py-1.5 transition-colors cursor-pointer rounded-xs border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 min-h-[36px] flex items-center"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-xs min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close saved articles"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Article List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 divide-y divide-neutral-200 dark:divide-neutral-800 overscroll-contain">
          {bookmarks.length === 0 ? (
            <div className="py-12 sm:py-16 px-4 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <Bookmark className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-black dark:text-white mb-1">
                No saved articles yet
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-5 leading-relaxed">
                Tap the <strong className="text-black dark:text-white">Save</strong> button on any story card or article page to build your offline reading list.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-black dark:bg-[#252525] hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Top Stories</span>
              </button>
            </div>
          ) : (
            bookmarks.map((article) => (
              <div
                key={article.id}
                className="py-3 sm:py-4 flex gap-3 sm:gap-4 items-start group hover:bg-neutral-50 dark:hover:bg-neutral-800/40 p-2 rounded-xs transition-colors"
              >
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="w-18 h-16 sm:w-24 sm:h-20 object-cover shrink-0 bg-neutral-100 rounded-xs border border-neutral-200 dark:border-neutral-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#B80000]">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-neutral-400">•</span>
                    <span className="text-[10px] text-neutral-500 truncate">
                      {article.timestampDisplay}
                    </span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="text-xs sm:text-sm font-bold text-black dark:text-white line-clamp-2 leading-snug cursor-pointer group-hover:underline group-hover:text-[#B80000] transition-colors"
                  >
                    {article.title}
                  </h4>

                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5 hidden xs:block">
                    {article.lead}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="bg-[#B80000] hover:bg-[#990000] text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1.5 cursor-pointer min-h-[36px] transition-colors shadow-2xs"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(article)}
                      className="border border-neutral-200 dark:border-neutral-700 hover:border-red-500 text-[11px] sm:text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-red-600 px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 cursor-pointer min-h-[36px] transition-colors"
                      title="Remove from saved articles"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {bookmarks.length > 0 && (
          <div className="p-3 sm:p-3.5 bg-neutral-100 dark:bg-[#141414] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 shrink-0">
            <span className="text-[11px] sm:text-xs">Saved locally in browser</span>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-black dark:text-white hover:underline cursor-pointer min-h-[36px] flex items-center"
            >
              Continue Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
