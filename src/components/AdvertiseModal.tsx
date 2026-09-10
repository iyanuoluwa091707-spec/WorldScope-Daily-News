import React, { useState } from 'react';
import { 
  X, 
  Megaphone, 
  Check, 
  Send, 
  Building2, 
  BarChart3, 
  Globe2, 
  Users, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';
import { AD_PACKAGES } from '../data/premiumNewsletters';
import { submitAdInquiry } from '../lib/userService';
import type { AdvertisementInquiry, AdPackage } from '../types';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const AdvertiseModal: React.FC<AdvertiseModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    AD_PACKAGES[0].id
  );
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('$2,500 - $5,000');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) return;

    setIsSubmitting(true);
    try {
      const inquiry: AdvertisementInquiry = {
        id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        companyName,
        contactName,
        email,
        website,
        packageId: selectedPackageId,
        budget,
        message,
        submittedAt: new Date().toISOString(),
      };

      await submitAdInquiry(inquiry);
      setSubmitted(true);
      onSuccessToast?.('Advertising inquiry submitted to WorldScope Commercial Media team.');
    } catch (error) {
      console.error('Error submitting advertising inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      id="worldscope-advertise-modal"
    >
      <div className="bg-white text-neutral-900 w-full max-w-5xl rounded-sm shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-black text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b-2 border-[#B80000]">
          <div className="flex items-center gap-3">
            <Logo variant="compact" theme="dark" />
            <span className="hidden sm:inline-block text-neutral-600">|</span>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFD200]">
              <Megaphone className="w-3.5 h-3.5 text-[#FFD200]" />
              <span>Commercial Media & Advertising</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          
          {submitted ? (
            <div className="text-center py-12 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 tracking-tight">
                Inquiry Received
              </h2>
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Thank you for your interest in advertising with <strong>WorldScope Daily</strong>. Our Commercial Media team will review your campaign brief and send a bespoke media kit and insertion order to <strong>{email}</strong> within 1 business day.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#B80000] hover:bg-[#990000] text-white font-bold py-2.5 px-6 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
              >
                Return to WorldScope
              </button>
            </div>
          ) : (
            <div>
              {/* Introduction Banner */}
              <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold tracking-wider uppercase mb-2 rounded-xs">
                  <Globe2 className="w-3.5 h-3.5 text-[#B80000]" />
                  <span>WorldScope Global Commercial Network</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
                  Reach Over 18 Million High-Value Global Decision Makers
                </h2>
                <p className="text-sm text-neutral-600">
                  Connect your brand, enterprise software, financial products, or luxury services directly with verified executives, policymakers, and discerning readers across 120+ countries.
                </p>

                {/* Audience Highlights */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-black block">18.5M+</span>
                    <span className="text-[11px] text-neutral-500 font-medium">Monthly Active Readers</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-[#B80000] block">45,000+</span>
                    <span className="text-[11px] text-neutral-500 font-medium">C-Suite & Fund Managers</span>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-xl sm:text-2xl font-black text-black block">58.4%</span>
                    <span className="text-[11px] text-neutral-500 font-medium">Newsletter Avg Open Rate</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Choose an Advertising Package */}
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
                  1. Select Commercial Placement Package
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {AD_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-xs border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected 
                            ? 'border-[#B80000] ring-2 ring-[#B80000] bg-red-50/20' 
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div>
                          {pkg.recommended && (
                            <span className="inline-block bg-[#B80000] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xs mb-2">
                              Best Engagement
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-black mb-1">{pkg.name}</h4>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-lg font-black text-black">{pkg.price}</span>
                            <span className="text-[11px] text-neutral-500">{pkg.period}</span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mb-3">{pkg.impressions}</p>
                          <ul className="space-y-1.5 text-[11px] text-neutral-700">
                            {pkg.benefits.slice(0, 3).map((b, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-tight">{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                          <span className={isSelected ? 'text-[#B80000]' : 'text-neutral-500'}>
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Interactive Campaign Inquiry Form */}
              <div className="bg-neutral-50 border border-neutral-200 p-5 sm:p-6 rounded-xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4 flex items-center gap-2">
                  <span>2. Submit Campaign Details & Reserve Inventory</span>
                  <span className="text-neutral-400 font-normal">(Non-binding inquiry)</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Company / Brand Name *
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Financial Group"
                        required
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Jordan Smith"
                        required
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="marketing@acme.com"
                        required
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Product or Website URL
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://acmefinance.com"
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Estimated Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                      >
                        <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                        <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                        <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                        <option value="$15,000+">$15,000+ (Institutional Partner)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Campaign Goals & Target Audience
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe the product or announcement you wish to advertise, desired run dates, or custom formatting requirements..."
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-xs bg-white focus:outline-none focus:border-[#B80000]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <span className="text-[11px] text-neutral-500">
                      🔒 Your submission is protected by our commercial privacy policies. No third-party data broker sharing.
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-[#B80000] hover:bg-[#990000] text-white font-bold py-2.5 px-8 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Advertising Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
