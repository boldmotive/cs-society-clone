# CS Society Clone - Project Rules

## Project Overview
Next.js 16 application with Supabase authentication, deployed on Vercel. Computer Science student society website clone with OAuth authentication (Google, GitHub) and SpreadConnect merchandise shop.

## Critical Architecture Decisions

### Authentication Pattern (CRITICAL!)
**ALWAYS use server-side OAuth callback handling in production**

- OAuth callbacks MUST be handled in `route.ts` (server-side), NOT in `page.tsx` (client-side)
- Reason: Vercel's serverless environment has cookie timing issues with client-side auth
- The client-side approach causes race conditions where cookies aren't ready when navigation happens
- Server-side guarantees cookies are set before redirect

**Example:**
```typescript
// ✅ CORRECT: app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(/* cookies already set */);
}

// ❌ WRONG: app/auth/callback/page.tsx (client component)
// Don't use client-side callback - causes race conditions in production
```

### Next.js 16 Specific Patterns (CRITICAL!)

**1. Dynamic Route Parameters are Async**
- In Next.js 16, dynamic route params in API routes are now Promises
- ALWAYS await params before accessing properties

```typescript
// ✅ CORRECT: Next.js 16
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ← Must await!
  // ...
}

// ❌ WRONG: Next.js 15 pattern (breaks in 16)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;  // ← Missing await
  // ...
}
```

**2. useSearchParams() Requires Suspense**
- Any client component using `useSearchParams()` must be wrapped in Suspense boundary
- This is required for static export and proper streaming

```typescript
// ✅ CORRECT: Wrapped in Suspense
function ContentComponent() {
  const searchParams = useSearchParams();
  // ...
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ContentComponent />
    </Suspense>
  );
}

// ❌ WRONG: Direct usage without Suspense
export default function Page() {
  const searchParams = useSearchParams();  // ← Causes build error
  // ...
}
```

**3. Buffer to Blob Conversion for Edge Runtime**
- Use `Uint8Array` for Buffer-to-Blob conversion (not direct Buffer or ArrayBuffer)

```typescript
// ✅ CORRECT: Edge runtime compatible
const uint8Array = new Uint8Array(buffer);
const blob = new Blob([uint8Array], { type: 'image/png' });

// ❌ WRONG: Type errors in edge runtime
const blob = new Blob([buffer], { type: 'image/png' });
```

### Next.js App Router Rules
- **NEVER** create both `route.ts` and `page.tsx` in the same directory
- They conflict because both try to handle the same URL path
- Choose one: server route for APIs/redirects, page component for UI
- For OAuth callbacks: Use `route.ts` only (no page needed)

### Middleware Session Handling
- Use `supabase.auth.getSession()` NOT `getUser()`
- `getSession()` also refreshes expired sessions
- Middleware must handle cookies properly with Supabase SSR package

## Technology Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Vercel (serverless/edge functions)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **OAuth Providers**: Google, GitHub
- **Payment Processing**: Stripe
- **Print-on-Demand**: SpreadConnect API

### Packages
- `@supabase/ssr` - Server-side rendering with proper cookie handling
- `@supabase/supabase-js` - Supabase client
- `stripe` - Stripe payment processing
- Next.js 16 with App Router

## File Structure Conventions

### Authentication Files
```
app/
├── auth/
│   └── callback/
│       └── route.ts          ← Server-side OAuth callback (MUST be route.ts only)
├── api/
│   └── auth/
│       └── debug/
│           └── route.ts      ← Debug endpoint (remove before public launch)
├── login/
│   └── page.tsx             ← Login page (client component)
└── page.tsx                 ← Home page
```

### Shop Files
```
app/
├── shop/
│   ├── layout.tsx           ← Shop layout with cart provider
│   ├── page.tsx             ← Product listing (members-only)
│   ├── [id]/
│   │   └── page.tsx         ← Product detail page
│   ├── checkout/
│   │   └── page.tsx         ← Checkout page
│   └── orders/
│       ├── page.tsx         ← Order history
│       └── success/
│           └── page.tsx     ← Order confirmation (uses Suspense!)
├── api/
│   ├── shop/
│   │   ├── products/
│   │   │   ├── route.ts     ← Product listing API
│   │   │   └── [id]/
│   │   │       └── route.ts ← Product detail API (await params!)
│   │   ├── checkout/
│   │   │   └── route.ts     ← Create Stripe session
│   │   ├── orders/
│   │   │   └── route.ts     ← Order history API
│   │   └── stock/
│   │       └── route.ts     ← Stock checking API
│   └── admin/
│       └── shop/
│           ├── sync/
│           │   └── route.ts ← Sync products from SpreadConnect
│           └── settings/
│               └── route.ts ← Shop settings management
└── admin/
    └── shop/
        └── page.tsx         ← Admin shop dashboard
```

