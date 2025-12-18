'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminShopPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      const response = await fetch('/api/admin/shop/sync', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Sync failed');
      }

      const result = await response.json();
      setSyncResult(result);
    } catch (err) {
      console.error('[Admin Shop] Sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync products');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop Admin</h1>
        <p className="mt-2 text-gray-600">
          Manage merchandise products and orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Sync Products Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Sync Products
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Import products from SpreadConnect
          </p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              syncing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {/* Settings Card */}
        <Link href="/admin/shop/settings" className="block">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Settings
            </h2>
            <p className="text-sm text-gray-600">
              Configure pricing markup and API credentials
            </p>
          </div>
        </Link>

        {/* Orders Card */}
        <Link href="/admin/shop/orders" className="block">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Orders
            </h2>
            <p className="text-sm text-gray-600">
              View and manage all shop orders
            </p>
          </div>
        </Link>
      </div>

      {/* Sync Results */}
      {syncResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Sync Completed Successfully
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-green-600">Products Added</p>
              <p className="text-2xl font-bold text-green-900">
                {syncResult.productsAdded}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600">Products Updated</p>
              <p className="text-2xl font-bold text-green-900">
                {syncResult.productsUpdated}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600">Variants Added</p>
              <p className="text-2xl font-bold text-green-900">
                {syncResult.variantsAdded}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-600">Total Articles</p>
              <p className="text-2xl font-bold text-green-900">
                {syncResult.totalArticles}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Links
        </h3>
        <div className="space-y-2">
          <Link
            href="/shop"
            className="block text-blue-600 hover:text-blue-700 hover:underline"
          >
            → View shop as customer
          </Link>
          <a
            href="https://login.spreadconnect.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:text-blue-700 hover:underline"
          >
            → SpreadConnect Dashboard ↗
          </a>
          <a
            href="https://api.spreadconnect.app/docs/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:text-blue-700 hover:underline"
          >
            → SpreadConnect API Docs ↗
          </a>
        </div>
      </div>
    </div>
  );
}
