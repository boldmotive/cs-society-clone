'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement profile update API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-2">Manage your personal information</p>
      </div>

      <div className="grid gap-6">
        {/* Avatar Section */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Avatar</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-700 flex items-center justify-center text-white text-2xl">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              ) : (
                user?.email?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">
                Your avatar is synced from your login provider.
              </p>
              <button
                disabled
                className="text-cyan-400/50 text-sm font-medium cursor-not-allowed"
              >
                Change Avatar (Coming Soon)
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <p className="text-white bg-gray-800/50 px-4 py-3 rounded-lg">{user?.email || 'Not set'}</p>
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-white bg-gray-800/50 px-4 py-3 rounded-lg">
                  {profile?.full_name || 'Not set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Tell us about yourself"
                />
              ) : (
                <p className="text-white bg-gray-800/50 px-4 py-3 rounded-lg min-h-[100px]">
                  {profile?.bio || 'No bio yet'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || '');
                    setBio(profile?.bio || '');
                  }}
                  className="text-gray-400 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-gray-400 text-sm">Events</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-gray-400 text-sm">Courses</p>
            </div>
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <p className="text-2xl font-bold text-cyan-400">0</p>
              <p className="text-gray-400 text-sm">Purchases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

