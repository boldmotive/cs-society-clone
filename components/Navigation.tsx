'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on a link
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/events', icon: '📅', label: 'Events' },
    { href: '/projects', icon: '💎', label: 'Projects' },
    { href: '/forum', icon: '💬', label: 'Forum' },
    { href: '/learning', icon: '📚', label: 'Learning' },
    { href: '/store', icon: '🛒', label: 'Store' },
  ];

  return (
    <nav
      className={`w-full sticky top-0 z-50 animate-slide-down ${scrolled ? 'nav-blur' : ''}`}
      style={{
        backgroundColor: scrolled ? 'rgba(10, 22, 40, 0.95)' : '#0a1628',
        borderBottom: '1px solid #1f2937',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease'
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="logo-hover flex items-center gap-2" onClick={closeMobileMenu}>
            <Image
              src="/images/computer-science-society-logo.png"
              alt="Computer Science Society Logo"
              width={48}
              height={48}
            />
            <span className="text-white font-semibold">Computer Science Society</span>
            <span className="text-gray-500 text-xs hidden sm:inline">EST. 2024</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link text-gray-400 hover:text-white flex items-center gap-1">
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}

            {/* Admin Link - Only visible to admins */}
            {isAdmin && (
              <Link href="/admin/events" className="nav-link text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <span>⚙️</span> Admin
              </Link>
            )}

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="text-gray-500 text-sm">.{" "}.{" "}.</div>
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
                <Link
                  href="/account/dashboard"
                  className="discord-btn bg-transparent border border-cyan-500 text-cyan-400 px-4 py-2 rounded-lg text-sm"
                >
                  Dashboard
                </Link>
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

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-800/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 my-1 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ top: '64px' }}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed left-0 right-0 z-50 bg-[#0a1628] border-b border-gray-700 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        style={{ top: '64px', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-base"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          {/* Admin Link - Only visible to admins */}
          {isAdmin && (
            <Link
              href="/admin/events"
              className="flex items-center gap-3 px-4 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-gray-800/50 rounded-lg transition-colors text-base"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">⚙️</span>
              <span>Admin</span>
            </Link>
          )}

          {/* Divider */}
          <div className="border-t border-gray-700 my-3" />

          {/* Auth Section */}
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-sm">Loading...</div>
          ) : user ? (
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-500 overflow-hidden bg-gray-700 flex items-center justify-center text-white">
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
                <Link
                  href="/account/dashboard"
                  className="flex-1 text-center discord-btn bg-transparent border border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg text-base font-medium"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3">
              <Link
                href="/login"
                className="block w-full text-center discord-btn bg-transparent border border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg text-base font-medium"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
