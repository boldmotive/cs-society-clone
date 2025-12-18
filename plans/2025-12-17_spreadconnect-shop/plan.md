# SpreadConnect Merchandise Shop Integration

## Spec Provenance

**Created:** 2025-12-17  
**Requested by:** CS Society team, specified by Emily Portalatin-Mendez  
**Context:** Integrate SpreadConnect print-on-demand API to enable members-only merchandise shop with pre-designed CS Society branded products, full checkout, order tracking, and admin management.

**Key Requirements Gathered:**
- Full shop experience: browse, buy, order tracking, order history
- Real-time pricing from SpreadConnect API with markup
- Pre-designed products only (admins create in SpreadConnect, members select size/color)
- Members-only access (leverage existing Supabase OAuth)
- Stripe payment processing → auto-submit orders to SpreadConnect

---

## Spec Header

**Name:** SpreadConnect Merchandise Shop

**Smallest Acceptable Scope:**
A members-only merchandise shop where authenticated CS Society members can:
1. Browse pre-designed society branded products (t-shirts, hoodies, accessories)
2. View real-time pricing (SpreadConnect base cost + configurable markup)
3. Add items to cart and checkout via Stripe
4. Automatically submit orders to SpreadConnect after payment confirmation
5. Track order status and view order history
6. Admin panel to sync products from SpreadConnect and set pricing markup

**Non-Goals (Defer to Future):**
- Custom design tool for members (members cannot upload designs or customize beyond size/color)
- Inventory management (SpreadConnect handles stock)
- Discount codes or promotional campaigns
- Product reviews or ratings
- Wishlists or favorites
- Email notifications for order status (SpreadConnect handles customer emails)
- Multi-currency support (USD only for MVP)
- Bulk ordering or group discounts
- Gift cards or store credit

---

## Paths to Supplementary Guidelines

**Tech Stack Reference:**
- None directly applicable (existing Next.js 16 + Supabase + Stripe stack already established)
- Follows existing project architecture pattern from `project_rules`

**Design Reference:**
- Use existing CS Society website design system (maintain consistency with current site)

**API Documentation:**
- SpreadConnect API Docs: https://api.spreadconnect.app/docs/
- OpenAPI Spec: `openapi.json` (provided by user)

---

## Decision Snapshot

### Architecture Choices

**1. Members-Only Access**
- **Decision:** Use existing Supabase authentication + middleware to gate shop routes
- **Why:** Already have robust OAuth (Google, GitHub) with proper server-side session handling
- **Implementation:** Extend `middleware.ts` to protect `/shop/*` routes, redirect unauthenticated users to `/login`

**2. Payment Processing Flow**
- **Decision:** Stripe Checkout → Webhook → SpreadConnect Order Submission
- **Why:** 
  - Existing Stripe integration for membership subscriptions
  - Ensures payment confirmation before order fulfillment
  - Keeps payment handling server-side (secure)
- **Flow:**
  1. User completes Stripe checkout for shop items
  2. Stripe webhook confirms payment
  3. Server creates order in Supabase `shop_orders` table
  4. Server submits order to SpreadConnect API
  5. SpreadConnect webhooks update order status in our DB

**3. Product Pricing Strategy**
- **Decision:** Real-time pricing from SpreadConnect + configurable markup percentage
- **Why:** 
  - Avoids manual price updates when SpreadConnect costs change
  - Flexible markup per product category or global setting
  - Pricing fetched server-side to prevent client manipulation
- **Implementation:** 
  - Cache SpreadConnect product prices (5-minute TTL)
  - Store markup percentage in Supabase `shop_settings` table
  - Calculate final price: `spreadconnect_base_price * (1 + markup_percentage)`

**4. Product Management**
- **Decision:** Admins sync products from SpreadConnect (not create designs via our app)
- **Why:** 
  - SpreadConnect dashboard is better suited for design creation
  - Reduces complexity (no design upload/positioning logic)
  - Admins create "articles" in SpreadConnect, then sync to our DB
- **Implementation:**
  - Admin panel with "Sync Products" button
  - Fetches articles from SpreadConnect API
  - Stores in `shop_products` with metadata (title, description, images, variants)

