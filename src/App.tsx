/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Article,
  CategoryInfo,
  CommentItem,
  AppUser,
} from './types';

import { INITIAL_ARTICLES } from './data/initialArticles';
import { DEFAULT_CATEGORIES } from './data/categories';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { NewslettersModal } from './components/NewslettersModal';
import { AuthModal } from './components/AuthModal';

import { RotateCcw } from 'lucide-react';

import { auth, onAuthStateChanged } from './lib/firebase';

const ARTICLES_STORAGE_KEY = 'worldscope_daily_articles_v3_50';
const CATEGORIES_STORAGE_KEY = 'worldscope_daily_categories_v3_50';
const USER_STORAGE_KEY = 'worldscope_current_user';

export default function App() {
  // =========================================================
  // ARTICLES
  // =========================================================

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
      console.error(
        'Error loading articles from localStorage',
        e
      );
    }

    return INITIAL_ARTICLES;
  });

  // =========================================================
  // CATEGORIES
  // =========================================================

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved =
        localStorage.getItem(CATEGORIES_STORAGE_KEY) ||
        localStorage.getItem('bbc_news_categories_v3_50');

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(
        'Error loading categories from localStorage',
        e
      );
    }

    return DEFAULT_CATEGORIES;
  });

  // =========================================================
  // NAVIGATION
  // =========================================================

  const [currentView, setCurrentView] = useState<
    'home' | 'category' | 'article'
  >('home');

  const [selectedCategory, setSelectedCategory] =
    useState<string>('Home');

  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string | undefined>(undefined);

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  // =========================================================
  // NEWSLETTERS
  // =========================================================

  const [isNewslettersModalOpen, setIsNewslettersModalOpen] =
    useState(false);

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [currentUser, setCurrentUser] =
    useState<AppUser | null>(() => {
      try {
        const savedUser =
          localStorage.getItem(USER_STORAGE_KEY) ||
          localStorage.getItem('bbc_current_user');

        return savedUser ? JSON.parse(savedUser) : null;
      } catch (e) {
        console.error(
          'Error loading saved user',
          e
        );
        return null;
      }
    });

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const [authModalMode, setAuthModalMode] =
    useState<'signin' | 'register'>('signin');

  // =========================================================
  // FIREBASE AUTH STATE
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          setCurrentUser(null);

          try {
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem('bbc_current_user');
          } catch (e) {
            console.error(
              'Error clearing saved user',
              e
            );
          }

          return;
        }

        const providerId =
          firebaseUser.providerData?.[0]?.providerId;

        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'Reader',
          photoURL: firebaseUser.photoURL || null,
          providerId: providerId,
          savedArticles: [],
          subscribedNewsletters: ['global-dispatch'],
        };

        setCurrentUser(appUser);

        try {
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(appUser)
          );
        } catch (e) {
          console.error(
            'Error saving authenticated user',
            e
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // OPEN AUTH MODAL
  // =========================================================

  const handleOpenAuth = (
    mode: 'signin' | 'register' = 'signin'
  ) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // =========================================================
  // SIGN IN SUCCESS
  // =========================================================

  const handleSignIn = (user: AppUser) => {
    setCurrentUser(user);

    try {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } catch (e) {
      console.error(
        'Error saving user to localStorage',
        e
      );
    }

    showToast(
      `Signed in to WorldScope as ${user.name}`
    );

    setIsAuthModalOpen(false);
  };

  // =========================================================
  // SIGN OUT
  // =========================================================

  const handleSignOut = () => {
    setCurrentUser(null);

    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('bbc_current_user');
    } catch (e) {
      console.error(
        'Error removing saved user',
        e
      );
    }

    showToast(
      'Signed out of WorldScope Account.'
    );
  };

  // =========================================================
  // NEWSLETTERS
  // =========================================================

  const handleOpenNewsletters = () => {
    setIsNewslettersModalOpen(true);
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchQuery, setSearchQuery] =
    useState('');

  // =========================================================
  // TOAST
  // =========================================================

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // =========================================================
  // PERSIST ARTICLES
  // =========================================================

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

  // =========================================================
  // PERSIST CATEGORIES
  // =========================================================

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

  // =========================================================
  // ALL CATEGORIES
  // =========================================================

  const allCategoriesList = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...articles.map((a) => a.category),
    ])
  );

  // =========================================================
  // BREAKING NEWS
  // =========================================================

  const breakingArticles = articles.filter(
    (a) => a.isBreaking
  );

  // =========================================================
  // SEARCH RESULTS
  // =========================================================

  const searchResults = searchQuery.trim()
    ? articles.filter((art) => {
        const q = searchQuery.toLowerCase();

        return (
          art.title.toLowerCase().includes(q) ||
          art.lead.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          art.author.name.toLowerCase().includes(q) ||
          art.tags.some((t) =>
            t.toLowerCase().includes(q)
          )
        );
      })
    : [];

  // =========================================================
  // SELECT CATEGORY
  // =========================================================

  const handleSelectCategory = (cat: string) => {
    if (cat.toLowerCase() === 'home') {
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

  // =========================================================
  // SELECT ARTICLE
  // =========================================================

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

  // =========================================================
  // ADD COMMENT
  // =========================================================

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
          commentsCount: updated.length,
        };
      });
    }

    showToast(
      'Comment published to the editorial discussion.'
    );
  };

  // =========================================================
  // RESET DATA
  // =========================================================

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset WorldScope Daily news wire to default 300 articles?'
      )
    ) {
      setArticles(INITIAL_ARTICLES);
      setCategories(DEFAULT_CATEGORIES);

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

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-worldscope-sans selection:bg-black selection:text-white">

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
        onSelectCategory={handleSelectCategory}
        onSelectSubCategory={setSelectedSubCategory}
        onOpenArticle={handleSelectArticle}
        breakingArticles={breakingArticles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
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
          />
        )}

        {currentView === 'category' && (
          <CategoryView
            categoryName={selectedCategory}
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
                  setCurrentView('category');
                } else {
                  setCurrentView('home');
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
            onClick={handleResetData}
            className="text-[11px] font-semibold text-neutral-700 hover:text-black flex items-center space-x-1 underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />

            <span>
              Reset Demo Archive to 300 Stories
            </span>
          </button>

        </div>
      </div>

      {/* Footer */}

      <Footer
        onSelectCategory={
          handleSelectCategory
        }
      />

      {/* Newsletters Modal */}

      <NewslettersModal
        isOpen={isNewslettersModalOpen}
        onClose={() =>
          setIsNewslettersModalOpen(false)
        }
      />

      {/* Authentication Modal */}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() =>
          setIsAuthModalOpen(false)
        }
        initialMode={authModalMode}
        currentUser={currentUser}
        onSignInSuccess={handleSignIn}
        onSignOut={handleSignOut}
      />

    </div>
  );
}