'use client';

import Link from 'next/link';

export default function StorePage() {
  // TODO: Fetch user's purchases and orders from API
  const orders: Array<{
    id: string;
    orderNumber: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: Array<{ name: string; quantity: number }>;
  }> = [];

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">The Terminal Shop</h1>
          <p className="text-gray-400 mt-2">Your purchases and order history</p>
        </div>
        <Link
          href="/shop"
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          Browse Store →
        </Link>
      </div>

      {/* Orders */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Order History</h2>
        {orders.length === 0 ? (
          <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">🛒</div>
            <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-4">
              You haven&apos;t made any purchases yet. Check out our store!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Visit Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-white font-medium">Order #{order.orderNumber}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="border-t border-gray-700/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-400 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-white font-semibold">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist Preview */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Wishlist</h2>
        <div className="bg-[#0f1d32]/80 border border-gray-700/50 rounded-2xl p-6 text-center">
          <p className="text-gray-400">Wishlist feature coming soon!</p>
        </div>
      </div>
    </div>
  );
}

