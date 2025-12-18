# Environment Variables Setup for SpreadConnect Shop

## Required Environment Variables

Add these to your `.env.local` file and Vercel environment variables:

```bash
# SpreadConnect API Credentials (TREAT AS SECRET - server-side only!)
SPREADCONNECT_API_KEY=your_spreadconnect_api_key

# Existing variables (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## How to Get SpreadConnect Credentials

1. **Register at SpreadConnect**
   - Go to: https://login.spreadconnect.app/register
   - Create your account

2. **Get API Key**
   - After registration, navigate to API settings
   - Generate/copy your API key (treat it as a secret!)
   - This is your only credential - it acts like a password

3. **Set Up Webhooks** (Optional but recommended)
   - In SpreadConnect dashboard, go to Webhooks section
   - Create a webhook pointing to: `https://your-site.vercel.app/api/spreadconnect/webhooks`
   - Subscribe to events: `order.processed`, `shipment.sent`, `order.cancelled`
   - Note: SpreadConnect does not provide webhook signature verification

## Add to Vercel

```bash
# Add the variable
vercel env add SPREADCONNECT_API_KEY
```

## Test Connection

After setting up, you can test the connection by:
1. Deploying the application
2. Logging in as admin
3. Going to `/admin/shop`
4. Clicking "Sync Products"

If successful, it will import your SpreadConnect product catalog.
