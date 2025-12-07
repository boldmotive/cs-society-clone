'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface ManageSubscriptionProps {
  className?: string;
  variant?: 'button' | 'card';
}

export function ManageSubscription({ className = '', variant = 'button' }: ManageSubscriptionProps) {
  const { user, profile, isSubscribed, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManageSubscription = async () => {
    if (!user) {
      setError('Please log in to manage your subscription');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open subscription portal');
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is not authenticated or doesn't have a subscription
  if (authLoading) {
    return null;
  }

  if (!user || !isSubscribed) {
    return null;
  }

  const subscriptionPlan = profile?.subscription_plan;
  const planLabel = subscriptionPlan === 'annual' ? 'Annual' : subscriptionPlan === 'monthly' ? 'Monthly' : 'Active';

  if (variant === 'card') {
    return (
      <div className={`bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Subscription</h3>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">
            {planLabel}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          Manage your subscription, update payment methods, view invoices, or cancel your plan.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="w-full bg-transparent text-white px-6 py-3 rounded-lg font-semibold text-center border border-gray-600 hover:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
            </span>
          ) : (
            'Manage Subscription'
          )}
        </button>
      </div>
    );
  }

  // Default button variant
  return (
    <div className={className}>
      {error && (
        <p className="text-red-400 text-sm mb-2">{error}</p>
      )}
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </>
        ) : (
          <>
            <span className="text-sm">⚙️</span>
            Manage Subscription
          </>
        )}
      </button>
    </div>
  );
}

