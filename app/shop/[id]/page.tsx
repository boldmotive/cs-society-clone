'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useShopCart, formatPrice } from '@/lib/shop-cart-context';
import { SafeHtml, containsHtml } from '@/components/ui/safe-html';

interface ProductVariant {
  id: string;
  spreadconnect_sku: string;
  size: string;
  color: string;
  color_hex?: string;
  appearance_id: string;
  base_price_cents: number;
  final_price_cents: number;
  stock_quantity: number;
  is_available: boolean;
}

interface ProductImage {
  id: string;
  image_url: string;
  perspective?: string;
  appearance_id?: string;
  appearance_name?: string;
  sort_order?: number;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  images?: ProductImage[];
  variants: ProductVariant[];
}

/**
 * Validates if a string is a valid URL that can be used with Next.js Image component
 */
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  // Get unique colors with their hex values
  const availableColorOptions = product
    ? product.variants
        .filter(v => v.is_available && (!selectedSize || v.size === selectedSize))
        .reduce((acc, v) => {
          if (!acc.find(c => c.name === v.color)) {
            acc.push({ name: v.color, hex: v.color_hex });
          }
          return acc;
        }, [] as { name: string; hex?: string }[])
    : [];

  // Get product images, fallback to main image_url if no images array
  const productImages = product?.images?.length
    ? product.images
    : product?.image_url
      ? [{ id: 'main', image_url: product.image_url, perspective: 'front' }]
      : [];

  const currentImage = productImages[selectedImageIndex]?.image_url || product?.image_url;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-7 sm:h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-20 sm:h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-4">
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-red-600"
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
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {error || 'Product not found'}
        </h2>
        <button
          onClick={() => router.push('/shop')}
          className="mt-4 inline-flex items-center px-4 py-3 sm:py-2 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
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
      <nav className="mb-4 sm:mb-6 text-sm">
        <button
          onClick={() => router.push('/shop')}
          className="text-blue-600 hover:text-blue-700 hover:underline min-h-[44px] inline-flex items-center"
        >
          ← Back to Shop
        </button>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {isValidImageUrl(currentImage) ? (
              <Image
                src={currentImage!}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg
                  className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300"
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

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-colors snap-start ${
                    selectedImageIndex === index
                      ? 'border-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {isValidImageUrl(img.image_url) ? (
                    <Image
                      src={img.image_url}
                      alt={`${product.name} - ${img.perspective || 'view'} ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
            {selectedVariant && (
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">
                {formatPrice(selectedVariant.final_price_cents)}
              </p>
            )}
          </div>

          {product.description && (
            <div className="prose prose-sm text-gray-600 max-w-none text-sm sm:text-base">
              {containsHtml(product.description) ? (
                <SafeHtml html={product.description} />
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          )}

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] min-h-[44px] px-3 sm:px-4 py-2 border rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {availableColorOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
                Color: <span className="font-normal text-gray-600 capitalize">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {availableColorOptions.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`group relative flex items-center gap-2 min-h-[44px] px-3 py-2 border rounded-lg transition-colors ${
                      selectedColor === colorOption.name
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'
                    }`}
                    title={colorOption.name}
                  >
                    {/* Color Swatch */}
                    {colorOption.hex && (
                      <span
                        className="w-5 h-5 sm:w-5 sm:h-5 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: colorOption.hex }}
                      />
                    )}
                    <span className={`font-medium capitalize text-sm sm:text-base ${
                      selectedColor === colorOption.name
                        ? 'text-blue-600'
                        : 'text-gray-700'
                    }`}>
                      {colorOption.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 sm:mb-3">
              Quantity
            </label>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-lg font-medium"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 sm:w-20 h-11 sm:h-10 text-center border border-gray-300 rounded-lg font-medium text-base"
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-lg font-medium"
                aria-label="Increase quantity"
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
                  <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>In Stock ({selectedVariant.stock_quantity} available)</span>
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
            className={`w-full min-h-[48px] sm:min-h-[44px] py-3 sm:py-3 px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors ${
              canAddToCart
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
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
