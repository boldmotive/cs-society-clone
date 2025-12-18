'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear cart on success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cs-society-shop-cart');
    }
    
    // Show success message
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order has been received and will be fulfilled by SpreadConnect.
      </p>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="text-gray-900 font-medium">Order Processing</p>
              <p className="text-sm text-gray-600">
                Your order is being sent to SpreadConnect for production
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="text-gray-900 font-medium">Production</p>
              <p className="text-sm text-gray-600">
                SpreadConnect will produce your items (typically within 48 hours)
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              3
            </div>
            <div>
              <p className="text-gray-900 font-medium">Shipping</p>
              <p className="text-sm text-gray-600">
                Your order will be shipped directly to your address
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              4
            </div>
            <div>
              <p className="text-gray-900 font-medium">Delivery</p>
              <p className="text-sm text-gray-600">
                You'll receive tracking information once your order ships
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop/orders"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Order History
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Questions about your order?{' '}
          <a href="mailto:shop@cssociety.com" className="text-blue-600 hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
