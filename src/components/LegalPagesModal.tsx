import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Cookie, 
  HelpCircle, 
  Mail, 
  Scale, 
  CreditCard, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { Logo } from './Logo';

export type LegalTab = 
  | 'terms'
  | 'subscription-terms'
  | 'privacy'
  | 'cookies'
  | 'accessibility'
  | 'contact'
  | 'linking'
  | 'faqs';

interface LegalPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  onOpenSubscriptionPlans?: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
  onOpenSubscriptionPlans,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

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

  const tabs: { id: LegalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'terms', label: 'Terms of Use', icon: Scale },
    { id: 'subscription-terms', label: 'Subscription Terms', icon: CreditCard },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'cookies', label: 'Cookies Policy', icon: Cookie },
    { id: 'accessibility', label: 'Accessibility Help', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'linking', label: 'Approach to Linking', icon: ExternalLink },
    { id: 'faqs', label: 'Help & FAQs', icon: BookOpen },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden overscroll-contain animate-in fade-in duration-200"
      id="worldscope-legal-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#141414] text-neutral-900 dark:text-neutral-100 w-full max-w-5xl rounded-sm shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col h-[94vh] sm:h-[90vh] md:max-h-[88vh] overscroll-contain">
        
        {/* Top Bar */}
        <div className="bg-black text-white px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between border-b-2 border-[#B80000] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Logo variant="compact" theme="dark" />
            <span className="hidden sm:inline-block text-neutral-600">|</span>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFD200] truncate">
              <FileText className="w-3.5 h-3.5 text-[#FFD200] shrink-0" />
              <span className="truncate">Editorial Policies & Legal Charter</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout: Left Navigation + Right Document View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Navigation Tabs: Horizontal scrollable on mobile/tablet, vertical sidebar on desktop */}
          <div className="w-full md:w-64 bg-neutral-100 dark:bg-[#181818] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 p-2 sm:p-3 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar overscroll-contain">
            <div className="flex flex-row md:flex-col gap-1.5 min-w-max md:min-w-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 md:py-2.5 rounded-xs text-xs font-bold transition-colors flex items-center justify-between gap-2 cursor-pointer whitespace-nowrap shrink-0 text-left ${
                      isActive
                        ? 'bg-[#B80000] text-white shadow-xs'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden md:block" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Document Content */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain bg-white dark:bg-[#141414] text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
            
            {/* 1. TERMS OF USE */}
            {activeTab === 'terms' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Editorial Standards & Legal Charter
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    WorldScope Terms of Use
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Last updated: September 2026 • Effective globally
                  </p>
                </div>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing, browsing, reading, or creating an account on WorldScope Daily, you agree to be bound by these Terms of Use, our Privacy Policy, and all applicable domestic and international laws and regulations. If you do not accept these terms, you must discontinue your use of the services immediately.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">2. Intellectual Property & Syndication</h3>
                <p>
                  All editorial articles, photographs, live text dispatches, investigative data analyses, graphics, typography, audio recordings, and software code are the exclusive intellectual property of WorldScope Editorial Syndicate or licensed from global press agencies (Reuters, PA Media, Agence France-Presse).
                </p>
                <p>
                  You may print or download single copies of individual articles solely for personal, non-commercial educational use. Scraping, data-mining, commercial redistribution, or training generative AI models without written licensing contracts is strictly prohibited.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">3. User Comments & Community Code</h3>
                <p>
                  WorldScope encourages civil discourse. When participating in comment sections, users agree not to post defamatory, racist, sexually explicit, abusive, or unlawful content. WorldScope editors reserve the right to moderate, hide, or remove commentary without notice.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">4. Disclaimers & Limitation of Liability</h3>
                <p>
                  WorldScope Daily publishes accurate, fact-checked journalism in good faith. However, financial markets intelligence and economic commentary do not constitute personalized financial, tax, or investment advice. WorldScope is not liable for business or investment decisions based on editorial content.
                </p>
              </div>
            )}

            {/* 2. SUBSCRIPTION TERMS */}
            {activeTab === 'subscription-terms' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Billing & Membership Agreement
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    WorldScope Subscription Terms
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Applies to Basic Reader, Premium Intelligence, and Enterprise tiers
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#B80000] dark:text-red-400 block">Ready to upgrade?</span>
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">Access exclusive executive dispatches today.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSubscriptionPlans}
                    className="bg-[#B80000] text-white px-3 py-1.5 text-xs font-bold uppercase rounded-xs hover:bg-[#990000] cursor-pointer"
                  >
                    View Plans
                  </button>
                </div>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">1. Subscription Tiers & Billing Cycles</h3>
                <p>
                  WorldScope offers recurring subscriptions billed either monthly or annually in advance via secure payment gateways (Stripe). Subscriptions automatically renew at the end of each billing period unless canceled prior to the renewal date.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">2. Premium Newsletter Access</h3>
                <p>
                  Active subscribers to the <strong>Premium Intelligence</strong> and <strong>Enterprise Institutional</strong> tiers receive privileged access to the weekly WorldScope Executive Briefing dispatches, proprietary quantitative tables, and economic indicator forecasts. Subscribed status is stored securely and verified through Cloud Firestore.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">3. 30-Day Money-Back Guarantee & Cancellation</h3>
                <p>
                  New annual subscribers may request a full refund within 30 days of their initial purchase if dissatisfied with our editorial coverage. You can cancel your subscription renewal anytime in one click from your Account Portal or by contacting customer support. Upon cancellation, your access remains active until the end of your prepaid billing period.
                </p>
              </div>
            )}

            {/* 3. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Data Protection Charter
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Privacy Policy & GDPR / CCPA Compliance
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Compliant with UK Data Protection Act 2018 and EU GDPR
                  </p>
                </div>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">1. Information We Collect</h3>
                <p>
                  When you register, sign in, or subscribe, we collect your email address, display name, profile avatar (if signing in with Google), and subscription tier status. We do not store raw credit card numbers on our servers; all payment transactions are handled through PCI-DSS Level 1 certified payment processors (Stripe).
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">2. How We Use Your Data</h3>
                <p>
                  We process personal data strictly to deliver authoritative news, dispatch subscribed executive newsletters, manage bookmark reading lists, and authenticate subscriber paywall access. We do not sell your personal information or share reading habits with third-party data brokers.
                </p>

                <h3 className="font-bold text-black dark:text-white text-sm pt-2">3. Your Legal Rights</h3>
                <p>
                  Under GDPR and CCPA, you have the right to request a copy of your stored personal data, rectify inaccuracies, request account deletion (the right to be forgotten), or restrict data processing by contacting our Data Protection Officer at privacy@worldscope.com.
                </p>
              </div>
            )}

            {/* 4. COOKIES POLICY */}
            {activeTab === 'cookies' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Browser Storage & Preferences
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Cookies & Local Storage Policy
                  </h2>
                </div>

                <p>
                  WorldScope uses essential browser cookies and local storage to remember your login session, preserve your reading preferences, track category navigation, and maintain your bookmarked articles.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <span className="font-bold text-black dark:text-white block">Strictly Necessary Cookies</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Essential for user authentication, security verification, and subscription paywall state enforcement.</span>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <span className="font-bold text-black dark:text-white block">Functional Preferences</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Remembers article font sizing, collapsed sidebars, and newsletter notification preferences.</span>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <span className="font-bold text-black dark:text-white block">Performance & Measurement</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">Aggregated, anonymized readership statistics helping our editors understand which investigative stories resonate globally.</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. ACCESSIBILITY HELP */}
            {activeTab === 'accessibility' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Inclusion Commitment
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Accessibility Statement
                  </h2>
                </div>

                <p>
                  WorldScope is committed to providing news accessible to everyone, conforming to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  <li>High-contrast editorial typography and clear font hierarchy with compliant color ratios.</li>
                  <li>Full keyboard navigable menus, drawer selectors, and search shortcuts.</li>
                  <li>Screen-reader compatible headings, image descriptive captions, and ARIA labels.</li>
                  <li>Adjustable zoom tolerance up to 200% without horizontal scroll disruption.</li>
                </ul>
              </div>
            )}

            {/* 6. CONTACT US */}
            {activeTab === 'contact' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Newsroom & Operations
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Contact WorldScope Daily
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-sm mb-1">Editorial Newsroom</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Tips, investigative submissions, and breaking news alerts.</p>
                    <span className="text-xs font-mono font-bold text-[#B80000] dark:text-red-400">newsdesk@worldscope.com</span>
                  </div>

                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-sm mb-1">Subscriber & Billing Support</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Assistance with membership, Stripe invoices, or team licensing.</p>
                    <span className="text-xs font-mono font-bold text-[#B80000] dark:text-red-400">subscriptions@worldscope.com</span>
                  </div>

                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-sm mb-1">Commercial Media & Advertising</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Sponsored dispatches, leaderboard buys, and corporate media kits.</p>
                    <span className="text-xs font-mono font-bold text-[#B80000] dark:text-red-400">commercial@worldscope.com</span>
                  </div>

                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-sm mb-1">Press Office & Syndicate</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Media inquiries, broadcast licensing, and republication rights.</p>
                    <span className="text-xs font-mono font-bold text-[#B80000] dark:text-red-400">press@worldscope.com</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. APPROACH TO LINKING */}
            {activeTab === 'linking' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Editorial Integrity
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Our Approach to External Linking
                  </h2>
                </div>

                <p>
                  WorldScope Daily aims to link readers directly to primary sources: government legislative portals, academic research journals, statistical data tables, and judicial documents.
                </p>
                <p>
                  We do not accept payment or commercial incentives for hyperlinks in editorial articles. WorldScope is not responsible for the ongoing content or security of external third-party websites. Links to external sites are clearly marked and open in compliance with standard security protocols.
                </p>
              </div>
            )}

            {/* 8. HELP & FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-4 max-w-3xl">
                <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B80000]">
                    Frequently Asked Questions
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white">
                    Help & FAQs
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-xs mb-1">How do I access the Premium Executive Newsletter?</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Once subscribed via the Subscription Portal, your credentials are verified via Cloud Firestore. You can click "Executive Briefing" in the header or footer to read all full dispatches.</p>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-xs mb-1">Can I read WorldScope offline?</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Premium subscribers can save unlimited stories to their reading list and print or export full briefings to PDF.</p>
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs">
                    <h4 className="font-bold text-black dark:text-white text-xs mb-1">How can my company advertise products on WorldScope?</h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Click "Advertise with us" in the footer to view commercial packages and submit an inquiry directly to our media team.</p>
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
