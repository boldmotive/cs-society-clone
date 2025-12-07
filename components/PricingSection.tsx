'use client';

import { useState } from 'react';
import Link from 'next/link';

type Plan = 'monthly' | 'annual';

interface PricingCardProps {
  plan: Plan;
  price: string;
  period: string;
  subtitle: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

function PricingCard({ plan, price, period, subtitle, features, highlighted, badge }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = highlighted
    ? 'bg-gradient-to-br from-[#0f1d32] to-[#1a2a42] border-2 border-cyan-500/50'
    : 'bg-[#0f1d32]/80 border border-gray-700/50';

  return (
    <div className={`${baseStyles} rounded-2xl p-6 sm:p-8 relative overflow-hidden`}>
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
            {badge}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 capitalize">{plan}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`text-4xl sm:text-5xl font-bold ${highlighted ? 'text-cyan-400' : 'text-white'}`}>
            {price}
          </span>
          <span className="text-gray-400 text-lg">{period}</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-300 text-sm">
            <span className="text-cyan-400 mr-3">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`block w-full px-6 py-3 rounded-lg font-semibold text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          highlighted
            ? 'btn-glow bg-cyan-500 text-white'
            : 'bg-transparent text-white border border-gray-600 hover:border-cyan-500'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : highlighted ? (
          'Get Annual Access'
        ) : (
          'Get Started'
        )}
      </button>
    </div>
  );
}

export default function PricingSection() {
  const monthlyFeatures = [
    'All workshops & events',
    'Priority RSVP access',
    'Member-only networking',
    'Project showcase features',
    'Discord & mentorship',
    'Free swag at events',
  ];

  const annualFeatures = [
    'Everything in Monthly',
    'Priority RSVP access',
    'Member-only networking',
    'Project showcase features',
    'Resume database access',
    'Exclusive annual member swag',
  ];

  return (
    <section className="w-full py-12 sm:py-16 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            ✦ Simple Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Invest in Your Future
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            For less than the cost of a streaming subscription, unlock everything the CS Society has to offer.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <PricingCard
            plan="monthly"
            price="$10"
            period="/month"
            subtitle="Flexible month-to-month"
            features={monthlyFeatures}
          />
          <PricingCard
            plan="annual"
            price="$102"
            period="/year"
            subtitle="Just $8.50/mo · Save $18"
            features={annualFeatures}
            highlighted
            badge="SAVE 15%"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Not ready to commit? Attend one of our free public events first!
          </p>
          <Link href="/events" className="text-cyan-400 font-semibold inline-flex items-center gap-1 text-sm hover:underline">
            Browse upcoming events <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

