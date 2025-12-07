'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/account/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/account/profile', icon: '👤', label: 'Profile' },
  { href: '/account/projects', icon: '💎', label: 'Projects' },
  { href: '/account/events', icon: '📅', label: 'Events' },
  { href: '/account/learning', icon: '📚', label: 'Learning' },
  { href: '/account/store', icon: '🛒', label: 'Store' },
  { href: '/account/settings', icon: '⚙️', label: 'Settings' },
];

interface AccountSidebarProps {
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export default function AccountSidebar({ mobileMenuOpen, onCloseMobileMenu }: AccountSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const isActive = (href: string) => {
    if (href === '/account/dashboard') {
      return pathname === '/account' || pathname === '/account/dashboard';
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-64px)] bg-[#0f1d32]/80 border-r border-gray-700/50">
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Divider */}
          <div className="border-t border-gray-700/50 my-4" />
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobileMenu}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-[#0f1d32] border-r border-gray-700/50 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 px-4 py-6 overflow-y-auto h-full">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Divider */}
          <div className="border-t border-gray-700/50 my-4" />
          
          {/* Logout */}
          <button
            onClick={() => { handleLogout(); onCloseMobileMenu?.(); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

