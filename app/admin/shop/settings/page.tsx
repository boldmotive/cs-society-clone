'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShopSettings {
  id: string;
  markup_percentage: number;
  updated_at: string;
  updated_by: string | null;
  hasApiKey: boolean;
}

export default function AdminShopSettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [markupPercentage, setMarkupPercentage] = useState<number>(30);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/shop/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
      setMarkupPercentage(Math.round(data.markup_percentage * 100));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/admin/shop/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markup_percentage: markupPercentage / 100,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      const data = await response.json();
      setSettings({ ...settings!, ...data });
      setSuccess('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Calculate example prices
  const exampleBasePrice = 19.98;
  const exampleFinalPrice = exampleBasePrice * (1 + markupPercentage / 100);
  const exampleProfit = exampleFinalPrice - exampleBasePrice;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/shop"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop Admin
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Shop Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure pricing and other shop options
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pricing Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="markup" className="block text-sm font-medium text-gray-700 mb-1">
                Markup Percentage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="markup"
                  min="0"
                  max="100"
                  value={markupPercentage}
                  onChange={(e) => setMarkupPercentage(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-medium"
                  />
                  <span className="text-gray-600 font-medium">%</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This percentage is added on top of the SpreadConnect base price to calculate the final customer price.
              </p>
            </div>

            {/* Price Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price Preview</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Base Price</p>
                  <p className="text-lg font-semibold text-gray-900">${exampleBasePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">+ {markupPercentage}% Markup</p>
                  <p className="text-lg font-semibold text-green-600">+${exampleProfit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer Price</p>
                  <p className="text-lg font-semibold text-blue-600">${exampleFinalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Quick presets:</span>
              {[0, 10, 20, 30, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMarkupPercentage(preset)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    markupPercentage === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${settings?.hasApiKey ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700">
              SpreadConnect API Key: {settings?.hasApiKey ? (
                <span className="text-green-600 font-medium">Configured</span>
              ) : (
                <span className="text-red-600 font-medium">Not Set</span>
              )}
            </span>
          </div>
          
          {!settings?.hasApiKey && (
            <p className="mt-2 text-sm text-gray-500">
              Set the <code className="bg-gray-100 px-1 py-0.5 rounded">SPREADCONNECT_API_KEY</code> environment variable in your Vercel dashboard.
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              saving
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Last Updated Info */}
      {settings?.updated_at && (
        <p className="mt-6 text-sm text-gray-500 text-center">
          Last updated: {new Date(settings.updated_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}