### Important Files
- `lib/auth-context.tsx` - Client-side auth context with retry logic
- `lib/supabase.ts` - Supabase client singleton
- `lib/stripe.ts` - Stripe client and helpers
- `lib/spreadconnect.ts` - SpreadConnect API client (server-side only!)
- `lib/shop-cart-context.tsx` - Shopping cart state management
- `middleware.ts` - Server-side session validation + route protection
- `components/navigation.tsx` - Navigation with auth state
- `components/shop/*` - Shop-specific components

## Environment Configuration

### Required Environment Variables (Vercel)
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SpreadConnect (CRITICAL: Single API key only!)
SPREADCONNECT_API_KEY=your_api_key_here
SPREADCONNECT_WEBHOOK_SECRET=your_webhook_secret
```

### Supabase Configuration (Production)
**Site URL**: Must match production domain (e.g., `https://your-app.vercel.app`)

**Redirect URLs**: Must include ALL of these:
- `https://your-app.vercel.app/auth/callback`
- `https://your-app.vercel.app/*`
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/*`

**OAuth Provider Callbacks**: Point to Supabase, NOT your app
- Google/GitHub redirect URI: `https://[supabase-ref].supabase.co/auth/v1/callback`

## SpreadConnect Integration

### Authentication (CRITICAL!)
**SpreadConnect uses a SINGLE API key - not a key+secret pair!**

- Environment variable: `SPREADCONNECT_API_KEY` (treat as secret, like a password)
- Authentication method: Bearer token (`Authorization: Bearer YOUR_API_KEY`)
- **NOT** Basic Auth (no base64 encoding)
- **NEVER** expose API key to client-side

### API Client Pattern
```typescript
// ✅ CORRECT: Bearer token authentication
class SpreadConnectAPI {
  private apiKey: string;
  
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    // ...
  }
}

// ❌ WRONG: Basic auth (old implementation)
Authorization: `Basic ${base64(apiKey:apiSecret)}`
```

### Server-Side Only Pattern
- SpreadConnect API client (`lib/spreadconnect.ts`) ONLY imported in API routes
- Client components fetch from YOUR APIs (`/api/shop/*`), never SpreadConnect directly
- This ensures API key never exposed to browser
- Same security pattern as Stripe integration

**Architecture Flow:**
```
Browser (Client)
  ↓ fetch('/api/shop/products')
Next.js API Route (Server)
  ↓ getSpreadConnectClient()
SpreadConnect API (with Bearer token)
```

### Shop Access Control
- All `/shop/*` routes protected by middleware (members-only)
- Admin routes `/admin/shop/*` require admin role
- Product sync, settings management are admin-only operations
- Order submission happens automatically via Stripe webhooks

## Stripe Integration

### Dual Payment Modes
The application handles TWO types of Stripe checkouts:

1. **Membership Subscriptions** (existing)
   - Metadata: No `order_type` or `order_type: 'subscription'`
   - Creates/updates subscription in profiles table

2. **Shop Orders** (new)
   - Metadata: `order_type: 'shop'`
   - Creates order in `shop_orders` table
   - Auto-submits to SpreadConnect for fulfillment

### Webhook Handler Pattern
```typescript
// app/api/stripe/webhooks/route.ts
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Check order type
  const orderType = session.metadata?.order_type;
  
  if (orderType === 'shop') {
    await handleShopOrderCompleted(session);
    return;
  }
  
  // Default: handle subscription checkout
  // ...
}
```

### Shop Order Flow
1. Customer completes Stripe checkout (mode: 'payment', not 'subscription')
2. Webhook receives `checkout.session.completed` event
3. Handler creates order in `shop_orders` table
4. Handler submits order to SpreadConnect API
5. SpreadConnect webhooks update order status as it's fulfilled

## Database Schema

### Existing Tables
- `profiles` - User profiles with roles and subscription status
- `events` - Society events
- `projects` - Member projects

### Shop Tables (New)
- `shop_products` - Product catalog synced from SpreadConnect
- `shop_product_variants` - Size/color variants with SKUs
- `shop_orders` - Customer orders with Stripe + SpreadConnect IDs
- `shop_order_items` - Line items per order
- `shop_settings` - Global shop config (markup percentage)

**Note:** API credentials NOT stored in database - use environment variables only

### Row Level Security (RLS)
- `shop_products` - Public read for active products, admin write
- `shop_orders` - Users see own orders, admins see all
- `shop_settings` - Admin only
- Service role bypasses RLS for webhooks

## Debugging and Testing

### Debug Tools
- **Debug Endpoint**: `/api/auth/debug` - Shows session state, cookies, profile
- **Browser Console**: Look for `[AUTH]` prefixed logs
- **Vercel Logs**: Dashboard → Functions → filter by route for server logs
- **Admin Shop Dashboard**: `/admin/shop` - Sync products, view settings

### Testing Checklist

**Authentication:**
- Sign in with Google - "Sign Out" button should appear
- Sign in with GitHub - "Sign Out" button should appear
- Refresh page - user should stay signed in
- Close/reopen browser - session should persist
- Sign out - "Sign In" button should appear

**Shop (Members-Only):**
- Unauthenticated users redirected to `/login` when accessing `/shop`
- Product sync works (admin only)
- Add to cart persists across refreshes
- Checkout creates Stripe session
- Webhook processes payment and submits to SpreadConnect
- Order appears in order history

### Success Metric
**Authentication**: "Sign Out" button appears in navigation after OAuth sign-in
**Shop**: Order appears in `/shop/orders` after successful checkout

## Common Issues and Solutions

### Issue: "Sign Out" button not appearing after sign-in
**Cause**: Client-side OAuth callback (race condition)
**Solution**: Use server-side route.ts for callback

### Issue: Build error - "Conflicting route and page"
**Cause**: Both route.ts and page.tsx in same directory
**Solution**: Remove page.tsx, keep only route.ts

### Issue: Type error with dynamic route params
**Cause**: Next.js 16 changed params to async Promises
**Solution**: `const { id } = await params;` (not just `params.id`)

### Issue: useSearchParams() build error
**Cause**: Missing Suspense boundary
**Solution**: Wrap component using useSearchParams in `<Suspense>`

### Issue: Buffer to Blob conversion error
**Cause**: Edge runtime type incompatibility
**Solution**: Use `new Uint8Array(buffer)` before creating Blob

### Issue: "Invalid redirect URI" from OAuth provider
**Cause**: Supabase redirect URLs not configured
**Solution**: Add production URL to Supabase redirect URLs list

### Issue: Session not persisting across page loads
**Cause**: Middleware not refreshing session properly
**Solution**: Use `getSession()` instead of `getUser()` in middleware

### Issue: SpreadConnect API authentication fails
**Cause**: Using wrong auth format (Basic instead of Bearer)
**Solution**: Use `Authorization: Bearer ${apiKey}` (single API key only)

## Deployment Process

### Standard Deployment
1. Commit changes to git
2. Push to GitHub (main branch)
3. Vercel auto-deploys (2-3 minutes)
4. Verify deployment status in Vercel dashboard
5. Test authentication in production
6. Test shop functionality if shop changes deployed

### Post-Deployment Checklist
- [ ] Vercel deployment shows "Ready"
- [ ] Supabase redirect URLs configured
- [ ] Test sign-in with Google
- [ ] Test sign-in with GitHub
- [ ] Verify "Sign Out" button appears
- [ ] Check `/api/auth/debug` endpoint
- [ ] Test shop access (members-only)
- [ ] Verify admin panel access (admins-only)

### Before Public Launch
- [ ] Remove or protect `/api/auth/debug` endpoint
- [ ] Review and reduce verbose console logging
- [ ] Test on multiple browsers and devices
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Verify OAuth app settings in Google/GitHub consoles
- [ ] Verify SpreadConnect webhook configured
- [ ] Test end-to-end shop order flow

## Code Patterns

### Supabase Client Creation
```typescript
// Server-side (middleware, route handlers)
const supabase = createServerClient(url, key, {
  cookies: {
    getAll() { return request.cookies.getAll(); },
    setAll(cookiesToSet) { /* set on response */ }
  }
});

