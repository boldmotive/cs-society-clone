// SpreadConnect API Client
// Documentation: https://api.spreadconnect.app/docs/

// =============================================
// TYPES
// =============================================

export interface SpreadConnectConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  categoryId?: number;
}

export interface Article {
  id: string;
  name: string;
  description?: string;
  productTypeId: number;
  designs: Design[];
  variants: ArticleVariant[];
  images: string[];
}

export interface ArticleVariant {
  sku: string;
  appearanceId: string;
  sizeId: string;
  price: number; // in cents
  stock?: number;
}

export interface Design {
  id: string;
  url: string;
  hotspots?: Hotspot[];
}

export interface Hotspot {
  id: string;
  designId: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface OrderInput {
  reference: string; // Your internal order ID
  recipient: RecipientAddress;
  items: OrderItem[];
  shippingType?: string;
}

export interface RecipientAddress {
  salutation?: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber?: string;
  addressAddition?: string;
  city: string;
  postalCode: string;
  state?: string;
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., "US", "GB")
  email?: string;
  phone?: string;
}

export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface OrderResponse {
  orderId: string;
  reference: string;
  status: string;
  createdAt: string;
}

export interface Order {
  id: string;
  reference: string;
  status: 'new' | 'confirmed' | 'processing' | 'shipped' | 'cancelled';
  recipient: RecipientAddress;
  items: OrderItem[];
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  shippedAt: string;
}

export interface StockResponse {
  items: Record<string, number>; // SKU -> quantity
  count: number;
  limit: number;
  offset: number;
}

// =============================================
// API CLIENT
// =============================================

export class SpreadConnectAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: SpreadConnectConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.spreadconnect.app';
  }

  /**
   * Make API request with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
          console.warn(`[SpreadConnect] Rate limited. Waiting ${retryAfter}s...`);
          await this.delay(retryAfter * 1000);
          continue;
        }

        // Handle errors
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `SpreadConnect API error (${response.status}): ${errorText}`
          );
        }

        // Parse JSON response
        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;
        console.error(`[SpreadConnect] Request failed (attempt ${attempt + 1}/${maxRetries}):`, error);

        // Don't retry on client errors (4xx except 429)
        if (error instanceof Error && error.message.includes('(4')) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('SpreadConnect API request failed after retries');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============================================
  // PRODUCT METHODS
  // =============================================

  /**
   * Get all product types available in SpreadConnect catalog
   */
  async getProductTypes(): Promise<ProductType[]> {
    return this.request<ProductType[]>('/productTypes');
  }

  /**
   * Get all articles (your created products)
   */
  async getArticles(params?: { limit?: number; offset?: number }): Promise<{
    items: Article[];
    count: number;
    limit: number;
    offset: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return this.request(`/articles${query ? `?${query}` : ''}`);
  }

  /**
   * Get a single article by ID
   */
  async getArticle(id: string): Promise<Article> {
    return this.request<Article>(`/articles/${id}`);
  }

  /**
   * Get stock for all variants
   */
  async getStock(params?: { limit?: number; offset?: number }): Promise<StockResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return this.request<StockResponse>(`/stock${query ? `?${query}` : ''}`);
  }

  /**
   * Get stock for a specific variant by SKU
   */
  async getStockBySku(sku: string): Promise<number> {
    return this.request<number>(`/stock/${sku}`);
  }

  /**
   * Get stock for all variants of a product type
   */
  async getStockByProductType(productTypeId: number): Promise<{
    variants: Array<{
      appearanceId: string;
      sizeId: string;
      stock: number;
    }>;
  }> {
    return this.request(`/stock/productType/${productTypeId}`);
  }

  // =============================================
  // ORDER METHODS
  // =============================================

  /**
   * Create a new order (draft state)
   */
  async createOrder(order: OrderInput): Promise<OrderResponse> {
    return this.request<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`);
  }

  /**
   * Confirm order (required after creation to start fulfillment)
   */
  async confirmOrder(orderId: string): Promise<void> {
    await this.request(`/orders/${orderId}/confirm`, {
      method: 'POST',
    });
  }

  /**
   * Cancel an order (only possible before production starts)
   */
  async cancelOrder(orderId: string): Promise<void> {
    await this.request(`/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Get shipments for an order
   */
  async getShipments(orderId: string): Promise<Shipment[]> {
    return this.request<Shipment[]>(`/orders/${orderId}/shipments`);
  }

  /**
   * Get available shipping types
   */
  async getShippingTypes(): Promise<Array<{
    id: string;
    name: string;
    price: number;
  }>> {
    return this.request('/shippingTypes');
  }

  // =============================================
  // DESIGN METHODS
  // =============================================

  /**
   * Upload a design (image file)
   */
  async uploadDesign(imageBuffer: Buffer, filename: string): Promise<{ designId: string }> {
    const formData = new FormData();
    // Convert Buffer to Uint8Array for Blob (compatible with Next.js edge runtime)
    const uint8Array = new Uint8Array(imageBuffer);
    const blob = new Blob([uint8Array], { type: 'image/png' });
    formData.append('file', blob, filename);

    const url = `${this.baseUrl}/designs/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload design: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Upload design from URL
   */
  async uploadDesignFromUrl(url: string): Promise<{ designId: string }> {
    return this.request('/designs/upload', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }
}

// =============================================
// SINGLETON CLIENT INSTANCE
// =============================================

let spreadConnectClient: SpreadConnectAPI | null = null;

/**
 * Get or create SpreadConnect API client instance
 * Uses environment variables for configuration
 */
export function getSpreadConnectClient(): SpreadConnectAPI {
  if (!spreadConnectClient) {
    const apiKey = process.env.SPREADCONNECT_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Missing SpreadConnect API key. Set SPREADCONNECT_API_KEY environment variable.'
      );
    }

    spreadConnectClient = new SpreadConnectAPI({
      apiKey,
    });
  }

  return spreadConnectClient;
}

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Submit order to SpreadConnect and confirm it
 * This is the main function to use when processing a checkout
 */
export async function submitOrderToSpreadConnect(
  orderData: OrderInput
): Promise<{ spreadconnectOrderId: string }> {
  const client = getSpreadConnectClient();

  // Create order
  const orderResponse = await client.createOrder(orderData);
  console.log('[SpreadConnect] Order created:', orderResponse.orderId);

  // Confirm order (required step to start fulfillment)
  await client.confirmOrder(orderResponse.orderId);
  console.log('[SpreadConnect] Order confirmed:', orderResponse.orderId);

  return { spreadconnectOrderId: orderResponse.orderId };
}

/**
 * Format address for SpreadConnect API
 */
export function formatAddressForSpreadConnect(address: {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  state?: string;
  country: string;
  email?: string;
  phone?: string;
}): RecipientAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    street: address.street,
    city: address.city,
    postalCode: address.postalCode,
    state: address.state,
    countryCode: address.country.toUpperCase(),
    email: address.email,
    phone: address.phone,
  };
}
