import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Share2, 
  Bookmark, 
  Printer, 
  MessageSquare, 
  ArrowLeft, 
  Check, 
  Radio, 
  ThumbsUp, 
  Send
} from 'lucide-react';
import { Article, CommentItem, AppUser } from '../types';
import { ShareModal } from './ShareModal';

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectArticle: (article: Article) => void;
  onAddComment: (articleId: string, comment: CommentItem) => void;
  currentUser?: AppUser | null;
  onToggleSaveArticle?: (articleId: string) => void;
  onOpenAuth?: (mode?: 'signin' | 'register') => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: Article) => void;
  onToast?: (message: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  relatedArticles,
  onBack,
  onSelectCategory,
  onSelectArticle,
  onAddComment,
  currentUser,
  onToggleSaveArticle,
  onOpenAuth,
  isBookmarked = false,
  onToggleBookmark,
  onToast,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [commentName, setCommentName] = useState(currentUser?.name || '');
  const [commentLocation, setCommentLocation] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sync comment author with currentUser
  useEffect(() => {
    if (currentUser?.name && !commentName) {
      setCommentName(currentUser.name);
    }
  }, [currentUser, commentName]);

  const handleBookmarkToggle = () => {
    if (onToggleBookmark) {
      onToggleBookmark(article);
    } else if (onToggleSaveArticle) {
      onToggleSaveArticle(article.id);
    }
  };

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentBody.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      userName: commentName.trim(),
      userLocation: commentLocation.trim() || 'UK',
      comment: commentBody.trim(),
      timestamp: 'Just now',
      upvotes: 0,
    };

    onAddComment(article.id, newComment);
    setCommentName('');
    setCommentLocation('');
    setCommentBody('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <article className="max-w-7xl mx-auto p-4 sm:p-8 font-sans">
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
        onToast={onToast}
      />

      {/* Breadcrumb Navigation & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-100 dark:border-neutral-800 pb-3 mb-6 text-xs text-gray-500">
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-black dark:text-white font-bold hover:underline mr-1 sm:mr-2 cursor-pointer min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back</span>
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onSelectCategory(article.category)}
            className="font-bold text-black dark:text-white hover:underline uppercase cursor-pointer min-h-[36px] flex items-center"
          >
            {article.category}
          </button>
          {article.subCategory && (
            <>
              <span>/</span>
              <span className="text-gray-400 truncate max-w-[120px] sm:max-w-none">{article.subCategory}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5 text-gray-500 ml-auto sm:ml-0">
          {/* Share Button (opens custom ShareModal) */}
          <button
            type="button"
            onClick={handleOpenShare}
            className="hover:text-black dark:hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-xs transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700 hover:border-black dark:hover:border-white min-h-[36px]"
            title="Share this story"
            aria-label="Share this story"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B80000]" />
            <span className="font-bold text-black dark:text-white">Share</span>
          </button>

          {/* Save Button with Visual Indicator */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xs transition-colors cursor-pointer border min-h-[36px] ${
              isBookmarked 
                ? 'border-[#B80000] bg-[#B80000]/10 text-[#B80000] font-black' 
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black'
            }`}
            title={isBookmarked ? 'Saved to Bookmarks (Click to remove)' : 'Save to Bookmarks'}
            aria-label={isBookmarked ? 'Saved to Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#B80000]' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hover:text-black dark:hover:text-white hidden sm:flex items-center space-x-1 cursor-pointer min-h-[36px] px-2"
            title="Print Article"
            aria-label="Print Article"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editorial Story Column (Cols 1 to 8) */}
        <div className="lg:col-span-8 flex flex-col lg:border-r lg:border-gray-100 lg:pr-8">
          
          {/* Breaking / Live Badges */}
          {article.isLive && (
            <div className="inline-flex items-center px-2.5 py-1 bg-black text-white text-xs font-bold tracking-widest uppercase mb-3 self-start rounded-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse" />
              LIVE REPORTING
            </div>
          )}
          {article.isBreaking && (
            <div className="inline-flex items-center px-2.5 py-1 bg-black text-white text-xs font-bold tracking-widest uppercase mb-3 self-start rounded-sm">
              BREAKING NEWS
            </div>
          )}

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black leading-tight tracking-tight mb-4">
            {article.title}
          </h1>

          {/* Byline & Publish Details */}
          <div className="flex flex-wrap items-center justify-between border-y border-gray-100 py-3 mb-6 gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div>
                <span className="font-bold text-black block">
                  By {article.author.name}
                </span>
                <span className="text-gray-500">
                  {article.author.role} {article.author.location ? `in ${article.author.location}` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {article.timestampDisplay}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Bold Lead Paragraph */}
          <p className="text-lg sm:text-xl font-bold text-black leading-snug mb-6">
            {article.lead}
          </p>

          {/* Hero Image with Caption and Credit */}
          <figure className="mb-8 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
            <div className="w-full overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.imageCaption || article.title}
                className="w-full max-h-[500px] object-cover filter grayscale contrast-110"
              />
            </div>
            {(article.imageCaption || article.imageCredit) && (
              <figcaption className="p-3 text-xs text-gray-600 bg-gray-50 border-t border-gray-200">
                <span className="font-normal text-black mr-1">{article.imageCaption}</span>
                {article.imageCredit && (
                  <span className="text-gray-400 uppercase tracking-wider text-[10px]">
                    | Source: {article.imageCredit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>

          {/* LIVE STREAM SECTION (If Live story) */}
          {article.isLive && (
            <div className="mb-10 bg-gray-50 border border-gray-200 p-5 sm:p-6 rounded-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    Live Stream Timeline
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Live Editorial Wire
                </span>
              </div>

              {article.liveUpdates && article.liveUpdates.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-gray-200">
                  {article.liveUpdates.map((update) => (
                    <div key={update.id} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-black border-2 border-white" />
                      <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 mb-1">
                        <span className="text-black font-bold">{update.timestamp}</span>
                        {update.author && <span>• by {update.author}</span>}
                      </div>
                      <h4 className="text-base font-bold text-black mb-1.5">
                        {update.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-normal">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No live updates posted yet.</p>
              )}
            </div>
          )}

          {/* Article Main Text Content */}
          <div className="space-y-5 text-gray-800 text-base sm:text-lg leading-relaxed font-normal">
            {article.content.map((para, index) => {
              // Inject pull quote in the middle if present
              const isMiddle = index === Math.floor(article.content.length / 2);
              return (
                <React.Fragment key={index}>
                  <p className="text-justify sm:text-left">{para}</p>
                  
                  {isMiddle && article.pullQuote && (
                    <aside className="my-8 py-6 px-6 border-l-4 border-black bg-gray-50">
                      <blockquote className="text-xl sm:text-2xl font-serif italic text-black font-bold leading-snug mb-2">
                        "{article.pullQuote.quote}"
                      </blockquote>
                      <cite className="text-xs font-bold text-gray-500 uppercase tracking-wider not-italic block">
                        — {article.pullQuote.attribution}
                      </cite>
                    </aside>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Related Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Related Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-gray-100 text-black text-xs font-semibold hover:bg-black hover:text-white transition-colors cursor-pointer border border-gray-200 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* End of Story Share & Save Action Bar */}
          <div className="mt-8 p-3.5 sm:p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Share or bookmark this story
              </span>
            </div>
            <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={handleOpenShare}
                className="bg-[#B80000] hover:bg-[#990000] active:bg-[#800000] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs shadow-xs min-h-[42px]"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Story</span>
              </button>
              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs border min-h-[42px] ${
                  isBookmarked
                    ? 'border-[#B80000] bg-[#B80000]/15 text-[#B80000] font-black'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-black text-black dark:text-white'
                }`}
                aria-label={isBookmarked ? 'Saved in Bookmarks' : 'Save Story'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-[#B80000]' : ''}`} />
                <span>{isBookmarked ? 'Saved in Bookmarks' : 'Save Story'}</span>
              </button>
            </div>
          </div>

          {/* Reader Discussion / Comments Section */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black uppercase tracking-tight flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>Reader Discussion ({article.comments?.length || 0})</span>
              </h3>
              <span className="text-xs text-gray-400 font-medium">Moderated under WorldScope Code</span>
            </div>

            {/* Comment submission form */}
            <form onSubmit={handleSubmitComment} className="bg-gray-50 border border-gray-200 p-5 mb-8 rounded-sm">
              <h4 className="text-sm font-bold text-black uppercase tracking-wide mb-3">
                Join the debate
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Eleanor Rigby)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="p-2 text-xs border border-gray-300 bg-white focus:outline-none focus:border-black rounded-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Location (e.g. Manchester, UK)"
                  value={commentLocation}
                  onChange={(e) => setCommentLocation(e.target.value)}
                  className="p-2 text-xs border border-gray-300 bg-white focus:outline-none focus:border-black rounded-sm"
                />
              </div>
              <textarea
                placeholder="Share your perspective on this report..."
                rows={3}
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 bg-white focus:outline-none focus:border-black mb-3 rounded-sm"
                required
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  Comments are published immediately to the editorial feed.
                </span>
                <button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 text-xs font-bold px-4 py-2 uppercase tracking-wide flex items-center space-x-1 rounded-sm"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Post Comment</span>
                </button>
              </div>
              {commentSuccess && (
                <div className="mt-3 text-xs font-bold text-black bg-white p-2 border border-black flex items-center rounded-sm">
                  <Check className="w-4 h-4 mr-1 text-black" />
                  <span>Your comment has been published to the story.</span>
                </div>
              )}
            </form>

            {/* Comments list */}
            {article.comments && article.comments.length > 0 ? (
              <div className="space-y-4">
                {article.comments.map((c) => (
                  <div key={c.id} className="p-4 border border-gray-200 bg-white rounded-sm">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <div>
                        <span className="font-bold text-black mr-2">{c.userName}</span>
                        <span>{c.userLocation}</span>
                      </div>
                      <span>{c.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No comments submitted yet. Be the first to share your thoughts.
              </p>
            )}
          </section>

        </div>

        {/* Right Sidebar: More From This Desk (Cols 9 to 12) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="border border-gray-200 p-4 rounded-sm bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-4">
              More from {article.category}
            </h3>
            <div className="space-y-4 divide-y divide-gray-100">
              {relatedArticles.slice(0, 4).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectArticle(rel)}
                  className="pt-3 first:pt-0 group cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                    {rel.category} {rel.subCategory ? `• ${rel.subCategory}` : ''}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-black group-hover:underline leading-snug">
                    {rel.title}
                  </h4>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {rel.timestampDisplay}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 p-4 bg-black text-white rounded-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              WorldScope Editorial Guarantee
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              WorldScope Daily is committed to independent and impartial journalism. All published dispatches are subjected to rigorous fact verification.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
};
