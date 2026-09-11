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
  Send,
  Heart,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  Trash2,
  Loader2,
  User
} from 'lucide-react';
import { Article, CommentItem, AppUser } from '../types';
import { ShareModal } from './ShareModal';
import { 
  subscribeToArticleLikes, 
  toggleArticleLike, 
  subscribeToArticleComments, 
  postArticleComment, 
  deleteArticleComment 
} from '../lib/interactionService';
import { auth } from '../lib/firebase';

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
  const [commentLocation, setCommentLocation] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Likes state
  const [likesCount, setLikesCount] = useState<number>(article.likesCount || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // Comments state synced with Firestore + local initial comments
  const [commentsList, setCommentsList] = useState<CommentItem[]>(article.comments || []);

  // Subscribe to real-time likes for this article in Cloud Firestore
  useEffect(() => {
    let active = true;
    const unsub = subscribeToArticleLikes(article.id, ({ total, userIds }) => {
      if (!active) return;
      setLikesCount(total);
      if (currentUser?.uid) {
        setHasLiked(userIds.includes(currentUser.uid));
      } else {
        setHasLiked(false);
      }
    });

    return () => {
      active = false;
      unsub?.();
    };
  }, [article.id, currentUser?.uid]);

  // Subscribe to real-time comments for this article in Cloud Firestore
  useEffect(() => {
    let active = true;
    const unsub = subscribeToArticleComments(article.id, (firestoreComments) => {
      if (!active) return;
      if (firestoreComments.length > 0) {
        const firestoreIds = new Set(firestoreComments.map((c) => c.id));
        const initialFiltered = (article.comments || []).filter((c) => !firestoreIds.has(c.id));
        setCommentsList([...firestoreComments, ...initialFiltered]);
      } else {
        setCommentsList(article.comments || []);
      }
    });

    return () => {
      active = false;
      unsub?.();
    };
  }, [article.id, article.comments]);

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

  // Toggle Like - Enforce authentication
  const handleToggleLike = async () => {
    if (!currentUser || !auth.currentUser) {
      onToast?.('Account required: Only registered or logged-in users can like stories.');
      onOpenAuth?.('signin');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await toggleArticleLike(article.id, currentUser.name);
      setHasLiked(res.isLiked);
      // Real-time listener subscribeToArticleLikes handles likesCount accurately without duplicate increments
      if (res.isLiked) {
        onToast?.(`Liked "${article.title.slice(0, 30)}..." ❤️`);
      } else {
        onToast?.('Removed like from story.');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg === 'AUTH_REQUIRED') {
        onToast?.('Please sign in or create an account to like posts.');
        onOpenAuth?.('signin');
      } else {
        console.error('Error toggling like in Firestore:', err);
      }
    } finally {
      setIsLiking(false);
    }
  };

  // Submit Comment - Enforce authentication
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) {
      onToast?.('Account required: Only registered or logged-in users can comment on stories.');
      onOpenAuth?.('signin');
      return;
    }

    if (!commentBody.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await postArticleComment(
        article.id,
        commentBody.trim(),
        commentLocation.trim() || 'UK'
      );

      // Optimistic update
      setCommentsList((prev) => [newComment, ...prev.filter((c) => c.id !== newComment.id)]);
      onAddComment(article.id, newComment);
      setCommentBody('');
      setCommentSuccess(true);
      onToast?.('Your comment has been published to the story discussion.');
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg === 'AUTH_REQUIRED') {
        onToast?.('Session expired. Please sign in to comment.');
        onOpenAuth?.('signin');
      } else {
        console.error('Error posting comment to Firestore:', err);
        onToast?.('Could not submit comment. Please check your connection.');
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete Comment (Author only)
  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser || !auth.currentUser) return;
    setDeletingCommentId(commentId);
    try {
      await deleteArticleComment(commentId);
      setCommentsList((prev) => prev.filter((c) => c.id !== commentId));
      onToast?.('Comment removed.');
    } catch (err) {
      console.error('Error deleting comment:', err);
      onToast?.('Could not delete comment.');
    } finally {
      setDeletingCommentId(null);
    }
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
          {/* Like Story Button (Top Bar) */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xs transition-colors cursor-pointer border min-h-[36px] ${
              hasLiked
                ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 font-bold'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-black'
            }`}
            title={currentUser ? (hasLiked ? 'Unlike this story' : 'Like this story') : 'Sign in or create an account to like'}
            aria-label="Like story"
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-600 text-red-600' : ''}`} />
            <span>{hasLiked ? 'Liked' : 'Like'}</span>
            {likesCount > 0 && <span className="ml-1 text-[11px] font-bold">({likesCount})</span>}
          </button>

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

          {/* End of Story Like, Share & Save Action Bar */}
          <div className="mt-8 p-3.5 sm:p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Engage with this story
              </span>
            </div>
            <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
              {/* Like Story Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs border min-h-[42px] ${
                  hasLiked
                    ? 'border-red-600 bg-red-600 text-white font-black'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-black text-black dark:text-white bg-white dark:bg-neutral-900'
                }`}
                title={currentUser ? (hasLiked ? 'Unlike this story' : 'Like this story') : 'Sign in to like this story'}
                aria-label={hasLiked ? 'Liked story' : 'Like story'}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white text-white' : 'text-red-600'}`} />
                <span>{hasLiked ? `Liked (${likesCount})` : `Like Story (${likesCount})`}</span>
              </button>

              {/* Share Story Button */}
              <button
                type="button"
                onClick={handleOpenShare}
                className="bg-[#B80000] hover:bg-[#990000] active:bg-[#800000] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs shadow-xs min-h-[42px]"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Story</span>
              </button>

              {/* Save Story Button */}
              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-xs border min-h-[42px] ${
                  isBookmarked
                    ? 'border-[#B80000] bg-[#B80000]/15 text-[#B80000] font-black'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-black text-black dark:text-white bg-white dark:bg-neutral-900'
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-black uppercase tracking-tight flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-neutral-800" />
                  <span>Reader Discussion ({commentsList.length})</span>
                </h3>

                {/* Quick Like Pill */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={isLiking}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border transition-colors cursor-pointer ${
                    hasLiked
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                  }`}
                  title={currentUser ? (hasLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-600 text-red-600' : 'text-neutral-500'}`} />
                  <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
              </div>

              <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Moderated WorldScope Forum</span>
              </span>
            </div>

            {/* Authentication Gate: Only signed-in users can post comments */}
            {!currentUser ? (
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 mb-8 rounded-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-black dark:text-white uppercase tracking-wide mb-1.5">
                  Sign in to like & join the discussion
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-5 leading-relaxed">
                  Reader comments and story likes are exclusive to registered WorldScope members. Sign in or create a free account to contribute your perspective.
                </p>
                <div className="flex flex-col xs:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('signin')}
                    className="w-full xs:w-auto bg-black hover:bg-neutral-800 text-white text-xs font-bold px-6 py-2.5 uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs cursor-pointer min-h-[42px]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth?.('register')}
                    className="w-full xs:w-auto border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white text-xs font-bold px-6 py-2.5 uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs cursor-pointer min-h-[42px]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cloud Firestore Verified • Real-Time Reader Discussion</span>
                </div>
              </div>
            ) : (
              /* Authenticated Comment Submission Form */
              <form onSubmit={handleSubmitComment} className="bg-gray-50 border border-gray-200 p-5 mb-8 rounded-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold uppercase">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-black">
                      Signed in as <strong>{currentUser.name}</strong>
                    </span>
                    <span className="text-[11px] text-neutral-400">({currentUser.email})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Verified Member
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={currentUser.name}
                      disabled
                      className="w-full p-2 text-xs border border-gray-300 bg-gray-100 text-gray-700 rounded-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                      Your Location (City, Country)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manchester, UK"
                      value={commentLocation}
                      onChange={(e) => setCommentLocation(e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 bg-white focus:outline-none focus:border-black rounded-sm"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                    Your Perspective
                  </label>
                  <textarea
                    placeholder="Share your perspective on this report..."
                    rows={3}
                    maxLength={1500}
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 bg-white focus:outline-none focus:border-black rounded-sm"
                    required
                  />
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span>Constructive debate encouraged under WorldScope editorial standards.</span>
                    <span>{commentBody.length} / 1500</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-gray-500">
                    Your comment is synced directly to Cloud Firestore.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentBody.trim()}
                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-xs font-bold px-5 py-2.5 uppercase tracking-wide flex items-center justify-center space-x-1 rounded-sm cursor-pointer min-h-[38px]"
                  >
                    {isSubmittingComment ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        <span>Post Comment</span>
                      </>
                    )}
                  </button>
                </div>

                {commentSuccess && (
                  <div className="mt-3 text-xs font-bold text-black bg-white p-2.5 border border-black flex items-center rounded-sm">
                    <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                    <span>Your comment has been published to the story discussion.</span>
                  </div>
                )}
              </form>
            )}

            {/* Comments list */}
            {commentsList.length > 0 ? (
              <div className="space-y-4">
                {commentsList.map((c) => {
                  const isAuthor = currentUser && (c.userId === currentUser.uid || currentUser.email === 'iyanuoluwa091707@gmail.com');
                  return (
                    <div key={c.id} className="p-4 border border-gray-200 bg-white rounded-sm">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-black">{c.userName}</span>
                          {c.userLocation && (
                            <span className="text-neutral-500">• {c.userLocation}</span>
                          )}
                          {c.userId && (
                            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{c.timestamp}</span>
                          {isAuthor && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c.id)}
                              disabled={deletingCommentId === c.id}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete your comment"
                              aria-label="Delete your comment"
                            >
                              {deletingCommentId === c.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                        {c.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-4">
                No comments submitted yet. {currentUser ? 'Be the first to share your perspective!' : 'Sign in or create an account to start the conversation.'}
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
