import React, { useState, useEffect } from 'react';
import { X, Check, Mail } from 'lucide-react';

interface NewslettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedId?: string;
  onSuccessToast?: (msg: string) => void;
}

interface NewsletterItem {
  id: string;
  name: string;
  cadence: string;
  description: string;
  themeColor: string;
  headerBg: string;
  imageUrl: string;
}

const NEWSLETTERS: NewsletterItem[] = [
  {
    id: 'news-briefing',
    name: 'News Briefing',
    cadence: 'Twice-daily, weekdays',
    description: 'Never miss the stories that matter. Bookend your day with top headlines and expert analysis.',
    themeColor: '#B80000',
    headerBg: 'bg-[#B80000]',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tech-decoded',
    name: 'Tech Decoded',
    cadence: 'Monday & Friday',
    description: 'Decode the biggest developments in global technology and learn how to live a better digital life, guided by WorldScope tech journalists.',
    themeColor: '#0284c7',
    headerBg: 'bg-[#0284c7]',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'football-extra',
    name: 'Football Extra',
    cadence: 'Monday, Wednesday & Friday',
    description: 'Dive into the biggest Premier League stories with smart analysis, expert insight and exclusive interviews.',
    themeColor: '#16a34a',
    headerBg: 'bg-[#15803d]',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'business-briefing',
    name: 'Business Briefing',
    cadence: 'Every weekday morning',
    description: 'Gain the leading edge with global insights for the boardroom and beyond, direct from London and New York.',
    themeColor: '#005A9C',
    headerBg: 'bg-[#005A9C]',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'culture-weekly',
    name: 'Culture Weekly',
    cadence: 'Every Saturday',
    description: 'Curated reviews, arts coverage, and literary highlights picked by WorldScope Culture correspondents.',
    themeColor: '#9B1B59',
    headerBg: 'bg-[#9B1B59]',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'health-matters',
    name: 'Health Matters',
    cadence: 'Every Tuesday',
    description: 'Practical wellbeing advice, medical science breakthroughs, and NHS analysis.',
    themeColor: '#007F7F',
    headerBg: 'bg-[#007F7F]',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  },
];

export const NewslettersModal: React.FC<NewslettersModalProps> = ({
  isOpen,
  onClose,
  initialSelectedId = 'football-extra',
  onSuccessToast,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([initialSelectedId, 'tech-decoded']);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevDocOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevDocOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleNewsletter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
    if (onSuccessToast) {
      onSuccessToast(`Subscribed to ${selectedIds.length} WorldScope newsletter${selectedIds.length > 1 ? 's' : ''}!`);
    }
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-none shadow-2xl overflow-hidden border border-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Black Bar */}
        <div className="bg-black text-white px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider">
            Newsletters from WorldScope Daily
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 max-h-[78vh] overflow-y-auto">
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black tracking-tight mb-2">
              Select your newsletters:
            </h2>
            <p className="text-sm text-gray-700 font-normal leading-relaxed max-w-2xl">
              Get the latest news, personalised insights, and must-read stories from WorldScope Daily straight to your inbox with our free newsletters.
            </p>
          </div>

          {/* Newsletters List */}
          <div className="space-y-4 mb-8">
            {NEWSLETTERS.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-gray-200 hover:border-gray-400 transition-colors bg-white"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    {/* Newsletter Card Banner */}
                    <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 relative overflow-hidden bg-neutral-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
                          WorldScope
                        </span>
                      </div>
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-black leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5 mb-1">
                        <span>🗓️</span> {item.cadence}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch (Green toggle when on, grey when off - 8.PNG & 9.PNG) */}
                  <div className="flex items-center justify-end sm:justify-center pl-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isChecked}
                      onClick={() => toggleNewsletter(item.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isChecked ? 'bg-[#15803d]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky/Bottom Sign Up Panel (Exact match to 8.PNG & 9.PNG) */}
          <div className="bg-[#e9ecef] border border-gray-300 p-4 sm:p-6">
            <h4 className="text-lg sm:text-xl font-bold font-serif text-black mb-1">
              You've selected {selectedIds.length} newsletter{selectedIds.length === 1 ? '' : 's'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 mb-4">
              Now enter your email address to sign up
            </p>

            {submitted ? (
              <div className="bg-[#15803d] text-white p-3 text-sm font-bold flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Thank you! Confirmation link dispatched to {email}.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label htmlFor="newsletter-email-input" className="block text-xs font-bold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.co.uk"
                      className="w-full bg-white border border-black px-3.5 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      required
                    />
                  </div>
                  <div className="sm:self-end">
                    <button
                      type="submit"
                      disabled={selectedIds.length === 0}
                      className="w-full sm:w-auto bg-[#006def] hover:bg-[#0052cc] text-white font-bold text-sm px-6 py-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sign up
                    </button>
                  </div>
                </div>

                {emailError && (
                  <p className="text-xs text-red-600 font-bold">{emailError}</p>
                )}

                <p className="text-[11px] text-gray-600 leading-normal pt-2">
                  By continuing you are creating a WorldScope Daily account, if you don't already have one, and you accept our{' '}
                  <strong className="text-black underline cursor-pointer">Terms of Use</strong>. Find out more in our{' '}
                  <strong className="text-black underline cursor-pointer">Privacy and Cookies Policy</strong> or read our{' '}
                  <strong className="text-black underline cursor-pointer">FAQs</strong>.
                </p>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
