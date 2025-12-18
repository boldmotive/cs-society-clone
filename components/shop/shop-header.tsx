'use client';

import Link from 'next/link';
import { useShopCart } from '@/lib/shop-cart-context';

export default function ShopHeader() {
  const { itemCount, openCart } = useShopCart();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to CS Society
            </Link>
            <Link href="/shop" className="text-xl font-bold text-gray-900">
              The Terminal Shop
            </Link>
          </div>

          {/* Navigation + Cart (grouped on right for desktop) */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links - hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/shop"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Products
              </Link>
              <Link
                href="/shop/orders"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                My Orders
              </Link>
            </nav>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              aria-label="Shopping cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