// Client-side (components, context)
const supabase = createSupabaseBrowserClient();
```

### Auth Context Pattern
- Initialize session with retry logic (handles delayed cookie setting)
- Listen to auth state changes
- Fetch user profile from database after authentication
- Maximum 3 retry attempts for session initialization

### SpreadConnect API Pattern
- Singleton client instance via `getSpreadConnectClient()`
- Reads `SPREADCONNECT_API_KEY` from environment
- Bearer token authentication
- Retry logic with exponential backoff
- Rate limiting awareness

### Shopping Cart Pattern
- Client-side state in localStorage
- React Context for global cart access
- Persists across page refreshes
- Cleared on successful checkout

### Error Handling
- OAuth errors redirect to `/login?error=...`
- Server errors log to console and Vercel logs
- Client errors show in browser console
- Debug endpoint provides diagnostic information
- Shop errors show user-friendly messages

## Documentation Standards

### Created Documentation
This project has extensive deployment documentation:
- `00_START_HERE.md` - Entry point for deployment
- `DEPLOYMENT_COMPLETE.md` - Detailed deployment guide
- `SUPABASE_CONFIG_CHECKLIST.md` - Configuration steps
- `AUTH_FIX_SUMMARY.md` - Technical explanation of auth fix
- `BUILD_FIX_NOTE.md` - Build error resolution
- `plans/2025-12-17_spreadconnect-shop/` - Shop integration documentation
  - `plan.md` - Full implementation plan
  - `ENV_SETUP.md` - Environment variables guide
  - `SECURITY.md` - Security architecture details
  - `CORRECTED_AUTH.md` - SpreadConnect auth correction

### When to Update Docs
- After major architecture changes
- When encountering production issues
- When adding new features
- Before public launch
- When discovering Next.js 16 specific patterns

## Security Considerations

### Authentication
- Session cookies set with proper domain and SameSite attributes
- OAuth handled entirely server-side in production
- No sensitive data in client-side code
- Debug endpoint should be removed or protected before launch

### API Keys (CRITICAL!)
- **SpreadConnect API Key**: Server environment variable only, NEVER in database or client
- **Stripe Secret Key**: Server environment variable only
- **Supabase Service Role Key**: Server environment variable only, used for webhook handlers
- All secrets accessed via `process.env` (server-side only)

### Environment Variables
- Never commit `.env.local` to git
- All secrets in environment variables
- Same values in local and Vercel production
- SpreadConnect uses single API key (not key+secret pair)

### Client-Side Security
- SpreadConnect API never called from client
- Clients fetch from YOUR APIs which then call SpreadConnect
- Shopping cart in localStorage (no sensitive data)
- Order details fetched via authenticated API routes

## Performance

### OAuth Callback Speed
- Server-side callback: < 1 second typical
- No loading page needed - redirect is fast enough
- Cookie synchronization guaranteed before page load

### Shop Performance
- Product catalog cached (5-minute TTL)
- Shopping cart client-side (no server load)
- Lazy load product images
- Stock checks batched when possible

### Optimization
- Singleton Supabase client on client-side
- Server-side session refresh in middleware
- Retry logic prevents unnecessary re-authentication
- SpreadConnect API client with connection pooling

## Repository Information
- **GitHub**: `boldmotive/cs-society-clone`
- **Default Branch**: `main`
- **Deployment**: Auto-deploy on push to main

## Known Limitations

1. **Client-side OAuth doesn't work in Vercel production** - Must use server-side
2. **Next.js route/page conflict** - Can't have both in same directory
3. **Cookie timing in serverless** - Race conditions with client-side navigation
4. **Session initialization delay** - Needs retry logic for reliability
5. **Next.js 16 async params** - Must await params in dynamic routes
6. **useSearchParams requires Suspense** - Wrap in Suspense boundary
7. **Buffer/Blob conversion** - Use Uint8Array for edge runtime compatibility

## Future Improvements

**Authentication:**
- Consider adding email/password authentication
- Implement password reset flow
- Add rate limiting for auth endpoints
- Set up comprehensive error tracking
- Add session analytics
- Implement user profile editing

**Shop:**
- Email notifications for order status updates
- Discount codes support
- Product reviews/ratings
- Wishlist functionality
- Gift cards
- Admin inventory alerts
- Advanced analytics dashboard
- Bulk order management
- Automated stock sync (cron job)
- Order cancellation flow
- Return/refund management
- Multi-currency support
- Internationalization (i18n)