**5. Order Tracking**
- **Decision:** Webhooks + polling hybrid approach
- **Why:** 
  - SpreadConnect webhooks for real-time status updates (order.processed, shipment.sent)
  - Fallback polling for missed webhooks (daily cron job)
  - Customers see tracking info pulled from SpreadConnect API
- **Implementation:**
  - Webhook endpoint `/api/spreadconnect/webhooks` to receive events
  - Store order status in `shop_orders.status` field
  - Fetch shipment tracking from SpreadConnect `/shipments` endpoint

### Technology Decisions

**Database Schema (Supabase PostgreSQL):**
- `shop_products` - Product catalog synced from SpreadConnect
- `shop_product_variants` - Size/color variants with SKUs
- `shop_orders` - Customer orders with Stripe payment refs
- `shop_order_items` - Line items per order
- `shop_settings` - Global config (markup, SpreadConnect credentials)

**API Client Pattern:**
- Server-side only (no client-side SpreadConnect calls)
- Singleton client in `lib/spreadconnect.ts`
- Rate limiting awareness (SpreadConnect API limits)
- Error handling with retries for transient failures

**State Management:**
- Shopping cart: Client-side localStorage (no server persistence until checkout)
- Order history: Server-fetched from Supabase
- Product catalog: Server-side rendering with caching

---

## Architecture at a Glance

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CS Society Website (Next.js 16)              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Shop Frontend (Member-Gated)                            │   │
│  │  - Browse products (/shop)                               │   │
│  │  - Product details (/shop/[id])                          │   │
│  │  - Shopping cart (client-side localStorage)              │   │
│  │  - Checkout (/shop/checkout → Stripe)                    │   │
│  │  - Order history (/shop/orders)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Admin Panel (Admin-Only)                                │   │
│  │  - Sync products from SpreadConnect (/admin/shop)        │   │
│  │  - Set markup percentage                                 │   │
│  │  - View all orders                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes (Server-Side)                                │   │
│  │  - /api/shop/products (fetch catalog)                    │   │
│  │  - /api/shop/checkout (create Stripe session)            │   │
│  │  - /api/shop/orders (user order history)                 │   │
│  │  - /api/spreadconnect/sync (admin product sync)          │   │
│  │  - /api/spreadconnect/webhooks (order status updates)    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼──────────┐
        │  Supabase      │     │  Stripe          │
        │  - Auth        │     │  - Checkout      │
        │  - Database    │     │  - Webhooks      │
        │    • profiles  │     └──────────────────┘
        │    • shop_*    │
        └────────────────┘
                │
                │
        ┌───────▼──────────────────────┐
        │  SpreadConnect API           │
        │  - Product catalog           │
        │  - Order submission          │
        │  - Order status              │
        │  - Webhooks (order events)   │
        └──────────────────────────────┘
```

### Authentication Flow

```
1. User visits /shop → Middleware checks session
2. If no session → Redirect to /login
3. After OAuth → User redirected to /shop
4. All shop routes protected by middleware
```

### Purchase Flow

```
1. Member browses products → Fetches from /api/shop/products
2. Adds to cart → Stored in localStorage
3. Proceeds to checkout → POST /api/shop/checkout
4. Server creates Stripe session with:
   - Line items (products + prices from SpreadConnect)
   - User metadata (user_id, email)
   - Success URL: /shop/orders/[order_id]
5. User completes Stripe payment
6. Stripe webhook → /api/stripe/webhooks
7. Webhook handler:
   a. Verify payment success
   b. Create order in shop_orders table
   c. Submit order to SpreadConnect API
   d. Store SpreadConnect order ID
