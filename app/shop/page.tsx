'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/shop-cart-context';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  final_price_cents: number;
  is_available: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  variants: ProductVariant[];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shop/products');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Shop] API error:', response.status, errorData);
        throw new Error(errorData.error || `Failed to fetch products (${response.status})`);
      }

      const data = await response.json();
      console.log('[Shop] Fetched products:', data);
      setProducts(data.products || []);
    } catch (err) {
      console.error('[Shop] Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get price range for product
  const getPriceRange = (variants: ProductVariant[]) => {
    const prices = variants
      .filter(v => v.is_available)
      .map(v => v.final_price_cents);
    
    if (prices.length === 0) return 'Out of stock';
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    if (min === max) {
      return formatPrice(min);
    }
    
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">The Terminal Shop</h1>
          <p className="mt-2 text-gray-600">
            Loading merchandise...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
            >
              <div className="w-full h-64 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Products
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
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
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Products Available
        </h2>
        <p className="text-gray-600 mb-4">
          Products need to be synced from SpreadConnect.
        </p>
        <div className="text-sm text-gray-500">
          <p>📋 <strong>To add products:</strong></p>
          <ol className="mt-2 text-left inline-block">
            <li>1. Create products in SpreadConnect dashboard</li>
            <li>2. Go to <a href="/admin/shop" className="text-blue-600 hover:underline">/admin/shop</a> (admin only)</li>
            <li>3. Click "Sync Products" button</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          CS Society Merchandise
        </h1>
        <p className="mt-2 text-gray-600">
          Show your CS Society pride with our exclusive merchandise
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="w-16 h-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              {product.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {getPriceRange(product.variants)}
                </p>
                <span className="text-sm text-blue-600 group-hover:underline">
                  View details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
