# Supabase Configuration Checklist for Production

## Before Deploying to Vercel

### Step 1: Get Your Production URL
- [ ] Deploy to Vercel once to get your production URL
- [ ] URL format: `https://your-app-name.vercel.app`
- [ ] Or if using custom domain: `https://yourdomain.com`

---

## Step 2: Configure Supabase Dashboard

### Authentication → URL Configuration

1. **Site URL**
   - [ ] Set to: `https://your-production-url.vercel.app`
   - [ ] This is where users will be redirected after email confirmation
   - [ ] Must match your production domain EXACTLY

2. **Redirect URLs** (Add all of these)
   - [ ] `https://your-production-url.vercel.app/auth/callback`
   - [ ] `https://your-production-url.vercel.app/*` (wildcard for flexibility)
   - [ ] `http://localhost:3000/auth/callback` (for local development)
   - [ ] `http://localhost:3000/*` (for local development)
   - [ ] If using custom domain, add those too

**Screenshot location**: Authentication → URL Configuration → Redirect URLs

---

### Authentication → Providers → Google

- [ ] **Enabled**: Toggle to ON
- [ ] **Client ID**: Your Google OAuth Client ID
- [ ] **Client Secret**: Your Google OAuth Client Secret

#### Verify Google Cloud Console Settings:
1. Go to: https://console.cloud.google.com
2. Navigate to: APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", you should see:
   - [ ] `https://[YOUR_SUPABASE_REF].supabase.co/auth/v1/callback`
   
   Example: `https://jysrijwjnhesgllwybdd.supabase.co/auth/v1/callback`

**Important**: The redirect URI must point to Supabase, NOT your app!

---

### Authentication → Providers → GitHub

- [ ] **Enabled**: Toggle to ON
- [ ] **Client ID**: Your GitHub OAuth App Client ID
- [ ] **Client Secret**: Your GitHub OAuth App Secret

#### Verify GitHub OAuth App Settings:
1. Go to: https://github.com/settings/developers
2. Click on "OAuth Apps"
3. Find your OAuth App
4. Under "Authorization callback URL", you should see:
   - [ ] `https://[YOUR_SUPABASE_REF].supabase.co/auth/v1/callback`
   
   Example: `https://jysrijwjnhesgllwybdd.supabase.co/auth/v1/callback`

**Important**: The callback URL must point to Supabase, NOT your app!

---

### Authentication → Settings

Review these settings (usually defaults are fine):

- [ ] **JWT expiry**: Default 3600 seconds (1 hour) is fine
- [ ] **Disable email confirmations**: OFF (unless you want to require email verification)
- [ ] **Enable email signups**: Can be OFF if you only want OAuth
- [ ] **Enable phone signups**: Can be OFF if not using phone auth

---

## Step 3: Verify Environment Variables in Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

### Required Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - [ ] Value: `https://your-project-ref.supabase.co`
   - [ ] Environment: Production, Preview, Development (all checked)
   - [ ] Example: `https://jysrijwjnhesgllwybdd.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - [ ] Value: Your anon/public key (starts with `eyJ...`)
   - [ ] Environment: Production, Preview, Development (all checked)
   - [ ] Found in: Supabase Dashboard → Settings → API → anon/public key

### Where to find these values in Supabase:
1. Go to: Supabase Dashboard
2. Click on your project
3. Click "Settings" (gear icon)
4. Click "API"
5. Copy "Project URL" and "anon public" key

---

## Step 4: Test Configuration

### Quick Test Script

After deploying, run this in your browser console on your production site:

```javascript
// Test 1: Check environment variables are loaded
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Test 2: Check auth debug endpoint
fetch('/api/auth/debug')
  .then(r => r.json())
  .then(data => console.log('Auth Debug:', data));
