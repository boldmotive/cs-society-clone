'use client';

import { useAuth } from '@/lib/auth-context';
import { ManageSubscription } from '@/components/ManageSubscription';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, isSubscribed } = useAuth();

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Summary Card */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Profile Summary</h2>
            <Link
              href="/account/profile"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              Edit Profile →
            </Link>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm">Email</span>
              <p className="text-white">{user?.email || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Name</span>
              <p className="text-white">{profile?.full_name || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Member Since</span>
              <p className="text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
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

        {/* Quick Links Card */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link
              href="/account/projects"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <span>💎</span>
              <span>My Projects</span>
            </Link>
            <Link
              href="/account/events"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <span>📅</span>
              <span>My Events</span>
            </Link>
            <Link
              href="/account/learning"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <span>📚</span>
              <span>Learning</span>
            </Link>
            <Link
              href="/account/store"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <span>🛒</span>
              <span>Store</span>
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

