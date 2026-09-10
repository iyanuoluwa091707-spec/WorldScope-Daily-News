import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, ExternalLink } from 'lucide-react';
import { Article } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  onToast?: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  article,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the shareable URL
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article.title;
  const shareSummary = article.lead;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast?.('Article link copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      onToast?.('Article link copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareSummary,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User canceled or failed
      }
    }
  };

  // Social share links
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedSummary = encodeURIComponent(shareSummary);

  const socialChannels = [
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bgClass: 'bg-black hover:bg-neutral-800 text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgClass: 'bg-[#1877F2] hover:bg-[#0c63d4] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgClass: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      bgClass: 'bg-[#25D366] hover:bg-[#1faa53] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      ),
    },
    {
      name: 'Reddit',
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      bgClass: 'bg-[#FF4500] hover:bg-[#d63a00] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.702z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedSummary}%0A%0ARead the full story at:%20${encodedUrl}`,
      bgClass: 'bg-neutral-700 hover:bg-neutral-800 text-white',
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#181818] w-full max-w-lg max-h-[92dvh] sm:max-h-[85vh] shadow-2xl border-t-4 border-[#B80000] rounded-t-sm sm:rounded-none overflow-y-auto transition-colors flex flex-col overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#B80000] text-white rounded-xs shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 id="share-modal-title" className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight text-black dark:text-white">
              Share This Story
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-xs min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Preview Card */}
        <div className="p-3.5 sm:p-4 bg-neutral-50 dark:bg-[#202020] border-b border-neutral-200 dark:border-neutral-800 flex gap-3 items-center shrink-0">
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt="" 
              className="w-16 h-14 object-cover shrink-0 rounded-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-100" 
            />
          )}
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#B80000]">
              {article.category}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </div>
        </div>

        {/* Social Media Sharing Grid */}
        <div className="p-3.5 sm:p-5 flex-1">
          
          {/* Native Device Share (Top priority on mobile & tablet) */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-3 px-4 bg-[#B80000] hover:bg-[#990000] active:bg-[#800000] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px] transition-colors"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share via device options</span>
              </button>
            </div>
          )}

          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2.5">
            Share via social media
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold rounded-xs transition-all shadow-2xs min-h-[40px] ${channel.bgClass}`}
                title={`Share on ${channel.name}`}
              >
                <span className="shrink-0">{channel.icon}</span>
                <span className="truncate">{channel.name}</span>
                <ExternalLink className="w-3 h-3 opacity-60 shrink-0 hidden xs:inline" />
              </a>
            ))}
          </div>

          {/* Copy Link Feature */}
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Copy Story Link
            </label>
            <div className="flex flex-col xs:flex-row items-stretch gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                aria-label="Story link URL"
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-neutral-100 dark:bg-[#121212] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:outline-none select-all font-mono min-h-[40px]"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs shrink-0 min-h-[42px] ${
                  copied
                    ? 'bg-green-700 text-white'
                    : 'bg-black dark:bg-[#2c2c2c] hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 dark:bg-[#141414] border-t border-neutral-200 dark:border-neutral-800 text-center shrink-0">
          <p className="text-[11px] text-neutral-500">
            WorldScope Daily Editorial Wire • Free open-access story link
          </p>
        </div>
      </div>
    </div>
  );
};
