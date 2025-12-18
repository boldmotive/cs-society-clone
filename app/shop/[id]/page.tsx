'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useShopCart, formatPrice } from '@/lib/shop-cart-context';

interface ProductVariant {
  id: string;
  spreadconnect_sku: string;
  size: string;
  color: string;
  appearance_id: string;
  base_price_cents: number;
  final_price_cents: number;
  stock_quantity: number;
  is_available: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  variants: ProductVariant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useShopCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data);
      
      // Auto-select first available variant
      if (data.variants.length > 0) {
        const firstAvailable = data.variants.find((v: ProductVariant) => v.is_available);
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size);
          setSelectedColor(firstAvailable.color);
        }
      }
    } catch (err) {
      console.error('[Product Detail] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const selectedVariant = product?.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const availableSizes = product
    ? [...new Set(product.variants.filter(v => v.is_available).map(v => v.size))]
    : [];

  const availableColors = product
    ? [...new Set(
        product.variants
          .filter(v => v.is_available && (!selectedSize || v.size === selectedSize))
          .map(v => v.color)
      )]
    : [];

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;

    setAdding(true);
    
    addItem({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantSku: selectedVariant.spreadconnect_sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity,
      priceCents: selectedVariant.final_price_cents,
      imageUrl: product.image_url,
    });

    setTimeout(() => setAdding(false), 500);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
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
          {error || 'Product not found'}
        </h2>
        <button
          onClick={() => router.push('/shop')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Shop
        </button>
      </div>
    );
  }

  const canAddToCart = selectedVariant && selectedVariant.is_available && quantity > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <button
          onClick={() => router.push('/shop')}
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← Back to Shop
        </button>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-24 h-24 text-gray-300"
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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {selectedVariant && (
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatPrice(selectedVariant.final_price_cents)}
              </p>
            )}
          </div>

          {product.description && (
            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>
          )}

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border border-gray-300 rounded-lg py-2 font-medium"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          {selectedVariant && (
            <div className="text-sm">
              {selectedVariant.is_available ? (
                <p className="text-green-600 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In Stock ({selectedVariant.stock_quantity} available)
                </p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || adding}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              canAddToCart
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
