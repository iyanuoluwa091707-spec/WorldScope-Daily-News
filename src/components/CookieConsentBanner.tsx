import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

export interface CookieConsentBannerProps {
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onAcceptAll,
  onRejectNonEssential,
  isOpen = true,
  onClose,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-2 sm:p-4 md:p-6 bg-black/60 sm:bg-black/40 backdrop-blur-xs flex justify-center animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="w-full max-w-4xl max-h-[88dvh] sm:max-h-[82vh] overflow-y-auto bg-white dark:bg-[#181818] text-black dark:text-white border-t-4 border-[#B80000] shadow-2xl p-3.5 sm:p-5 md:p-6 transition-colors rounded-none overscroll-contain">
        
        {/* Top Header: Title + Close Icon */}
        <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xs text-[#B80000] shrink-0">
              <Cookie className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight font-sans text-black dark:text-white leading-tight">
              WorldScope Daily Cookie & Privacy Choices
            </h3>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -mr-1 -mt-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer shrink-0 rounded-xs"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Content & Action Buttons Container */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          
          {/* Main Informational Column */}
          <div className="flex-1 space-y-2.5">
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We use essential cookies and local storage to make WorldScope Daily work smoothly—such as remembering your saved bookmarks, reading preferences, and dark theme. With your permission, we also use optional cookies to measure wire readership and personalize news coverage.
            </p>

            {/* Toggle Preferences Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1.5 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#B80000] dark:hover:text-white cursor-pointer underline underline-offset-2 transition-colors min-h-[36px]"
              >
                <span>{showDetails ? 'Hide cookie preferences' : 'Manage cookie preferences & details'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Expandable Preferences Drawer */}
            {showDetails && (
              <div className="pt-2 pb-1 border-t border-neutral-200 dark:border-neutral-700 space-y-2.5 text-xs animate-in fade-in duration-150">
                
                {/* 1. Essential */}
                <div className="flex items-start justify-between gap-2.5 p-2.5 sm:p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xs">
                  <div className="pr-2">
                    <span className="font-bold flex items-center gap-1.5 text-black dark:text-white text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                      Essential Cookies & Local Storage
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] sm:text-xs mt-1 leading-normal">
                      Strictly required for basic navigation, saved bookmarks archive, security, and font/contrast settings.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-xs shrink-0 whitespace-nowrap">
                    Always Active
                  </span>
                </div>

                {/* 2. Analytics */}
                <label className="flex items-start justify-between gap-2.5 p-2.5 sm:p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xs cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="pr-2">
                    <span className="font-bold text-black dark:text-white text-xs sm:text-sm">
                      Audience & Performance Metrics
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] sm:text-xs mt-1 leading-normal">
                      Helps us count page visits and understand which global news stories resonate with readers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#B80000] cursor-pointer mt-0.5 shrink-0"
                    aria-label="Toggle audience and performance metrics cookies"
                  />
                </label>

                {/* 3. Personalization */}
                <label className="flex items-start justify-between gap-2.5 p-2.5 sm:p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xs cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="pr-2">
                    <span className="font-bold text-black dark:text-white text-xs sm:text-sm">
                      Editorial Personalization
                    </span>
                    <p className="text-neutral-600 dark:text-neutral-400 text-[11px] sm:text-xs mt-1 leading-normal">
                      Allows topic suggestions and news alerts tailored to your favorite categories.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={personalizationEnabled}
                    onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                    className="w-5 h-5 accent-[#B80000] cursor-pointer mt-0.5 shrink-0"
                    aria-label="Toggle editorial personalization cookies"
                  />
                </label>

                {/* Save Custom Settings Button (shown when drawer is open) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (analyticsEnabled || personalizationEnabled) {
                        onAcceptAll();
                      } else {
                        onRejectNonEssential();
                      }
                    }}
                    className="w-full sm:w-auto bg-black dark:bg-[#2c2c2c] hover:bg-neutral-800 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center min-h-[42px] flex items-center justify-center"
                  >
                    Save My Preferences
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Responsive Layout for Mobile, Tablet, and Desktop */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-2.5 shrink-0 lg:w-56 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onAcceptAll}
              className="flex-1 lg:flex-none w-full bg-[#B80000] hover:bg-[#990000] active:bg-[#800000] text-white px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center min-h-[44px]"
            >
              Accept All Cookies
            </button>

            <button
              type="button"
              onClick={onRejectNonEssential}
              className="flex-1 lg:flex-none w-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 text-black dark:text-white border border-neutral-300 dark:border-neutral-600 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center flex items-center justify-center min-h-[44px]"
            >
              Reject Non-Essential
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
