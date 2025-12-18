import { ShopCartProvider } from '@/lib/shop-cart-context';
import ShopHeader from '@/components/shop/shop-header';
import ShoppingCart from '@/components/shop/shopping-cart';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopCartProvider>
      <div className="min-h-screen bg-gray-50">
        <ShopHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <ShoppingCart />
      </div>
    </ShopCartProvider>
  );
}
