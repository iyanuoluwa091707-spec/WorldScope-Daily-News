import React from 'react';
import { Logo } from './Logo';
import { 
  Crown, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import type { LegalTab } from './LegalPagesModal';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenSubscriptionPlans: () => void;
  onOpenPremiumNewsletter: () => void;
  onOpenAdvertise: () => void;
  onOpenLegal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory,
  onOpenSubscriptionPlans,
  onOpenPremiumNewsletter,
  onOpenAdvertise,
  onOpenLegal,
}) => {
  return (
    <footer className="w-full bg-white border-t border-neutral-300 mt-16 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. SUBSCRIBE TO PREMIUM NEWSLETTER BANNER (LOGO COLOURS: #B80000 & #FFD200) */}
      {/* ========================================================================= */}
      <div className="w-full bg-black text-white border-b-4 border-[#B80000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-[#B80000] text-[#FFD200] flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFD200] text-black text-[10px] font-black uppercase tracking-wider rounded-xs mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Executive Intelligence Dispatch</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Subscribe to the WorldScope Premium Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mt-1 leading-relaxed">
                Join 45,000+ diplomats, hedge fund managers, and industry leaders who rely on our closed-circuit geopolitical and macro intelligence briefings every morning.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              id="footer-subscribe-premium-btn"
              onClick={onOpenSubscriptionPlans}
              className="w-full sm:w-auto bg-[#B80000] hover:bg-[#990000] text-white font-bold py-3 px-6 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Subscribe to Premium — From $4.99/mo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="footer-preview-newsletter-btn"
              onClick={onOpenPremiumNewsletter}
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-[#FFD200] border border-[#FFD200]/40 font-bold py-3 px-5 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Preview Latest Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* WorldScope Logo Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
          <Logo variant="footer" theme="light" />
          <div className="flex items-center gap-4 text-xs font-bold text-neutral-600">
            <button
              type="button"
              onClick={onOpenAdvertise}
              className="text-[#B80000] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Advertise with WorldScope</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span>•</span>
            <span className="text-neutral-500 font-medium">
              Global Journalism & Independent Subscription Wire
            </span>
          </div>
        </div>

        {/* Editorial Categories Directory */}
        <div className="py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-sm border-b border-neutral-200">
          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              News Desks
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-[#B80000] hover:underline">UK News</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-[#B80000] hover:underline">Politics</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-[#B80000] hover:underline">England</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-[#B80000] hover:underline">Scotland</button></li>
              <li><button type="button" onClick={() => onSelectCategory('UK')} className="hover:text-[#B80000] hover:underline">Wales</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              Sport
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-[#B80000] hover:underline">Football</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-[#B80000] hover:underline">Premier League</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-[#B80000] hover:underline">Formula 1</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-[#B80000] hover:underline">Rugby Union</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Sport')} className="hover:text-[#B80000] hover:underline">Cricket</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              Health & Science
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-[#B80000] hover:underline">NHS Updates</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-[#B80000] hover:underline">Medical Science</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-[#B80000] hover:underline">Public Wellbeing</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Health')} className="hover:text-[#B80000] hover:underline">Clinical Trials</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              Technology
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-[#B80000] hover:underline">Artificial Intelligence</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-[#B80000] hover:underline">Silicon Tech</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-[#B80000] hover:underline">Cybersecurity</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Technology')} className="hover:text-[#B80000] hover:underline">Quantum Devices</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              Business
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-[#B80000] hover:underline">UK Economy</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-[#B80000] hover:underline">Global Markets</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-[#B80000] hover:underline">City of London</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Business')} className="hover:text-[#B80000] hover:underline">Commodities</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-black uppercase text-xs tracking-wider mb-3 pb-1 border-b-2 border-[#B80000] inline-block">
              Culture & Arts
            </h4>
            <ul className="space-y-2 text-neutral-600 text-xs font-medium">
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-[#B80000] hover:underline">Film & Television</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-[#B80000] hover:underline">Architecture</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-[#B80000] hover:underline">Literature</button></li>
              <li><button type="button" onClick={() => onSelectCategory('Culture')} className="hover:text-[#B80000] hover:underline">Art Exhibitions</button></li>
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. "Follow BBC on:" EXACT SOCIAL BAR MATCHING 3.PNG */}
        {/* ========================================================================= */}
        <div className="py-6 flex flex-wrap items-center gap-4 text-xs font-bold text-black border-b border-neutral-200">
          <span className="text-sm font-black text-black">Follow BBC on:</span>
          
          <div className="flex items-center gap-4 text-black">
            {/* X (formerly Twitter) */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on X"
              aria-label="Follow on X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on Facebook"
              aria-label="Follow on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on Instagram"
              aria-label="Follow on Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on TikTok"
              aria-label="Follow on TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on LinkedIn"
              aria-label="Follow on LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#B80000] transition-colors p-1"
              title="Follow on YouTube"
              aria-label="Follow on YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. EXACT LEGAL & MANDATORY LINKS ROW MATCHING 3.PNG */}
        {/* ========================================================================= */}
        <div className="py-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-neutral-800 font-semibold border-b border-neutral-200">
          <button
            type="button"
            onClick={() => onOpenLegal('terms')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Terms of Use
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('subscription-terms')}
            className="hover:text-[#B80000] hover:underline cursor-pointer font-bold text-black"
          >
            Subscription Terms
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('terms')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            About the BBC
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('cookies')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Cookies
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('accessibility')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Accessibility Help
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('contact')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Contact the WORLDSCOPE DAILY
          </button>

          <button
            type="button"
            onClick={onOpenAdvertise}
            className="hover:text-[#B80000] hover:underline cursor-pointer font-bold text-[#B80000]"
          >
            Advertise with us
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Do not share or sell my info
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('faqs')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            WORLDSCOPE DAILY.com Help & FAQs
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('faqs')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Content Index
          </button>

          <button
            type="button"
            onClick={() => onOpenLegal('cookies')}
            className="hover:text-[#B80000] hover:underline cursor-pointer"
          >
            Set Preferred Source
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. COPYRIGHT DISCLAIMER & EXTERNAL LINKING STATEMENT MATCHING 3.PNG */}
        {/* ========================================================================= */}
        <div className="py-4 text-xs text-neutral-700 leading-relaxed font-sans">
          <p>
            Copyright 2026 WORLDSCOPE Daily. All rights reserved. The BBC is not responsible for the content of external sites.{' '}
            <button
              type="button"
              onClick={() => onOpenLegal('linking')}
              className="font-bold text-black hover:text-[#B80000] hover:underline cursor-pointer"
            >
              Read about our approach to external linking.
            </button>
          </p>
        </div>

      </div>
    </footer>
  );
};
