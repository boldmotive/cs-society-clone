'use client';

import { useAuth } from '@/lib/auth-context';
import { ManageSubscription } from '@/components/ManageSubscription';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, profile, isLoading, isSubscribed, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/account');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const subscriptionStatus = profile?.subscription_status || 'inactive';
  const subscriptionPlan = profile?.subscription_plan;

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    canceled: 'bg-yellow-500/20 text-yellow-400',
    past_due: 'bg-red-500/20 text-red-400',
  };

  const statusLabels = {
    active: 'Active',
    inactive: 'No Subscription',
    canceled: 'Canceled',
    past_due: 'Past Due',
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-gray-400 mt-2">Manage your profile and subscription</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Card */}
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Email</span>
                <p className="text-white">{user.email || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Name</span>
                <p className="text-white">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Member Since</span>
                <p className="text-white">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Subscription</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[subscriptionStatus as keyof typeof statusColors] || statusColors.inactive}`}>
                {statusLabels[subscriptionStatus as keyof typeof statusLabels] || 'Unknown'}
              </span>
            </div>

            {isSubscribed ? (
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Current Plan</span>
                  <p className="text-white capitalize">{subscriptionPlan || 'Standard'} Membership</p>
                </div>
                <ManageSubscription variant="button" className="mt-4" />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">
                  You don&apos;t have an active subscription. Subscribe to unlock all member benefits!
                </p>
                <Link
                  href="/#pricing"
                  className="inline-block bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                >
                  View Membership Plans
                </Link>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Session</h2>
            <button
              onClick={() => signOut()}
              className="text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

