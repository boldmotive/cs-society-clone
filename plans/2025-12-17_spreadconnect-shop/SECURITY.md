# SpreadConnect Shop - Security Architecture

## API Key Security ✅

SpreadConnect API credentials are **SECRET** and must never be exposed to the client-side.

### Our Secure Approach

**All SpreadConnect API calls are server-side only:**

1. **Credentials Storage**: Environment variables only
   - `SPREADCONNECT_API_KEY` - Single secret API key (server environment variable)
   - Never stored in database
   - Never sent to client
   - Used as Bearer token in API requests

2. **API Client Location**: `lib/spreadconnect.ts`
   - Reads from `process.env` (server-side only)
   - Only imported in API routes (server-side)
   - Never imported in client components

3. **Architecture Pattern**:
   ```
   Browser (Client)
      ↓ fetch('/api/shop/products')
   Next.js API Route (Server)
      ↓ getSpreadConnectClient()
   SpreadConnect API (with secret credentials)
   ```

### Files That Use SpreadConnect Credentials

**Server-Side Only (✅ Secure):**
- `lib/spreadconnect.ts` - API client definition
- `app/api/admin/shop/sync/route.ts` - Product sync
- `app/api/shop/stock/route.ts` - Stock checking
- `app/api/stripe/webhooks/route.ts` - Order submission

**Client-Side (✅ No SpreadConnect Access):**
- `app/shop/page.tsx` - Fetches from `/api/shop/products`
- `app/shop/[id]/page.tsx` - Fetches from `/api/shop/products/[id]`
- `app/shop/checkout/page.tsx` - Fetches from `/api/shop/checkout`
- `components/shop/*` - All use your APIs, not SpreadConnect directly

### Verification Commands

Check that SpreadConnect is only used server-side:

```bash
# Should only show API routes
grep -r "from '@/lib/spreadconnect'" app/

# Should only show server environment access
grep -r "SPREADCONNECT_API" app/ lib/
```

### What Clients CAN See

Clients can see:
- Product names, descriptions, images
- Calculated prices (base price + markup)
- Stock availability
- Their own orders

Clients CANNOT see:
- SpreadConnect API credentials
- Base costs from SpreadConnect
- Other users' orders
- SpreadConnect order IDs (only their own order tracking)

### Database Security

The `shop_settings` table does NOT store API credentials:
```sql
CREATE TABLE shop_settings (
  id UUID PRIMARY KEY,
  markup_percentage DECIMAL NOT NULL DEFAULT 0.30,
  -- API credentials intentionally NOT stored here
  updated_at TIMESTAMP,
  updated_by UUID REFERENCES profiles(id)
);
```

### Environment Variables Security

**Local Development (.env.local):**
```bash
SPREADCONNECT_API_KEY=your_secret_api_key  # Never commit to git! Treat like a password
```

**Production (Vercel):**
```bash
# Added via Vercel dashboard or CLI
vercel env add SPREADCONNECT_API_KEY
```

Both `.env.local` and Vercel environment variables are:
- Not accessible from client-side code
- Not included in browser bundles
- Only available in server-side code (`process.env`)

### Row Level Security (RLS)

Additional security layers:
- `shop_products` - Public can read active products only
- `shop_orders` - Users can only see their own orders
- `shop_settings` - Admin only access
- All SpreadConnect operations use service role (bypasses RLS when needed)

### Summary

✅ SpreadConnect API key is **NEVER** exposed to the client  
✅ All API calls happen **server-side** through Next.js API routes  
✅ API key stored in **environment variables** only (not in database)  
✅ Client components fetch from **YOUR APIs**, not SpreadConnect directly  
✅ Server-side authentication via **Bearer token** (`Authorization: Bearer YOUR_API_KEY`)  

This is the same pattern used for Stripe integration - keep secrets server-side, expose safe APIs to clients.
