
import React, { useState, useEffect } from 'react';
import { Article, CategoryInfo, CommentItem, LiveUpdate, AppUser } from './types';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { DEFAULT_CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { NewslettersModal } from './components/NewslettersModal';
import { AuthModal } from './components/AuthModal';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { PremiumNewsletterModal } from './components/PremiumNewsletterModal';
import { AdvertiseModal } from './components/AdvertiseModal';
import { LegalPagesModal, LegalTab } from './components/LegalPagesModal';
import { BookmarksModal } from './components/Bookmarksmodal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { RotateCcw } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserProfile } from './lib/userService';

const ARTICLES_STORAGE_KEY = 'worldscope_daily_articles_v3_50';
const CATEGORIES_STORAGE_KEY = 'worldscope_daily_categories_v3_50';
const BOOKMARKS_STORAGE_KEY = 'worldscope_daily_bookmarks';
const COOKIE_CONSENT_KEY = 'worldscope_cookie_consent';

export default function App() {
  // Load persisted articles or fallback to initial authentic WorldScope set
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved =
        localStorage.getItem(ARTICLES_STORAGE_KEY) ||
        localStorage.getItem('bbc_news_articles_v3_50');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length >= 50) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading articles from localStorage', e);
    }

    return INITIAL_ARTICLES;
  });

  // Load categories
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved =
        localStorage.getItem(CATEGORIES_STORAGE_KEY) ||
        localStorage.getItem('bbc_news_categories_v3_50');

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }

    return DEFAULT_CATEGORIES;
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<
    'home' | 'category' | 'article'
  >('home');

  const [selectedCategory, setSelectedCategory] = useState<string>('Home');

  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  // Modals & Tools
  const [isNewslettersModalOpen, setIsNewslettersModalOpen] =
    useState(false);

  const [newslettersInitialId, setNewslettersInitialId] = useState<
    string | undefined
  >(undefined);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const savedUser =
        localStorage.getItem('worldscope_current_user') ||
        localStorage.getItem('bbc_current_user');

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [authModalMode, setAuthModalMode] = useState<
    'signin' | 'register'
  >('signin');

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await getUserProfile(firebaseUser.uid);

            const user: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name:
                profile?.displayName ||
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'Reader',
              photoURL:
                profile?.photoURL ||
                firebaseUser.photoURL ||
                null,
              providerId:
                firebaseUser.providerData[0]?.providerId ||
                'password',
              savedArticles: profile?.savedArticles || [],
              subscribedNewsletters:
                profile?.subscribedNewsletters || [
                  'global-dispatch',
                ],
              subscriptionTier:
                profile?.subscriptionTier || 'basic',
              subscriptionStatus:
                profile?.subscriptionStatus || 'inactive',
              subscriptionExpiry:
                profile?.subscriptionExpiry,
              subscribedAt:
                profile?.subscribedAt,
              createdAt:
                profile?.createdAt ||
                new Date().toISOString(),
            };

            setCurrentUser(user);

            localStorage.setItem(
              'worldscope_current_user',
              JSON.stringify(user)
            );
          } catch (err) {
            console.error(
              'Error synchronizing Firebase user profile:',
              err
            );
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscription, Premium Newsletter, Advertising & Legal Modals
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
    useState(false);

  const [
    isPremiumNewsletterModalOpen,
    setIsPremiumNewsletterModalOpen,
  ] = useState(false);

  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] =
    useState(false);

  const [isLegalModalOpen, setIsLegalModalOpen] =
    useState(false);

  const [legalInitialTab, setLegalInitialTab] =
    useState<LegalTab>('terms');

  // Bookmarks State & Modal
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(
        BOOKMARKS_STORAGE_KEY
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(
        'Error loading bookmarks from localStorage',
        e
      );
    }

    return [];
  });

  const [isBookmarksModalOpen, setIsBookmarksModalOpen] =
    useState(false);

  // Cookie Consent Banner State
  const [showCookieBanner, setShowCookieBanner] =
    useState<boolean>(() => {
      try {
        const consent = localStorage.getItem(
          COOKIE_CONSENT_KEY
        );

        return !consent;
      } catch {
        return true;
      }
    });

  const handleToggleBookmark = (article: Article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === article.id);

      let updated: Article[];

      if (exists) {
        updated = prev.filter(
          (b) => b.id !== article.id
        );

        showToast(
          `Removed "${article.title.slice(
            0,
            32
          )}..." from saved stories.`
        );
      } else {
        updated = [article, ...prev];

        showToast(
          `Saved "${article.title.slice(
            0,
            32
          )}..." to your bookmarks!`
        );
      }

      try {
        localStorage.setItem(
          BOOKMARKS_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error(
          'Error persisting bookmarks',
          e
        );
      }

      return updated;
    });
  };

  const handleRemoveBookmark = (article: Article) => {
    setBookmarks((prev) => {
      const updated = prev.filter(
        (b) => b.id !== article.id
      );

      try {
        localStorage.setItem(
          BOOKMARKS_STORAGE_KEY,
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error(
          'Error updating bookmarks',
          e
        );
      }

      return updated;
    });

    showToast(
      `Removed "${article.title.slice(
        0,
        30
      )}..." from bookmarks.`
    );
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);

    try {
      localStorage.removeItem(
        BOOKMARKS_STORAGE_KEY
      );
    } catch (e) {
      console.error(e);
    }

    showToast('Cleared all saved bookmarks.');
  };

  const handleAcceptAllCookies = () => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          choice: 'all',
          timestamp: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error(e);
    }

    setShowCookieBanner(false);

    showToast(
      'Cookie preferences updated: All cookies accepted.'
    );
  };

  const handleRejectNonEssentialCookies = () => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({
          choice: 'essential_only',
          timestamp: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error(e);
    }

    setShowCookieBanner(false);

    showToast(
      'Cookie preferences updated: Non-essential cookies rejected.'
    );
  };

  const handleOpenAuth = (
    mode: 'signin' | 'register' = 'signin'
  ) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignIn = (
    email: string,
    name?: string
  ) => {
    const user: AppUser = {
      uid:
        currentUser?.uid ||
        `usr_${Date.now()}`,
      email,
      name:
        name ||
        email.split('@')[0],
      subscriptionTier:
        currentUser?.subscriptionTier ||
        'basic',
      subscriptionStatus:
        currentUser?.subscriptionStatus ||
        'inactive',
      subscriptionExpiry:
        currentUser?.subscriptionExpiry,
      createdAt:
        currentUser?.createdAt ||
        new Date().toISOString(),
    };

    setCurrentUser(user);

    try {
      localStorage.setItem(
        'worldscope_current_user',
        JSON.stringify(user)
      );
    } catch (e) {
      console.error(e);
    }

    showToast(
      `Signed in to WorldScope as ${user.name}`
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(
        'Sign out warning:',
        e
      );
    }

    setCurrentUser(null);

    try {
      localStorage.removeItem(
        'worldscope_current_user'
      );

      localStorage.removeItem(
        'bbc_current_user'
      );
    } catch (e) {
      console.error(e);
    }

    showToast(
      'Signed out of WorldScope Account.'
    );
  };

  // FIXED: Subscription callback now accepts the complete AppUser object
  const handleSubscriptionSuccess = (
    updatedUser: AppUser
  ) => {
    setCurrentUser(updatedUser);

    try {
      localStorage.setItem(
        'worldscope_current_user',
        JSON.stringify(updatedUser)
      );
    } catch (e) {
      console.error(e);
    }

    showToast(
      `Subscribed to WorldScope ${(updatedUser.subscriptionTier || 'basic').toUpperCase()} Intelligence! Full access unlocked.`
    );
  };

  const handleOpenNewsletters = (
    initialId?: string
  ) => {
    setNewslettersInitialId(initialId);
    setIsNewslettersModalOpen(true);
  };

  // Global Search
  const [searchQuery, setSearchQuery] =
    useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  // Persist articles
  useEffect(() => {
    try {
      localStorage.setItem(
        ARTICLES_STORAGE_KEY,
        JSON.stringify(articles)
      );
    } catch (e) {
      console.error(
        'Error persisting articles',
        e
      );
    }
  }, [articles]);

  // Persist categories
  useEffect(() => {
    try {
      localStorage.setItem(
        CATEGORIES_STORAGE_KEY,
        JSON.stringify(categories)
      );
    } catch (e) {
      console.error(
        'Error persisting categories',
        e
      );
    }
  }, [categories]);

  // List of all unique categories present in the system
  const allCategoriesList = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...articles.map((a) => a.category),
    ])
  );

  // Breaking news articles
  const breakingArticles = articles.filter(
    (a) => a.isBreaking
  );

  // Live search results
  const searchResults = searchQuery.trim()
    ? articles.filter((art) => {
        const q = searchQuery.toLowerCase();

        return (
          art.title
            .toLowerCase()
            .includes(q) ||
          art.lead
            .toLowerCase()
            .includes(q) ||
          art.category
            .toLowerCase()
            .includes(q) ||
          art.author.name
            .toLowerCase()
            .includes(q) ||
          art.tags.some((t) =>
            t.toLowerCase().includes(q)
          )
        );
      })
    : [];

  const showToast = (msg: string) => {
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler: Select Category
  const handleSelectCategory = (
    cat: string
  ) => {
    if (
      cat.toLowerCase() === 'home'
    ) {
      setCurrentView('home');
      setSelectedCategory('Home');
      setSelectedSubCategory(undefined);
      setSelectedArticle(null);
    } else {
      setCurrentView('category');
      setSelectedCategory(cat);
      setSelectedSubCategory(undefined);
      setSelectedArticle(null);
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handler: Select Article
  const handleSelectArticle = (
    article: Article
  ) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === article.id
          ? {
              ...a,
              views: a.views + 1,
            }
          : a
      )
    );

    setSelectedArticle({
      ...article,
      views: article.views + 1,
    });

    setCurrentView('article');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handler: Add Comment to Article
  const handleAddComment = (
    articleId: string,
    comment: CommentItem
  ) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          const updatedComments = [
            comment,
            ...(a.comments || []),
          ];

          return {
            ...a,
            comments: updatedComments,
            commentsCount:
              updatedComments.length,
          };
        }

        return a;
      })
    );

    if (
      selectedArticle &&
      selectedArticle.id === articleId
    ) {
      setSelectedArticle((prev) => {
        if (!prev) return null;

        const updated = [
          comment,
          ...(prev.comments || []),
        ];

        return {
          ...prev,
          comments: updated,
          commentsCount:
            updated.length,
        };
      });
    }

    showToast(
      'Comment published to the editorial discussion.'
    );
  };

  // Reset to default seed articles
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset WorldScope Daily news wire to default 300 articles?'
      )
    ) {
      setArticles(INITIAL_ARTICLES);
      setCategories(
        DEFAULT_CATEGORIES
      );

      localStorage.removeItem(
        ARTICLES_STORAGE_KEY
      );

      localStorage.removeItem(
        CATEGORIES_STORAGE_KEY
      );

      setCurrentView('home');
      setSelectedCategory('Home');

      showToast(
        'Editorial archive reset to default WorldScope seed wire.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0e0e] text-black dark:text-[#f3f3f3] font-worldscope-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-black text-white px-5 py-3 border-2 border-white shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        categories={categories}
        allCategoriesList={allCategoriesList}
        activeCategory={selectedCategory}
        activeSubCategory={selectedSubCategory}
        onSelectCategory={
          handleSelectCategory
        }
        onSelectSubCategory={
          setSelectedSubCategory
        }
        onOpenArticle={
          handleSelectArticle
        }
        breakingArticles={
          breakingArticles
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenSubscriptionPlans={() =>
          setIsSubscriptionModalOpen(true)
        }
        onOpenPremiumNewsletter={() =>
          setIsPremiumNewsletterModalOpen(
            true
          )
        }
        bookmarksCount={
          bookmarks.length
        }
        onOpenBookmarks={() =>
          setIsBookmarksModalOpen(true)
        }
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            articles={articles}
            categories={categories}
            onSelectArticle={
              handleSelectArticle
            }
            onSelectCategory={
              handleSelectCategory
            }
            bookmarks={bookmarks}
            onToggleBookmark={
              handleToggleBookmark
            }
          />
        )}

        {currentView === 'category' && (
          <CategoryView
            categoryName={
              selectedCategory
            }
            categoryInfo={categories.find(
              (c) =>
                c.name.toLowerCase() ===
                selectedCategory.toLowerCase()
            )}
            activeSubCategory={
              selectedSubCategory
            }
            onSelectSubCategory={
              setSelectedSubCategory
            }
            articles={articles}
            onSelectArticle={
              handleSelectArticle
            }
            onOpenNewsletters={
              handleOpenNewsletters
            }
            bookmarks={bookmarks}
            onToggleBookmark={
              handleToggleBookmark
            }
          />
        )}

        {currentView === 'article' &&
          selectedArticle && (
            <ArticleDetailView
              article={selectedArticle}
              relatedArticles={articles.filter(
                (a) =>
                  a.id !==
                    selectedArticle.id &&
                  a.category.toLowerCase() ===
                    selectedArticle.category.toLowerCase()
              )}
              onBack={() => {
                if (
                  selectedCategory &&
                  selectedCategory.toLowerCase() !==
                    'home'
                ) {
                  setCurrentView(
                    'category'
                  );
                } else {
                  setCurrentView(
                    'home'
                  );
                }
              }}
              onSelectCategory={
                handleSelectCategory
              }
              onSelectArticle={
                handleSelectArticle
              }
              onAddComment={
                handleAddComment
              }
              currentUser={
                currentUser
              }
              onOpenAuth={
                handleOpenAuth
              }
              isBookmarked={bookmarks.some(
                (b) =>
                  b.id ===
                  selectedArticle.id
              )}
              onToggleBookmark={
                handleToggleBookmark
              }
              onToast={(msg) =>
                showToast(msg)
              }
            />
          )}
      </main>

      {/* Reset Data Control Bar */}
      <div className="bg-neutral-100 border-t border-neutral-300 py-2 px-4 text-center text-xs text-neutral-600 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] font-medium">
            WorldScope Daily Wire •{' '}
            <strong>
              {articles.length} stories
            </strong>{' '}
            in editorial archive •{' '}
            <strong>
              50 latest articles per page
            </strong>
          </span>

          <button
            type="button"
            onClick={
              handleResetData
            }
            className="text-[11px] font-semibold text-neutral-700 hover:text-black flex items-center space-x-1 underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>
              Reset Demo Archive to 300
              Stories
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer
        onSelectCategory={
          handleSelectCategory
        }
        onOpenSubscriptionPlans={() =>
          setIsSubscriptionModalOpen(true)
        }
        onOpenPremiumNewsletter={() =>
          setIsPremiumNewsletterModalOpen(
            true
          )
        }
        onOpenAdvertise={() =>
          setIsAdvertiseModalOpen(true)
        }
        onOpenLegal={(tab) => {
          setLegalInitialTab(tab);
          setIsLegalModalOpen(true);
        }}
      />

      {/* Subscription Plans Modal */}
      <SubscriptionPlansModal
        isOpen={
          isSubscriptionModalOpen
        }
        onClose={() =>
          setIsSubscriptionModalOpen(
            false
          )
        }
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSubscriptionSuccess={
          handleSubscriptionSuccess
        }
      />

      {/* Premium Newsletter Reader & Paywall Modal */}
      <PremiumNewsletterModal
        isOpen={
          isPremiumNewsletterModalOpen
        }
        onClose={() =>
          setIsPremiumNewsletterModalOpen(
            false
          )
        }
        currentUser={currentUser}
        onOpenSubscriptionPlans={() => {
          setIsPremiumNewsletterModalOpen(
            false
          );
          setIsSubscriptionModalOpen(
            true
          );
        }}
        onOpenAuth={(mode) => {
          setIsPremiumNewsletterModalOpen(
            false
          );
          handleOpenAuth(mode);
        }}
      />

      {/* Commercial Advertising Modal */}
      <AdvertiseModal
        isOpen={
          isAdvertiseModalOpen
        }
        onClose={() =>
          setIsAdvertiseModalOpen(false)
        }
        onSuccessToast={(msg) =>
          showToast(msg)
        }
      />

      {/* Legal & Editorial Policy Pages Modal */}
      <LegalPagesModal
        isOpen={
          isLegalModalOpen
        }
        onClose={() =>
          setIsLegalModalOpen(false)
        }
        initialTab={
          legalInitialTab
        }
        onOpenSubscriptionPlans={() => {
          setIsLegalModalOpen(false);
          setIsSubscriptionModalOpen(
            true
          );
        }}
      />

      {/* Free Newsletters Signup Modal */}
      <NewslettersModal
  isOpen={isNewslettersModalOpen}
  onClose={() =>
    setIsNewslettersModalOpen(false)
  }
  initialSelectedId={
    newslettersInitialId
  }
/>
      {/* Sign In & Registration Modal */}
      <AuthModal
        isOpen={
          isAuthModalOpen
        }
        onClose={() =>
          setIsAuthModalOpen(false)
        }
        initialMode={
          authModalMode
        }
        currentUser={
          currentUser
        }
        onSignInSuccess={(user) => {
          setCurrentUser(user);

          try {
            localStorage.setItem(
              'worldscope_current_user',
              JSON.stringify(user)
            );
          } catch (e) {
            console.error(e);
          }

          showToast(
            `Signed in to WorldScope as ${user.name}`
          );
        }}
        onSignIn={
          handleSignIn
        }
        onSignOut={
          handleSignOut
        }
      />

      {/* Bookmarks / Saved Stories Modal */}
      <BookmarksModal
        isOpen={
          isBookmarksModalOpen
        }
        onClose={() =>
          setIsBookmarksModalOpen(false)
        }
        bookmarks={
          bookmarks
        }
        onSelectArticle={(art) => {
          setIsBookmarksModalOpen(
            false
          );
          handleSelectArticle(
            art
          );
        }}
        onRemoveBookmark={
          handleRemoveBookmark
        }
        onClearAllBookmarks={
          handleClearAllBookmarks
        }
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner
        isOpen={
          showCookieBanner
        }
        onAcceptAll={
          handleAcceptAllCookies
        }
        onRejectNonEssential={
          handleRejectNonEssentialCookies
        }
        onClose={() =>
          setShowCookieBanner(
            false
          )
        }
      />
    </div>
  );
}