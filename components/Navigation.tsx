'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`w-full sticky top-0 z-50 animate-slide-down ${scrolled ? 'nav-blur' : ''}`}
      style={{
        backgroundColor: scrolled ? 'rgba(10, 22, 40, 0.95)' : '#0a1628',
        borderBottom: '1px solid #1f2937',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease'
      }}
    >
      <div style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="flex justify-between items-center" style={{ height: '4rem' }}>
          <Link href="/" className="logo-hover flex items-center gap-2">
            <div className="logo-circle w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center" style={{ transition: 'box-shadow 0.3s ease' }}>
              <span className="text-white text-sm font-bold">CS</span>
            </div>
            <span className="text-white font-semibold">CS Society</span>
            <span className="text-gray-500 text-xs">EST. 2024</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
              <span>📅</span> Events
            </Link>
            <Link href="/projects" className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
              <span>💎</span> Projects
            </Link>
            <Link href="/forum" className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
              <span>💬</span> Forum
            </Link>
            <Link href="/learning" className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
              <span>📚</span> Learning
            </Link>
            <Link href="/store" className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
              <span>🛒</span> Store
            </Link>

            {/* Admin Link - Only visible to admins */}
            {isAdmin && (
              <Link href="/admin/events" className="nav-link text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>⚙️</span> Admin
              </Link>
            )}

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="text-gray-500 text-sm">...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-700 flex items-center justify-center text-white text-sm">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error('Avatar failed to load:', profile.avatar_url);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.textContent = user?.email?.[0]?.toUpperCase() || '?';
                      }}
                    />
                  ) : (
                    user?.email?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="discord-btn bg-transparent border border-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="discord-btn bg-transparent border border-cyan-500 text-cyan-400 px-4 py-2 rounded-lg text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
