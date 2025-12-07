'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ManageSubscription } from '@/components/ManageSubscription';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, profile, isSubscribed, signOut } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const subscriptionStatus = profile?.subscription_status || 'inactive';

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Subscription Settings */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Subscription</h2>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[subscriptionStatus as keyof typeof statusColors] || statusColors.inactive}`}>
              {statusLabels[subscriptionStatus as keyof typeof statusLabels] || 'Unknown'}
            </span>
          </div>
          {isSubscribed ? (
            <div className="space-y-4">
              <p className="text-gray-400">
                Manage your subscription, update payment methods, or cancel.
              </p>
              <ManageSubscription variant="button" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-400">
                Subscribe to unlock all member benefits!
              </p>
              <Link
                href="/#pricing"
                className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">Receive updates about events and activities</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  emailNotifications ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Marketing Emails</p>
                <p className="text-gray-400 text-sm">Receive news and promotional content</p>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  marketingEmails ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    marketingEmails ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm">Email</span>
              <p className="text-white">{user?.email || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Member Since</span>
              <p className="text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0f1d32]/80 border border-red-500/30 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sign Out</p>
                <p className="text-gray-400 text-sm">Sign out of your account on this device</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-red-400 hover:text-red-300 font-medium transition-colors px-4 py-2 border border-red-500/30 rounded-lg hover:bg-red-500/10"
              >
                Sign Out
              </button>
            </div>
            <div className="border-t border-gray-700/50 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-gray-400 text-sm">Permanently delete your account and data</p>
                </div>
                <button
                  disabled
                  className="text-red-400/50 font-medium px-4 py-2 border border-red-500/20 rounded-lg cursor-not-allowed"
                >
                  Delete (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

