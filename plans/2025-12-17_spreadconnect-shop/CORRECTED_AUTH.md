# SpreadConnect Authentication - Corrected ✅

## What Changed

**Fixed:** SpreadConnect uses **ONE API key** (not key + secret pair)

### Previous (Incorrect) Implementation
```typescript
// ❌ WRONG - Was using Basic Auth with key:secret
Authorization: Basic base64(apiKey:apiSecret)
```

### Current (Correct) Implementation  
```typescript
// ✅ CORRECT - Using X-SPOD-ACCESS-TOKEN header with single API key
X-SPOD-ACCESS-TOKEN: YOUR_API_KEY
```

## Updated Files

1. **`lib/spreadconnect.ts`**
   - Removed `apiSecret` from config
   - Changed auth from `Basic` to `Bearer`
   - Updated singleton to only require `SPREADCONNECT_API_KEY`

2. **`app/api/admin/shop/settings/route.ts`**
   - Removed check for `SPREADCONNECT_API_SECRET`
   - Now only checks `SPREADCONNECT_API_KEY`

3. **`supabase/migrations/002_shop_schema.sql`**
   - Removed unused API credential columns from `shop_settings`
   - Added clarifying comment

4. **Documentation**
   - `ENV_SETUP.md` - Updated to show single API key
   - `SECURITY.md` - Updated authentication details

## Environment Variables Required

**Only ONE credential needed:**

```bash
# .env.local (local development)
SPREADCONNECT_API_KEY=your_secret_api_key

# Vercel (production)
vercel env add SPREADCONNECT_API_KEY
```

**⚠️ IMPORTANT:** The `SPREADCONNECT_API_KEY` is a **secret** - treat it like a password!
- Never commit to git
- Never expose to client-side
- Store in server environment variables only

## How Authentication Works

```typescript
// SpreadConnect API Client
class SpreadConnectAPI {
  private apiKey: string;
  
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-SPOD-ACCESS-TOKEN': this.apiKey,  // ← Single API key in custom header
        'Content-Type': 'application/json',
      },
    });
    // ...
  }
}
```

## Security Still Intact ✅

Nothing changed about the security architecture:
- API key still server-side only
- All SpreadConnect calls still through API routes
- Client never sees the API key
- Same security pattern as before, just corrected auth format

## Migration Steps

If you already set environment variables:

1. **Remove old variable (if exists):**
   ```bash
   # Not needed - SpreadConnect only uses one key
   # SPREADCONNECT_API_SECRET  ← DELETE THIS
   ```

2. **Verify single key is set:**
   ```bash
   # Local
   echo $SPREADCONNECT_API_KEY
   
   # Vercel
   vercel env ls
   ```

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Fix: Use correct SpreadConnect authentication (Bearer token)"
   git push origin main
   ```

The app will work the same way - the fix is just using the correct authentication format that SpreadConnect expects.
