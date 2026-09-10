import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Crown, 
  Check, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Download, 
  Printer, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { PREMIUM_NEWSLETTERS } from '../data/premiumNewsletters';
import type { AppUser, PremiumNewsletter } from '../types';

interface PremiumNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onOpenSubscriptionPlans: () => void;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
}

export const PremiumNewsletterModal: React.FC<PremiumNewsletterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenSubscriptionPlans,
  onOpenAuth,
}) => {
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string>(
    PREMIUM_NEWSLETTERS[0].id
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Bulletproof body scroll lock when modal is open to prevent underlying page from moving on iOS/Android
  React.useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.overflow = originalOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSubscribed = currentUser?.subscriptionStatus === 'active';
  const userTier = currentUser?.subscriptionTier || 'basic';
  const expiryDate = currentUser?.subscriptionExpiry 
    ? new Date(currentUser.subscriptionExpiry).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Not Active';

  const activeNewsletter = PREMIUM_NEWSLETTERS.find(
    (n) => n.id === selectedNewsletterId
  ) || PREMIUM_NEWSLETTERS[0];

  const canAccessFull = isSubscribed && (
    userTier === 'enterprise' || 
    (userTier === 'premium' && activeNewsletter.tierRequired !== 'enterprise') ||
    (userTier === 'basic' && activeNewsletter.tierRequired === 'basic')
  );

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      id="worldscope-premium-newsletter-modal"
    >
      <div className="bg-white text-neutral-900 w-full max-w-6xl rounded-sm shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        
        {/* Top Header Bar */}
        <div className="bg-black text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b-2 border-[#B80000] shrink-0">
          <div className="flex items-center gap-3">
            <Logo variant="compact" theme="dark" />
            <span className="hidden sm:inline-block text-neutral-600">|</span>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFD200]">
              <Crown className="w-3.5 h-3.5 text-[#FFD200]" />
              <span>The Executive Intelligence Briefing</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-[#FFD200]/40 rounded-xs text-[11px] font-bold text-[#FFD200]">
                <Crown className="w-3.5 h-3.5 text-[#FFD200]" />
                <span className="uppercase">{userTier} Subscriber</span>
                <span className="text-neutral-400 font-normal">• Expiry: {expiryDate}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenSubscriptionPlans}
                className="bg-[#B80000] hover:bg-[#990000] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#FFD200]" />
                <span>Subscribe to Access</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Directory + Reading Stage */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Edition Selector (Desk Index) */}
          <div className="w-full md:w-80 bg-neutral-50 border-r border-neutral-200 overflow-y-auto shrink-0 flex flex-col">
            <div className="p-4 border-b border-neutral-200 bg-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000] block mb-0.5">
                Executive Dispatch Archive
              </span>
              <h3 className="text-sm font-bold text-black">
                Recent Intelligence Reports
              </h3>
            </div>

            <div className="divide-y divide-neutral-200 flex-1 overflow-y-auto">
              {PREMIUM_NEWSLETTERS.map((newsletter) => {
                const isSelected = selectedNewsletterId === newsletter.id;
                return (
                  <button
                    key={newsletter.id}
                    type="button"
                    onClick={() => setSelectedNewsletterId(newsletter.id)}
                    className={`w-full text-left p-4 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected 
                        ? 'bg-white border-l-4 border-l-[#B80000] shadow-xs' 
                        : 'hover:bg-neutral-100 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-neutral-500 uppercase tracking-wider">{newsletter.date}</span>
                      <span className={`px-1.5 py-0.5 rounded-xs uppercase font-black ${
                        newsletter.tierRequired === 'enterprise'
                          ? 'bg-neutral-900 text-[#FFD200]'
                          : 'bg-red-100 text-[#B80000]'
                      }`}>
                        {newsletter.tierRequired}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-black font-black' : 'text-neutral-800'
                    }`}>
                      {newsletter.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                      <span>By {newsletter.author.name.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{newsletter.readTime}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Subscription Upsell Card inside Sidebar */}
            <div className="p-4 bg-black text-white border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-[#FFD200] text-xs font-bold uppercase mb-1">
                <Crown className="w-3.5 h-3.5" />
                <span>Executive Membership</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                Direct weekly briefings on international trade, monetary policy, and frontier tech.
              </p>
              {!isSubscribed ? (
                <button
                  type="button"
                  onClick={onOpenSubscriptionPlans}
                  className="w-full bg-[#B80000] hover:bg-[#990000] text-white text-xs font-bold py-2 px-3 rounded-xs uppercase tracking-wider cursor-pointer transition-colors text-center block"
                >
                  Join for $12.99 / mo
                </button>
              ) : (
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your subscription is active</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Dispatch Reader */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-white">
            
            {/* Top Meta Details */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200 mb-6 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#B80000] uppercase tracking-wider">
                  {activeNewsletter.edition}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeNewsletter.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeNewsletter.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xs cursor-pointer transition-colors"
                  title="Share Briefing"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xs cursor-pointer transition-colors"
                  title="Print Dispatch"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight tracking-tight mb-4 font-serif">
              {activeNewsletter.title}
            </h1>

            {/* Author Profile */}
            <div className="flex items-center gap-3 py-3 px-4 bg-neutral-50 border border-neutral-200 rounded-xs mb-6">
              <img
                src={activeNewsletter.author.avatar}
                alt={activeNewsletter.author.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-neutral-300"
              />
              <div>
                <span className="font-bold text-sm text-black block">
                  {activeNewsletter.author.name}
                </span>
                <span className="text-xs text-neutral-500">
                  {activeNewsletter.author.role}
                </span>
              </div>
            </div>

            {/* Executive Market Metrics Strip */}
            {activeNewsletter.metrics && (
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeNewsletter.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-neutral-50 border border-neutral-200 p-2.5 rounded-xs">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                      {metric.label}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-black text-black font-mono">
                        {metric.value}
                      </span>
                      <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                        metric.isPositive ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Executive Summary (Visible to everyone) */}
            <div className="mb-6 p-4 bg-red-50/50 border-l-4 border-[#B80000] rounded-r-xs">
              <span className="text-xs font-black uppercase tracking-widest text-[#B80000] block mb-1">
                Executive Synthesis
              </span>
              <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                {activeNewsletter.summary}
              </p>
            </div>

            {/* Key Strategic Takeaways (Visible to everyone) */}
            <div className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
                Key Strategic Takeaways
              </h3>
              <div className="space-y-2">
                {activeNewsletter.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Classified Content or Paywall Overlay */}
            {canAccessFull ? (
              <div className="space-y-4 text-sm text-neutral-800 leading-relaxed font-serif border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-sans">
                    Full Classified Analysis
                  </span>
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 font-sans">
                    <Crown className="w-3.5 h-3.5 text-[#B80000]" />
                    Verified Subscriber Full Access
                  </span>
                </div>

                {activeNewsletter.fullContent.map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {/* Footnote attribution */}
                <div className="mt-8 pt-4 border-t border-neutral-200 text-xs text-neutral-500 font-sans">
                  <p>
                    WorldScope Executive Briefings are dispatched exclusively to verified active subscribers. Redistribution or reproduction without prior written authorization from WorldScope Editorial Syndicate is strictly prohibited.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative border-t border-neutral-200 pt-4">
                {/* Teaser Paragraph with Blur Gradient */}
                <div className="relative overflow-hidden max-h-32 select-none pointer-events-none opacity-40 filter blur-[1px]">
                  <p className="text-sm font-serif leading-relaxed text-neutral-800 mb-4">
                    {activeNewsletter.fullContent[0]}
                  </p>
                  <p className="text-sm font-serif leading-relaxed text-neutral-800">
                    {activeNewsletter.fullContent[1]}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
                </div>

                {/* The Subscriber Paywall Card */}
                <div className="relative -mt-16 bg-neutral-950 text-white p-6 sm:p-8 rounded-xs border-2 border-[#B80000] shadow-2xl text-center max-w-xl mx-auto">
                  <div className="w-12 h-12 rounded-full bg-[#B80000] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FFD200] mb-2">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Subscriber-Only Intelligence</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black mb-2 text-white tracking-tight">
                    Read the Full In-Depth Briefing
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-6 max-w-md mx-auto">
                    The complete analysis, proprietary quantitative data matrices, and policy forecast models are reserved exclusively for WorldScope Subscribers.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      type="button"
                      id="newsletter-unlock-sub-btn"
                      onClick={onOpenSubscriptionPlans}
                      className="w-full sm:w-auto bg-[#B80000] hover:bg-[#990000] text-white font-bold py-2.5 px-6 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FFD200]" />
                      <span>Unlock with Premium ($12.99/mo)</span>
                    </button>

                    {!currentUser && (
                      <button
                        type="button"
                        onClick={() => onOpenAuth('signin')}
                        className="text-xs font-semibold text-neutral-300 hover:text-white underline cursor-pointer py-2"
                      >
                        Already a subscriber? Sign in
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-center gap-4">
                    <span>✓ Cancel anytime</span>
                    <span>•</span>
                    <span>✓ Ad-free experience</span>
                    <span>•</span>
                    <span>✓ Real-time wire</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