8. User sees order confirmation at /shop/orders/[order_id]
9. SpreadConnect webhooks update order status as it's fulfilled
```

### Database Schema

**shop_products**
```sql
id                 UUID PRIMARY KEY
spreadconnect_id   TEXT UNIQUE NOT NULL  -- Article ID from SpreadConnect
name               TEXT NOT NULL
description        TEXT
category           TEXT
image_url          TEXT
is_active          BOOLEAN DEFAULT true
created_at         TIMESTAMPTZ
updated_at         TIMESTAMPTZ
```

**shop_product_variants**
```sql
id                 UUID PRIMARY KEY
product_id         UUID REFERENCES shop_products(id)
spreadconnect_sku  TEXT UNIQUE NOT NULL
size               TEXT NOT NULL
color              TEXT NOT NULL
appearance_id      TEXT NOT NULL  -- SpreadConnect appearance ID
base_price_cents   INTEGER NOT NULL  -- From SpreadConnect
stock_quantity     INTEGER DEFAULT 0
is_available       BOOLEAN DEFAULT true
created_at         TIMESTAMPTZ
updated_at         TIMESTAMPTZ
```

**shop_orders**
```sql
id                        UUID PRIMARY KEY
user_id                   UUID REFERENCES profiles(id)
stripe_session_id         TEXT UNIQUE
stripe_payment_intent_id  TEXT
spreadconnect_order_id    TEXT UNIQUE
status                    TEXT NOT NULL  -- 'pending', 'paid', 'submitted', 'processing', 'shipped', 'delivered', 'cancelled'
total_cents               INTEGER NOT NULL
currency                  TEXT DEFAULT 'USD'
shipping_address          JSONB NOT NULL
tracking_number           TEXT
tracking_url              TEXT
created_at                TIMESTAMPTZ
updated_at                TIMESTAMPTZ
```

**shop_order_items**
```sql
id                 UUID PRIMARY KEY
order_id           UUID REFERENCES shop_orders(id)
product_id         UUID REFERENCES shop_products(id)
variant_id         UUID REFERENCES shop_product_variants(id)
quantity           INTEGER NOT NULL
price_cents        INTEGER NOT NULL  -- Price at time of purchase
spreadconnect_sku  TEXT NOT NULL
product_snapshot   JSONB  -- Snapshot of product details at purchase time
created_at         TIMESTAMPTZ
```

**shop_settings**
```sql
id                        UUID PRIMARY KEY DEFAULT gen_random_uuid()
markup_percentage         DECIMAL NOT NULL DEFAULT 0.30  -- 30% markup
spreadconnect_api_key     TEXT  -- Encrypted
spreadconnect_api_secret  TEXT  -- Encrypted
webhook_secret            TEXT  -- For verifying SpreadConnect webhooks
updated_at                TIMESTAMPTZ
updated_by                UUID REFERENCES profiles(id)
```

---

## Implementation Plan

### Phase 1: Database & SpreadConnect API Client

**1.1 Database Schema Setup**
- Create migration file: `supabase/migrations/002_shop_schema.sql`
- Define all tables with RLS policies:
  - `shop_products` - Public read, admin write
  - `shop_product_variants` - Public read, admin write
  - `shop_orders` - Users see own orders, admin sees all
  - `shop_order_items` - Users see items from own orders
  - `shop_settings` - Admin only
- Run migration locally: `supabase migration up`
- Test with sample data

**1.2 SpreadConnect API Client**
- Create `lib/spreadconnect.ts`:
  ```typescript
  import { createSpreadConnectClient } from './spreadconnect-client';
  
  export interface SpreadConnectConfig {
    apiKey: string;
    apiSecret: string;
    baseUrl?: string;
  }
  
  export class SpreadConnectAPI {
    private client: any;
    
    constructor(config: SpreadConnectConfig);
    
    // Product methods
    async getProductTypes(): Promise<ProductType[]>;
    async getArticles(): Promise<Article[]>;
    async getArticle(id: string): Promise<Article>;
    async getStock(sku: string): Promise<number>;
    
    // Order methods
    async createOrder(order: OrderInput): Promise<OrderResponse>;
    async getOrder(orderId: string): Promise<Order>;
    async confirmOrder(orderId: string): Promise<void>;
    async getShipments(orderId: string): Promise<Shipment[]>;
    
    // Design methods
    async uploadDesign(file: Buffer): Promise<{ designId: string }>;
  }
  ```
- Implement API client with:
  - Authentication headers (Authorization: Bearer token)
  - Rate limiting (respect API limits)
  - Error handling (retry transient failures)
  - TypeScript types from OpenAPI spec

**1.3 Environment Variables**
- Add to `.env.local` and Vercel:
  ```
  SPREADCONNECT_API_KEY=your_api_key
  SPREADCONNECT_API_SECRET=your_api_secret
  SPREADCONNECT_WEBHOOK_SECRET=your_webhook_secret
  ```

**1.4 Admin Settings API**
- Create `/api/admin/shop/settings/route.ts`:
  - GET: Fetch current settings (markup, credentials status)
  - PUT: Update settings (admin only)
  - Encrypt sensitive data before storing in DB

### Phase 2: Product Catalog & Sync

**2.1 Product Sync API**
- Create `/api/admin/shop/sync/route.ts`:
  ```typescript
  POST /api/admin/shop/sync
  - Check admin role
  - Fetch articles from SpreadConnect API
  - For each article:
    - Upsert into shop_products
    - Fetch variants (sizes, colors, appearances)
    - Upsert into shop_product_variants with base pricing
    - Fetch stock quantities
  - Return sync summary (products added/updated)
  ```

**2.2 Product Listing API**
- Create `/api/shop/products/route.ts`:
  ```typescript
  GET /api/shop/products?category=...
  - Fetch products from Supabase (with variants)
  - Calculate final prices (base_price * (1 + markup))
  - Include stock availability
  - Return paginated results
  ```

**2.3 Product Detail API**
- Create `/api/shop/products/[id]/route.ts`:
  ```typescript
  GET /api/shop/products/[id]
  - Fetch single product with all variants
  - Calculate prices
  - Include product images from SpreadConnect
  - Return detailed product info
  ```

**2.4 Stock Check API**
- Create `/api/shop/stock/route.ts`:
  ```typescript
  POST /api/shop/stock
  Body: { skus: ['sku1', 'sku2'] }
  - Fetch real-time stock from SpreadConnect
  - Update local cache
  - Return availability per SKU
  ```

### Phase 3: Shop Frontend

**3.1 Middleware Protection**
- Update `middleware.ts`:
  ```typescript
  // Add shop routes to protected paths
  if (pathname.startsWith('/shop')) {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  ```

**3.2 Shop Layout**
- Create `app/shop/layout.tsx`:
  - Shop navigation (Categories, Cart, Orders)
  - Shopping cart icon with item count
  - Breadcrumbs
  - Consistent with existing site design

**3.3 Product Listing Page**
- Create `app/shop/page.tsx`:
  - Fetch products from `/api/shop/products`
  - Grid layout with product cards
  - Filter by category
  - Search functionality
  - "Add to Cart" buttons

**3.4 Product Detail Page**
- Create `app/shop/[id]/page.tsx`:
  - Fetch product details from `/api/shop/products/[id]`
  - Image carousel (SpreadConnect product images)
  - Size/color variant selector
  - Quantity input
  - Stock availability indicator
  - "Add to Cart" button
  - Product description

**3.5 Shopping Cart Component**
- Create `components/shop/shopping-cart.tsx`:
  - Client-side state (localStorage)
  - Display cart items with thumbnails
  - Update quantities
  - Remove items
  - Calculate subtotal
  - "Proceed to Checkout" button

**3.6 Shopping Cart Context**
- Create `lib/shop-cart-context.tsx`:
  ```typescript
  interface CartItem {
    productId: string;
    variantId: string;
    quantity: number;
    priceCents: number;
    // ... product details
  }
  
  export const ShopCartProvider: React.FC;
  export const useShopCart = () => {
    addItem(item: CartItem): void;
    removeItem(variantId: string): void;
    updateQuantity(variantId: string, quantity: number): void;
    clearCart(): void;
    items: CartItem[];
    totalCents: number;
    itemCount: number;
  };
  ```

### Phase 4: Checkout & Payment

**4.1 Checkout Page**
- Create `app/shop/checkout/page.tsx`:
  - Display cart summary
  - Shipping address form (required for SpreadConnect)
  - Terms acceptance checkbox
  - "Place Order" button → creates Stripe session

**4.2 Checkout API**
- Create `/api/shop/checkout/route.ts`:
  ```typescript
  POST /api/shop/checkout
  Body: {
    items: CartItem[],
    shippingAddress: Address
  }
  
  Steps:
  1. Verify user authentication
  2. Validate cart items (prices, stock)
  3. Fetch real-time SpreadConnect pricing
  4. Calculate total with markup
  5. Create Stripe checkout session:
     - Line items with product names/prices
     - Metadata: { user_id, items JSON, shipping_address }
     - Success URL: /shop/orders/success?session_id={CHECKOUT_SESSION_ID}
     - Cancel URL: /shop/checkout?canceled=true
  6. Return session ID and URL
  ```

**4.3 Stripe Webhook Handler (Extend Existing)**
- Update `app/api/stripe/webhooks/route.ts`:
  - Add handler for `checkout.session.completed` (shop orders)
  - Distinguish shop orders from membership subscriptions (check metadata)
  - For shop orders:
    ```typescript
    1. Extract metadata (user_id, items, shipping_address)
    2. Create order in shop_orders (status: 'paid')
    3. Create order items in shop_order_items
    4. Submit order to SpreadConnect API
    5. Store SpreadConnect order ID
    6. Confirm SpreadConnect order
    7. Update order status to 'submitted'
    8. Clear user's cart (optional: store session to trigger client-side clear)
    ```

**4.4 Order Submission to SpreadConnect**
- Create `lib/spreadconnect-order.ts`:
  ```typescript
  export async function submitOrderToSpreadConnect(
    order: ShopOrder,
    items: ShopOrderItem[]
  ): Promise<{ spreadconnectOrderId: string }> {
    // Map our order format to SpreadConnect order format
    const spreadconnectOrder = {
      reference: order.id,
      recipient: {
        firstName: ...,
        lastName: ...,
        street: ...,
        // ... from order.shipping_address
      },
      items: items.map(item => ({
        sku: item.spreadconnect_sku,
        quantity: item.quantity,
      })),
    };
    
    // POST to /orders
    const response = await spreadconnectClient.createOrder(spreadconnectOrder);
    
    // Confirm order (required step)
    await spreadconnectClient.confirmOrder(response.orderId);
    
    return { spreadconnectOrderId: response.orderId };
  }
  ```

**4.5 Order Success Page**
- Create `app/shop/orders/success/page.tsx`:
  - Fetch order details using session_id
  - Display order confirmation
  - Show order number and expected fulfillment time
  - Link to order tracking

### Phase 5: Order Tracking & History

**5.1 Order History API**
- Create `/api/shop/orders/route.ts`:
  ```typescript
  GET /api/shop/orders
  - Fetch user's orders from shop_orders
  - Include order items
  - Sort by created_at DESC
  - Return paginated results
  ```

**5.2 Order Detail API**
- Create `/api/shop/orders/[id]/route.ts`:
  ```typescript
  GET /api/shop/orders/[id]
  - Verify user owns order (or is admin)
  - Fetch order with items
  - If order has spreadconnect_order_id:
    - Fetch latest status from SpreadConnect API
    - Fetch shipments if available
  - Return full order details with tracking info
  ```

**5.3 Order History Page**
- Create `app/shop/orders/page.tsx`:
  - Fetch orders from `/api/shop/orders`
  - Display table/list of orders:
    - Order number
    - Date
    - Total
    - Status badge
    - "View Details" link

**5.4 Order Detail Page**
- Create `app/shop/orders/[id]/page.tsx`:
  - Fetch order from `/api/shop/orders/[id]`
  - Display:
    - Order number, date, status
    - Items ordered (with thumbnails)
    - Shipping address
    - Tracking info (if shipped)
    - Total paid
  - Status timeline (pending → paid → submitted → processing → shipped → delivered)

**5.5 SpreadConnect Webhook Handler**
- Create `/api/spreadconnect/webhooks/route.ts`:
  ```typescript
  POST /api/spreadconnect/webhooks
  
  Supported events:
  - order.processed: Update status to 'processing'
  - shipment.sent: Update status to 'shipped', store tracking info
  - order.cancelled: Update status to 'cancelled'
  
  Steps:
  1. Verify webhook signature (SPREADCONNECT_WEBHOOK_SECRET)
  2. Parse event type and payload
  3. Find order by spreadconnect_order_id
  4. Update order status
  5. Store tracking info if shipment.sent
  6. Return 200 OK
  ```

**5.6 Webhook Setup in SpreadConnect**
- Document webhook configuration:
  - URL: `https://your-site.vercel.app/api/spreadconnect/webhooks`
  - Events to subscribe: order.processed, shipment.sent, order.cancelled
  - Secret: Store in SPREADCONNECT_WEBHOOK_SECRET

### Phase 6: Admin Panel

**6.1 Admin Shop Dashboard**
- Create `app/admin/shop/page.tsx`:
  - Protected by admin role check
  - Display:
    - Product sync status (last sync time)
    - Total products synced
    - Recent orders overview
    - Quick actions: Sync Products, Settings

**6.2 Product Sync Interface**
- Create `app/admin/shop/products/page.tsx`:
  - "Sync Products from SpreadConnect" button
  - Display sync progress
  - Show sync results (products added/updated)
  - List all products with:
    - Name, category
    - Variant count
    - Active/inactive toggle
    - Edit button (for metadata only, not designs)

**6.3 Settings Interface**
- Create `app/admin/shop/settings/page.tsx`:
  - Form to update markup percentage
  - Test connection button (verify SpreadConnect credentials)
  - Webhook status (last received event)
  - SpreadConnect account info display

**6.4 Order Management Interface**
- Create `app/admin/shop/orders/page.tsx`:
  - View all orders (not just own)
  - Filter by status, date range
  - Search by order number or customer email
  - Bulk actions: Export to CSV
  - Link to detailed order view

**6.5 Admin Middleware Protection**
- Update `middleware.ts` to check admin role:
  ```typescript
  if (pathname.startsWith('/admin')) {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.data.session.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  ```

### Phase 7: Polish & Testing

**7.1 Error Handling**
- Add error boundaries to shop pages
- Display user-friendly error messages:
  - Product out of stock
  - Payment failed
  - Order submission failed
  - Network errors
- Log errors for debugging

**7.2 Loading States**
- Add loading skeletons for:
  - Product listings
  - Product details
  - Cart updates
  - Order history
- Disable buttons during async operations

**7.3 Responsive Design**
- Test shop on mobile devices
- Ensure cart is usable on small screens
- Touch-friendly UI elements

**7.4 Performance Optimization**
- Implement caching for SpreadConnect API calls:
  - Product catalog: 5-minute cache
  - Pricing: 5-minute cache
  - Stock: 1-minute cache
- Use Next.js Image component for product images
- Lazy load product images

**7.5 Testing Checklist**
- [ ] Product sync works correctly
- [ ] Cart persists across page refreshes
- [ ] Checkout flow completes successfully
- [ ] Stripe webhook creates order and submits to SpreadConnect
- [ ] Order appears in user's history
- [ ] SpreadConnect webhooks update order status
- [ ] Tracking info displays correctly
- [ ] Admin can view all orders
- [ ] Non-members cannot access shop
- [ ] Non-admins cannot access admin panel

---

## Verification & Demo Script

### Pre-Demo Setup

**1. Database Setup**
```bash
# Run migration
supabase migration up

# Create admin user
# In Supabase SQL editor:
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
```

**2. Environment Variables**
```bash
# Verify all variables are set in Vercel
- SPREADCONNECT_API_KEY
- SPREADCONNECT_API_SECRET
- SPREADCONNECT_WEBHOOK_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
```

**3. SpreadConnect Configuration**
- Create test products in SpreadConnect dashboard
- Configure webhook endpoint in SpreadConnect settings
- Note down article IDs for testing

**4. Stripe Configuration**
- Create test product prices if needed
- Verify webhook endpoint configured
- Enable test mode

### Demo Flow

**Part 1: Admin Setup (2 minutes)**

1. **Navigate to Admin Panel**
   - Go to `/admin/shop`
   - Verify admin access (non-admins should be redirected)

2. **Configure Settings**
   - Go to `/admin/shop/settings`
   - Set markup percentage to 30%
   - Save settings

3. **Sync Products**
   - Go to `/admin/shop/products`
   - Click "Sync Products from SpreadConnect"
   - Wait for sync to complete
   - Verify products appear in list
   - Expected result: 3-5 CS Society products (t-shirts, hoodies)

**Part 2: Member Shopping Experience (3 minutes)**

4. **Browse Shop**
   - Log in as regular member
   - Navigate to `/shop`
   - Verify products display with images and prices
   - Expected result: Product grid with "Add to Cart" buttons

5. **View Product Details**
   - Click on a product
   - Verify size/color options display
   - Check stock availability indicator
   - Expected result: Detailed product page with variant selector

6. **Add to Cart**
   - Select size (e.g., Medium)
   - Select color (e.g., Black)
   - Set quantity to 2
   - Click "Add to Cart"
   - Expected result: Cart icon updates with item count

7. **View Cart**
   - Click cart icon
   - Verify items display correctly
   - Update quantity
   - Expected result: Cart drawer/page shows items with subtotal

8. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Click "Place Order"
   - Expected result: Redirected to Stripe checkout

9. **Complete Payment**
   - Use Stripe test card: 4242 4242 4242 4242
   - Complete payment
   - Expected result: Redirected to order success page

10. **Order Confirmation**
    - Verify order details display
    - Note order number
    - Expected result: Order confirmation with CS Society branding

**Part 3: Order Tracking (2 minutes)**

11. **View Order History**
    - Navigate to `/shop/orders`
    - Verify order appears in list
    - Expected result: Order with status "Submitted to SpreadConnect"

12. **Order Details**
    - Click on order
    - Verify all details display:
      - Items ordered
      - Shipping address
      - Total paid
      - Current status
    - Expected result: Complete order information

13. **Simulate Webhook (Testing)**
    - Use SpreadConnect API or dashboard to simulate order processing
    - Refresh order details page
    - Expected result: Status updates to "Processing"

**Part 4: Admin Order Management (1 minute)**

14. **View All Orders**
    - Log in as admin
    - Navigate to `/admin/shop/orders`
    - Verify all member orders appear
    - Expected result: Admin sees all orders across all users

15. **Order Detail (Admin View)**
    - Click on member's order
    - Verify admin sees full details including:
      - Customer email
      - SpreadConnect order ID
      - Payment intent ID
    - Expected result: Enhanced order details for admin

### Success Criteria

**Must-Have Working:**
- ✅ Members can browse products synced from SpreadConnect
- ✅ Real-time pricing displays correctly (base price + markup)
- ✅ Cart functionality works (add, update, remove items)
- ✅ Stripe checkout completes successfully
- ✅ Order automatically submits to SpreadConnect after payment
- ✅ Order appears in member's order history
- ✅ Admin can sync products from SpreadConnect
- ✅ Admin can view all orders
- ✅ Non-members cannot access shop (redirected to login)

**Nice-to-Have (Can defer):**
- Webhook status updates (may take time to test fully)
- Stock quantity display (depends on SpreadConnect API response time)
- Order tracking links (depends on SpreadConnect fulfillment)

---

## Deploy

### Deployment Checklist

**1. Environment Variables**
```bash
# Add to Vercel project settings
vercel env add SPREADCONNECT_API_KEY
vercel env add SPREADCONNECT_API_SECRET
vercel env add SPREADCONNECT_WEBHOOK_SECRET

# Verify existing variables
- NEXT_PUBLIC_SUPABASE_URL ✓
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
- STRIPE_SECRET_KEY ✓
- STRIPE_WEBHOOK_SECRET ✓
```

**2. Database Migration**
```bash
# Run migration on production Supabase
supabase db push

# Or via Supabase dashboard:
# - Go to SQL Editor
# - Copy contents of supabase/migrations/002_shop_schema.sql
# - Execute query
```

**3. SpreadConnect Configuration**
- Log into SpreadConnect dashboard
- Navigate to Webhooks section
- Add webhook endpoint:
  - URL: `https://your-cs-society-site.vercel.app/api/spreadconnect/webhooks`
  - Events: `order.processed`, `shipment.sent`, `order.cancelled`
  - Copy webhook secret to SPREADCONNECT_WEBHOOK_SECRET env var

**4. Stripe Configuration**
- Verify webhook endpoint includes shop order events:
  - `checkout.session.completed`
- Test in Stripe dashboard with test mode

**5. Initial Admin Setup**
- Deploy to production
- Update admin user in production database:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'admin@yourdomain.com';
  ```

**6. First Product Sync**
- Log in as admin
- Navigate to `/admin/shop/settings`
- Verify SpreadConnect connection
- Go to `/admin/shop/products`
- Run "Sync Products"
- Verify products appear

**7. Test Purchase**
- Create test order with Stripe test card
- Verify order submits to SpreadConnect
- Check SpreadConnect dashboard for order
- Verify order appears in admin panel

### Deployment Commands

```bash
# Standard deployment (Vercel auto-deploys on push to main)
git add .
git commit -m "Add SpreadConnect shop integration"
git push origin main

# Monitor deployment
vercel --logs

# Verify deployment
curl https://your-cs-society-site.vercel.app/api/shop/products
```

### Post-Deployment Verification

**1. Health Checks**
- [ ] Shop page loads: `https://your-site.vercel.app/shop`
- [ ] Admin panel accessible: `https://your-site.vercel.app/admin/shop`
- [ ] API endpoints respond: `/api/shop/products`
- [ ] Webhooks endpoint ready: `/api/spreadconnect/webhooks`

**2. Functionality Tests**
- [ ] Product sync works
- [ ] Member can browse products
- [ ] Add to cart works
- [ ] Checkout redirects to Stripe
- [ ] Test order completes end-to-end
- [ ] Order appears in history
- [ ] Admin can view all orders

**3. Security Checks**
- [ ] Non-members redirected from `/shop`
- [ ] Non-admins cannot access `/admin/shop`
- [ ] SpreadConnect API keys not exposed client-side
- [ ] Webhook signature verification working

**4. Monitoring Setup**
- Enable Vercel function logs for:
  - `/api/shop/*`
  - `/api/spreadconnect/*`
  - `/api/stripe/webhooks`
- Set up alerts for:
  - Webhook failures
  - Order submission errors
  - SpreadConnect API errors

### Rollback Plan

If critical issues arise:

```bash
# Revert to previous deployment
vercel rollback

# Or disable shop routes temporarily
# Add to middleware.ts:
if (pathname.startsWith('/shop')) {
  return NextResponse.redirect(new URL('/maintenance', request.url));
}
```

### Future Enhancements

**Phase 2 Features (Post-MVP):**
- Email notifications for order status updates
- Discount codes support
- Product reviews/ratings
- Wishlist functionality
- Gift cards
- Admin inventory alerts
- Advanced analytics dashboard
- Bulk order management

**Integration Improvements:**
- Automated stock sync (cron job)
- Order cancellation flow
- Return/refund management
- Multi-currency support
- Internationalization (i18n)

---

## Notes

**SpreadConnect API Considerations:**
- Rate limits: Monitor API usage, implement exponential backoff
- Authentication: Token may expire, implement refresh logic
- Webhook retries: SpreadConnect retries failed webhooks (handle idempotency)
- Order confirmation: Required step after creating order (don't forget!)

**Stripe Integration:**
- Shop orders separate from membership subscriptions (distinguish by metadata)
- Use same webhook endpoint, different handlers
- Test mode vs. live mode (ensure correct API keys per environment)

**Database Design:**
- `product_snapshot` in order items preserves historical data (in case product deleted)
- `base_price_cents` stored per variant (SpreadConnect prices may change)
- `spreadconnect_sku` is source of truth for order submission

**Security:**
- SpreadConnect credentials encrypted at rest
- Webhook signature verification prevents spoofing
- Admin role checked server-side (not client-side)
- Price calculations server-side only (prevent manipulation)

**Performance:**
- Product catalog cached (reduces SpreadConnect API calls)
- Cart in localStorage (no server load until checkout)
- Lazy load product images (faster initial page load)

**Maintenance:**
- Regular product sync to update stock/prices
- Monitor webhook health (set up alerts)
- Review SpreadConnect API for breaking changes
- Update product catalog manually if sync fails