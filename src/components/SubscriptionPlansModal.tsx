import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Sparkles, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Zap,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { updateUserSubscription } from '../lib/userService';
import type { AppUser, SubscriptionTier } from '../types';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onSubscriptionSuccess: (updatedUser: AppUser) => void;
  onOpenNewsletter?: () => void;
  initialTier?: SubscriptionTier;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenAuth,
  onSubscriptionSuccess,
  onOpenNewsletter,
  initialTier = 'premium',
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialTier);
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');

  // Checkout Form States (Simulated Stripe Elements)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || '');
  const [postalCode, setPostalCode] = useState('SW1A 1AA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const tiers = [
    {
      id: 'basic' as SubscriptionTier,
      name: 'Basic Reader',
      tagline: 'For daily general news followers',
      monthlyPrice: 4.99,
      yearlyPrice: 49.0,
      icon: Zap,
      accentColor: 'border-neutral-200',
      badge: null,
      features: [
        'Complete access to WorldScope Daily Wire',
        'Ad-free website and mobile reading experience',
        'Save up to 50 articles in your cloud library',
        'Standard Daily Briefing email dispatch',
        'Standard reader commenting privileges'
      ],
      notIncluded: [
        'Exclusive Executive Intelligence Briefings',
        'Macro market metrics & policy forecasts',
        'Audio edition of deep-dive investigative stories',
        'Unlimited offline downloads'
      ]
    },
    {
      id: 'premium' as SubscriptionTier,
      name: 'Premium Intelligence',
      tagline: 'Our flagship membership for executives and analysts',
      monthlyPrice: 12.99,
      yearlyPrice: 119.0,
      icon: Crown,
      accentColor: 'border-[#B80000] ring-2 ring-[#B80000]',
      badge: 'MOST POPULAR',
      badgeColor: 'bg-[#B80000] text-white',
      features: [
        'Everything in Basic Reader',
        'Exclusive Executive Intelligence Newsletters (Geopolitics & Macro)',
        'Full key takeaways, data metrics & sovereign flow indices',
        'Early access to investigative features & special reports',
        'Full audio narrated versions of all major stories',
        'Unlimited cloud bookmarks & reading lists',
        'Verified "Subscriber" badge on community commentary'
      ],
      notIncluded: [
        'Multi-user corporate seat management',
        'Direct API intelligence feed access'
      ]
    },
    {
      id: 'enterprise' as SubscriptionTier,
      name: 'Enterprise Institutional',
      tagline: 'For hedge funds, embassies, and corporate risk teams',
      monthlyPrice: 39.99,
      yearlyPrice: 380.0,
      icon: Building2,
      accentColor: 'border-neutral-800',
      badge: 'INSTITUTIONAL',
      badgeColor: 'bg-black text-[#FFD200] border border-[#FFD200]',
      features: [
        'Everything in Premium Intelligence',
        'Up to 10 team seats with centralized administrative billing',
        'Raw data feeds & intelligence wire API integration',
        'Direct quarterly consultation with senior editorial directors',
        'Custom bespoke sectoral reports upon request',
        'Priority 24/7 dedicated account support concierge'
      ],
      notIncluded: []
    }
  ];

  const currentTierData = tiers.find(t => t.id === selectedTier) || tiers[1];
  const price = billingCycle === 'yearly' 
    ? (currentTierData.yearlyPrice / 12).toFixed(2)
    : currentTierData.monthlyPrice.toFixed(2);
  const totalBilled = billingCycle === 'yearly' 
    ? currentTierData.yearlyPrice.toFixed(2) 
    : currentTierData.monthlyPrice.toFixed(2);

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Auto-fill Test Card for Easy Testing
  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardholderName(currentUser?.name || 'Alex Morgan');
    setPostalCode('SW1A 1AA');
    setErrorMessage(null);
  };

  // Start Payment Processing Flow
  const handleProceedToPayment = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (!currentUser) {
      // Prompt user to sign in or register first
      onOpenAuth('register');
      return;
    }
    setStep('checkout');
    setErrorMessage(null);
  };

  // Submit Stripe Payment
  const handlePayWithStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('signin');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMessage('Please enter a valid 16-digit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Please enter a valid expiration date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setErrorMessage('Please enter a valid CVC security code.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Simulate Stripe Payment Intent Creation
      setProcessingStatus('Initiating secure Stripe payment session...');
      await new Promise((resolve) => setTimeout(resolve, 650));

      // Step 2: Simulate 3D Secure / Bank Authorization
      setProcessingStatus('Authorizing payment with issuer & verifying 3D Secure...');
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: Update Firestore Subscription Status
      setProcessingStatus('Registering verified subscriber credentials to Firestore...');
      const durationMonths = billingCycle === 'yearly' ? 12 : 1;
      const subResult = await updateUserSubscription(currentUser.uid, selectedTier, durationMonths);

      const updatedUser: AppUser = {
        ...currentUser,
        subscriptionTier: subResult.subscriptionTier,
        subscriptionStatus: subResult.subscriptionStatus,
        subscriptionExpiry: subResult.subscriptionExpiry,
        subscribedAt: subResult.subscribedAt,
      };

      onSubscriptionSuccess(updatedUser);
      setStep('success');
    } catch (err) {
      console.error('Payment processing error:', err);
      setErrorMessage('Payment authorization was declined by issuer. Please check card details or use the test card button.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      id="worldscope-subscription-modal"
    >
      <div className="bg-white text-neutral-900 w-full max-w-5xl rounded-sm shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-black text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b-2 border-[#B80000]">
          <div className="flex items-center gap-3">
            {step !== 'plans' && step !== 'success' && (
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer transition-colors"
                title="Back to plans"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Logo variant="compact" theme="dark" />
            <span className="hidden sm:inline-block text-neutral-600">|</span>
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest text-[#FFD200]">
              Subscription Portal
            </span>
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

        {/* ========================================================================= */}
        {/* STEP 1: SUBSCRIPTION PLANS VIEW */}
        {/* ========================================================================= */}
        {step === 'plans' && (
          <div className="p-5 sm:p-8 overflow-y-auto flex-1">
            {/* Headline */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-[#B80000] text-xs font-bold tracking-wider uppercase mb-2 rounded-xs">
                <Crown className="w-3.5 h-3.5" />
                <span>WorldScope Editorial Subscriptions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
                Uncompromising Global Journalism & Executive Intelligence
              </h2>
              <p className="text-sm text-neutral-600">
                Choose your membership to unlock our subscriber-only Executive Newsletters, real-time macro alerts, and ad-free reporting.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center bg-neutral-100 p-1 rounded-sm border border-neutral-200 mt-5">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xs transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-black shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[#B80000] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-[#FFD200] text-black text-[10px] font-black px-1.5 py-0.2 rounded-xs">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.id;
                const isCurrent = currentUser?.subscriptionTier === tier.id && currentUser.subscriptionStatus === 'active';
                const TierIcon = tier.icon;
                const displayPrice = billingCycle === 'yearly'
                  ? (tier.yearlyPrice / 12).toFixed(2)
                  : tier.monthlyPrice.toFixed(2);

                return (
                  <div
                    key={tier.id}
                    className={`relative bg-white rounded-xs border p-6 flex flex-col justify-between transition-all duration-150 ${
                      tier.accentColor
                    } ${tier.id === 'premium' ? 'shadow-lg md:-translate-y-1' : 'shadow-xs'}`}
                  >
                    {/* Top Badge */}
                    {tier.badge && (
                      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest uppercase px-3 py-0.5 rounded-xs ${tier.badgeColor}`}>
                        {tier.badge}
                      </div>
                    )}

                    <div>
                      {/* Plan Name & Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-black text-lg text-black">{tier.name}</h3>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tier.id === 'premium' ? 'bg-[#B80000] text-white' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          <TierIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 mb-4 min-h-[32px]">
                        {tier.tagline}
                      </p>

                      {/* Pricing */}
                      <div className="mb-6 pb-6 border-b border-neutral-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-black text-black">
                            ${displayPrice}
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            / month
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 block mt-1">
                          {billingCycle === 'yearly'
                            ? `Billed annually at $${tier.yearlyPrice.toFixed(2)}/yr`
                            : `Billed monthly at $${tier.monthlyPrice.toFixed(2)}/mo`}
                        </span>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2.5 mb-6 text-xs">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Included Privileges:
                        </p>
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-neutral-700 leading-tight">{feat}</span>
                          </div>
                        ))}

                        {tier.notIncluded.length > 0 && (
                          <div className="pt-2 space-y-1.5 opacity-50">
                            {tier.notIncluded.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-neutral-400">
                                <span className="w-3.5 h-3.5 text-center text-xs leading-none">•</span>
                                <span className="line-through leading-tight">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isCurrent ? (
                        <div className="w-full py-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center rounded-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Current Active Plan</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          id={`select-plan-${tier.id}`}
                          onClick={() => handleProceedToPayment(tier.id)}
                          className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-xs cursor-pointer flex items-center justify-center gap-2 ${
                            tier.id === 'premium'
                              ? 'bg-[#B80000] hover:bg-[#990000] text-white shadow-sm'
                              : tier.id === 'enterprise'
                              ? 'bg-black hover:bg-neutral-800 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300'
                          }`}
                        >
                          <span>Subscribe to {tier.name.split(' ')[0]}</span>
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guarantee / Security Note */}
            <div className="mt-8 pt-6 border-t border-neutral-200 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>30-Day Money-Back Guarantee • Cancel anytime with one click</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-bit SSL Secure
                </span>
                <span>•</span>
                <span>Stripe Verified Partner</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PAYMENT GATEWAY CHECKOUT VIEW (SIMULATED STRIPE) */}
        {/* ========================================================================= */}
        {step === 'checkout' && (
          <div className="p-5 sm:p-8 overflow-y-auto flex-1">
            <div className="max-w-xl mx-auto">
              {/* Order Summary Card */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xs mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                      Selected Plan
                    </span>
                    <h3 className="text-base font-black text-black">
                      {currentTierData.name} ({billingCycle === 'yearly' ? 'Annual' : 'Monthly'})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('plans')}
                    className="text-xs text-[#B80000] font-bold hover:underline cursor-pointer"
                  >
                    Change Plan
                  </button>
                </div>

                <div className="pt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalBilled}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT / Digital Service Tax (0%):</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-black pt-2 border-t border-neutral-200">
                    <span>Total Due Today:</span>
                    <span className="text-[#B80000]">${totalBilled}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Stripe Payment Form */}
              <form onSubmit={handlePayWithStripe} className="space-y-4">
                {/* Header Strip with Stripe Branding */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pay with Credit / Debit Card (Stripe Gateway)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-2 py-0.5 rounded-xs border border-neutral-300 cursor-pointer transition-colors"
                  >
                    ⚡ Auto-fill Demo Card
                  </button>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-xs focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      required
                      className="w-full text-sm px-3 py-2 pr-10 border border-neutral-300 rounded-xs font-mono focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]"
                    />
                    <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Expiry, CVC & ZIP */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                      className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-xs font-mono text-center focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      required
                      className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-xs font-mono text-center focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="SW1A 1AA"
                      required
                      className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-xs uppercase text-center focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  id="submit-stripe-payment-btn"
                  disabled={isProcessing}
                  className="w-full bg-[#B80000] hover:bg-[#990000] text-white font-bold py-3 text-sm uppercase tracking-wider rounded-xs cursor-pointer shadow-md transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{processingStatus || 'Verifying Payment with Stripe...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize & Pay ${totalBilled} via Stripe</span>
                    </>
                  )}
                </button>

                {/* Safe info */}
                <p className="text-[11px] text-neutral-500 text-center pt-2">
                  🔒 Payments securely processed by Stripe. Your card credentials are encrypted with TLS 1.3 and never stored on plain text servers.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SUCCESSFUL CONFIRMATION */}
        {/* ========================================================================= */}
        {step === 'success' && (
          <div className="p-6 sm:p-10 text-center max-w-lg mx-auto my-auto animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black uppercase rounded-xs mb-3">
              <Crown className="w-3.5 h-3.5 text-[#B80000]" />
              <span>Subscription Activated: {currentTierData.name}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 tracking-tight">
              Welcome to WorldScope Premium
            </h2>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              Your payment of <strong>${totalBilled}</strong> was verified and processed successfully via Stripe. Your verified subscriber privileges have been securely written to your Cloud Firestore account profile.
            </p>

            <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xs text-left text-xs space-y-2 mb-6 font-mono">
              <div className="flex justify-between text-neutral-700">
                <span>Account:</span>
                <span className="font-bold text-black">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Tier:</span>
                <span className="font-bold text-[#B80000] uppercase">{selectedTier}</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Firestore Status:</span>
                <span className="text-emerald-600 font-bold">Active & Synced</span>
              </div>
              <div className="flex justify-between text-neutral-700">
                <span>Access Period:</span>
                <span className="font-bold text-neutral-900">
                  1 Year (until {new Date(Date.now() + 365*24*3600*1000).toLocaleDateString()})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewsletter?.();
                }}
                className="flex-1 bg-[#B80000] hover:bg-[#990000] text-white font-bold py-3 text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFD200]" />
                <span>Read Executive Newsletter</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-neutral-100 hover:bg-neutral-200 text-black font-bold py-3 px-6 text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors border border-neutral-300"
              >
                Return to News Wire
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
