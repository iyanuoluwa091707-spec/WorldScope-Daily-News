import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'menu' | 'floating' | 'banner';
  className?: string;
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
  onInstalled,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Suppress if already running in standalone mode
  if (isInstalled) {
    return null;
  }

  // If not installable and not iOS, render a manual fallback button only if in menu or banner
  const canTriggerNative = isInstallable;
  const isEligible = canTriggerNative || isIOS;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (canTriggerNative) {
      const success = await install();
      if (success) {
        onInstalled?.();
      }
    } else {
      // Browser didn't fire beforeinstallprompt yet or in non-supporting desktop browser
      setShowIOSModal(true);
    }
  };

  // Header compact button
  if (variant === 'header') {
    return (
      <>
        <button
          id="worldscope-install-pwa-header-btn"
          type="button"
          onClick={handleInstallClick}
          title="Install WorldScope Daily on your device"
          aria-label="Install WorldScope App"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#B80000]" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>

        {showIOSModal && (
          <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Mobile Drawer Menu Item
  if (variant === 'menu') {
    return (
      <>
        <button
          id="worldscope-install-pwa-menu-btn"
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 text-left font-bold text-sm bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-800 rounded-xs transition-colors cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[#B80000] text-white flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#B80000] font-black">App Experience</div>
              <div className="text-sm font-bold">Install WorldScope</div>
            </div>
          </div>
          <Download className="w-4 h-4 text-neutral-500" />
        </button>

        {showIOSModal && (
          <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Bottom floating or banner style
  return (
    <>
      <div
        id="worldscope-install-pwa-banner"
        className={`fixed bottom-4 right-4 z-40 max-w-sm bg-black text-white p-3.5 shadow-2xl border border-neutral-800 rounded-xs flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 ${className}`}
      >
        <div className="w-9 h-9 shrink-0 bg-[#B80000] text-white flex items-center justify-center font-black">
          WS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-black uppercase tracking-wider text-[#B80000]">Fast & Offline</div>
          <div className="text-xs font-bold text-white truncate">Install WorldScope App</div>
        </div>
        <button
          type="button"
          onClick={handleInstallClick}
          className="bg-white hover:bg-neutral-200 text-black font-black text-xs px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer rounded-xs shrink-0"
        >
          Install
        </button>
      </div>

      {showIOSModal && (
        <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

// Guide modal for iOS Safari and other browsers
const IOSInstallGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#141414] text-black dark:text-white p-6 shadow-2xl border border-neutral-300 dark:border-neutral-800 rounded-xs relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close install instructions"
          className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xs bg-[#B80000] text-white flex items-center justify-center font-black text-base shadow-md">
            WS
          </div>
          <div>
            <h3 id="pwa-install-guide-title" className="text-base font-black uppercase tracking-tight">
              Install WorldScope Daily
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Add to your device home screen for instant full-screen news
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 text-sm bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-xs font-bold">Tap the Share or Menu icon</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                On iPhone/iPad Safari, tap <Share2 className="w-3.5 h-3.5 text-blue-500 inline" /> at the bottom or top bar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-xs font-bold">Select &ldquo;Add to Home Screen&rdquo;</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                Scroll through options and tap <PlusSquare className="w-3.5 h-3.5 text-emerald-500 inline" /> <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-xs font-bold">Confirm Installation</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Tap <strong>Add</strong> in the top-right corner. WorldScope will now appear alongside your native apps!
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#B80000] hover:bg-[#990000] text-white font-bold py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
        >
          Got It, Continue
        </button>
      </div>
    </div>
  );
};