```

Expected output:
```
Supabase URL: https://your-project.supabase.co
Has Anon Key: true
Auth Debug: { supabaseConfigured: true, ... }
```

---

## Common Configuration Mistakes

### ❌ Mistake 1: Wrong Redirect URL
```
WRONG: https://your-app.vercel.app
RIGHT: https://your-app.vercel.app/auth/callback
```

### ❌ Mistake 2: Missing Wildcard
```
Should add both:
- https://your-app.vercel.app/auth/callback
- https://your-app.vercel.app/*
```

### ❌ Mistake 3: OAuth Provider Callback URL
```
WRONG: https://your-app.vercel.app/auth/callback
RIGHT: https://your-supabase-ref.supabase.co/auth/v1/callback
```
The OAuth providers (Google, GitHub) should redirect to Supabase, not your app!

### ❌ Mistake 4: Site URL vs Redirect URL
```
Site URL: https://your-app.vercel.app (no path)
Redirect URLs: https://your-app.vercel.app/auth/callback (with path)
```

### ❌ Mistake 5: Environment Variables Not Applied
After changing environment variables in Vercel, you MUST:
- [ ] Redeploy the application
- [ ] Or trigger a new deployment from Git

---

## Verification Checklist

### Before Testing:
- [ ] Supabase Site URL is set to production domain
- [ ] Supabase Redirect URLs include production callback URL
- [ ] Google OAuth redirect URI points to Supabase
- [ ] GitHub OAuth callback URL points to Supabase
- [ ] Vercel environment variables are set correctly
- [ ] Vercel has been redeployed after env var changes

### During Testing:
- [ ] Can navigate to site
- [ ] "Sign In" button is visible when logged out
- [ ] Clicking OAuth button redirects to provider
- [ ] Can complete OAuth flow with Google
- [ ] Can complete OAuth flow with GitHub
- [ ] Redirected back to app after OAuth
- [ ] "Sign Out" button appears after sign-in
- [ ] No console errors during sign-in
- [ ] Can sign out successfully

### After Testing:
- [ ] Session persists across page refreshes
- [ ] Session persists across browser restarts
- [ ] Debug endpoint shows correct session state
- [ ] No errors in Vercel function logs
- [ ] No errors in Supabase logs

---

## Getting Your Configuration Values

### Supabase Project Reference ID:
Look at your Supabase URL: `https://[PROJECT_REF].supabase.co`
Example: If URL is `https://jysrijwjnhesgllwybdd.supabase.co`
Then Project Ref is: `jysrijwjnhesgllwybdd`

### Vercel Production URL:
1. Go to Vercel Dashboard
2. Click on your project
3. Look at "Domains" section
4. Your production URL is listed there
5. Format: `https://[your-app-name].vercel.app`

### Google OAuth Credentials:
1. https://console.cloud.google.com
2. APIs & Services → Credentials
3. OAuth 2.0 Client IDs section
4. Click on your client ID
5. Copy Client ID and Client Secret

### GitHub OAuth Credentials:
1. https://github.com/settings/developers
2. OAuth Apps
3. Click on your app
4. Copy Client ID
5. Generate new client secret if needed

---

## Configuration Templates

### For Copy-Paste:

**Supabase Redirect URLs** (replace with your domain):
```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/*
http://localhost:3000/auth/callback
http://localhost:3000/*
```

**Google OAuth Redirect URI** (replace with your Supabase ref):
```
https://your-supabase-ref.supabase.co/auth/v1/callback
```

**GitHub OAuth Callback URL** (replace with your Supabase ref):
```
https://your-supabase-ref.supabase.co/auth/v1/callback
```

---

## Still Having Issues?

If you've checked everything and it still doesn't work:

1. **Clear browser cookies and cache**
   - Ctrl+Shift+Delete (Windows)
   - Cmd+Shift+Delete (Mac)
   - Clear everything

2. **Try incognito/private window**
   - This tests without cached data

3. **Check Vercel Function Logs**
   - Vercel Dashboard → Your Project
   - Click latest deployment
   - Functions tab
   - Look for `/auth/callback` route logs

4. **Check Supabase Logs**
   - Supabase Dashboard → Logs
   - Filter for API logs
   - Look for auth-related errors

5. **Use Debug Endpoint**
   - Visit: `https://your-app.vercel.app/api/auth/debug`
   - Check if session exists
   - Check cookie information

6. **Compare with working local environment**
   - Does it work locally?
   - What's different in production?
   - Check environment variables
   - Check URLs configuration

---

## Need Help?

Create an issue with:
1. Output from `/api/auth/debug` (before and after sign-in)
2. Screenshots of Supabase configuration
3. Console errors from browser
4. Vercel function logs
5. Steps to reproduce the issue
