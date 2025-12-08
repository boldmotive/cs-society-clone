# Production Deployment & Testing Guide

## Pre-Deployment Checklist

### 1. Verify Supabase Project Configuration

Log into your Supabase Dashboard and verify:

#### A. Get your production URL
Your Vercel app URL (e.g., `https://your-app-name.vercel.app`)

#### B. Authentication > URL Configuration
Navigate to: **Authentication → URL Configuration**

Set the following:

```
Site URL: https://your-production-domain.vercel.app
```

Add to Redirect URLs:
```
https://your-production-domain.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Critical**: Both URLs must be listed. If you have a custom domain, add those too.

#### C. Authentication > Providers

**Google OAuth:**
1. Go to Authentication → Providers → Google
2. Verify "Enabled" is ON
3. Verify Client ID and Secret are set
4. In Google Cloud Console (https://console.cloud.google.com):
   - Go to "APIs & Services" → "Credentials"
   - Find your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", add:
     ```
     https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
     ```

**GitHub OAuth:**
1. Go to Authentication → Providers → GitHub
2. Verify "Enabled" is ON
3. Verify Client ID and Secret are set
4. In GitHub (Settings → Developer settings → OAuth Apps):
   - Find your OAuth App
   - Under "Authorization callback URL", set:
     ```
     https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
     ```

---

### 2. Verify Vercel Environment Variables

In your Vercel project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: 
- Use the EXACT same values from your `.env.local`
- Make sure they're set for "Production" environment
- After changing, you must redeploy

---

### 3. Deploy to Vercel

#### Option A: Git Push (Recommended)
```bash
git add .
git commit -m "Fix: Implement server-side OAuth callback for production"
git push origin main
```

Vercel will automatically deploy from your Git repository.

#### Option B: Vercel CLI
```bash
vercel --prod
```

---

## Testing Procedures

### Test 1: Debug Endpoint (Pre-Auth Check)

Before testing sign-in, verify the debug endpoint works:

```bash
# Replace with your production URL
curl https://your-app.vercel.app/api/auth/debug
```

Expected response (before sign-in):
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "supabaseConfigured": true,
  "session": {
    "exists": false,
    "user": null,
    "expiresAt": null,
    "error": null
  },
  "user": {
    "exists": false,
    "id": null,
    "email": null,
    "error": null
  },
  "profile": {
    "exists": false,
    "data": null,
    "error": null
  },
  "cookies": {
    "count": 0,
    "supabaseAuth": []
  }
}
```

If this fails, check:
- Environment variables in Vercel
- Supabase project is accessible
- No network/firewall issues

---

### Test 2: Sign-In Flow (Google)

1. **Open Production Site**
   - Navigate to: `https://your-app.vercel.app`
   - Open Browser DevTools (F12)
   - Go to Console tab

2. **Click "Sign In"**
   - Click the "Sign In" button in navigation
   - Click "Continue with Google"

3. **Watch Console Logs**
   - You should see: `[AUTH CALLBACK] Processing OAuth callback`
   - Followed by: `[AUTH CALLBACK] Session established for user: your-email@gmail.com`
   - Then: `[AUTH CALLBACK] User verified: your-email@gmail.com`
   - Finally: `[AUTH CALLBACK] Redirecting to: /`

4. **Verify Sign-In Success**
   - You should be redirected to home page
   - Navigation should show your profile picture/initial
   - "Sign Out" button should be visible
   - **No "Sign In" button should be visible**

5. **Check Debug Endpoint (Authenticated)**
   ```bash
   curl https://your-app.vercel.app/api/auth/debug \
     -H "Cookie: $(curl -s -c - https://your-app.vercel.app | grep supabase)"
   ```
   
   Or simply visit in browser: `https://your-app.vercel.app/api/auth/debug`

   Expected (when signed in):
   ```json
   {
     "session": {
       "exists": true,
       "user": {
         "id": "...",
         "email": "your-email@gmail.com",
         "createdAt": "..."
       },
       "expiresAt": "..."
     },
     "user": {
       "exists": true,
       "id": "...",
       "email": "your-email@gmail.com"
     },
     "profile": {
       "exists": true,
       "data": {
         "id": "...",
         "email": "your-email@gmail.com",
         "full_name": "Your Name",
         "role": "user"
       }
     },
     "cookies": {
       "count": 3,
       "supabaseAuth": [...]
     }
   }
   ```

---

### Test 3: Session Persistence

1. **Refresh Page**
   - Press F5 or Cmd+R
   - User should stay signed in
   - No flash of "Sign In" button

2. **Close & Reopen Browser**
   - Close all browser windows
   - Open new browser window
   - Navigate to site
   - User should still be signed in

3. **Open in New Tab**
   - Open site in new tab
   - Should already be signed in

---

### Test 4: Sign-Out Flow

1. **Click "Sign Out"**
   - Click your profile in navigation
   - Click "Sign Out" button

2. **Watch Console**
   - Should see sign-out related logs
   - No errors

3. **Verify Sign-Out**
   - Profile/picture should disappear
   - "Sign In" button should appear
   - Navigation should show logged-out state

4. **Verify Session Cleared**
   - Visit debug endpoint: `https://your-app.vercel.app/api/auth/debug`
   - Should show `session.exists: false`

---

### Test 5: Sign-In Flow (GitHub)

Repeat Test 2, but click "Continue with GitHub" instead of Google.

---

### Test 6: Mobile Testing

1. **Open on Mobile Device**
   - Use actual mobile device (not just responsive mode)
   - Test full sign-in/sign-out flow
   - Verify UI is responsive

2. **Test Mobile Menu**
   - Open mobile menu (hamburger icon)
   - Verify sign-in button visible when logged out
   - Verify profile and sign-out visible when logged in

---

## Troubleshooting

### Issue: "Sign Out" button not appearing after sign-in

**Diagnosis:**
1. Check browser console for errors
2. Visit `/api/auth/debug` - does it show a session?
3. Check Network tab - are there failed requests?

**Possible Causes:**
- Session cookie not being set correctly
- Auth context not refreshing
- Cookie domain mismatch

**Solutions:**
1. Clear browser cookies and try again
2. Verify Supabase redirect URLs are correct
3. Check server logs in Vercel dashboard

---

### Issue: Redirect loop or stuck on callback page

**Diagnosis:**
1. Check URL - are you stuck at `/auth/callback?code=...`?
2. Check console for errors
3. Check Network tab for failed requests

**Possible Causes:**
- Server-side callback route not working
- Environment variables missing in Vercel
- Supabase project configuration wrong

**Solutions:**
1. Verify environment variables in Vercel
2. Check Vercel function logs for the callback route
3. Verify Supabase redirect URLs

---

### Issue: OAuth error messages

Common errors and solutions:

**"OAuth error: access_denied"**
- User cancelled the OAuth flow
- Normal behavior, try signing in again

**"No authorization code received"**
- OAuth provider didn't return a code
- Check provider configuration (Google/GitHub)

**"Authentication failed: ..."**
- Supabase rejected the code exchange
- Check Supabase logs
- Verify provider settings

---

### Issue: Works locally but not in production

**Diagnosis:**
1. Compare environment variables (local vs Vercel)
2. Check Supabase redirect URLs (must include production URL)
3. Check browser console in production
4. Check Vercel function logs

**Solutions:**
1. Ensure production URL is in Supabase redirect URLs
2. Ensure Site URL in Supabase matches production URL
3. Clear cookies and try again
4. Check for CORS issues in Network tab

---

## Vercel Function Logs

To view server-side logs:

1. Go to Vercel Dashboard
2. Select your project
3. Click on the latest deployment
4. Click "Functions" tab
5. Click on `auth/callback` function
6. View logs to see server-side debug output

Look for:
- `[AUTH CALLBACK] Processing OAuth callback`
- `[AUTH CALLBACK] Session established`
- Any error messages

---

## Security Notes

### Before Going to Production:

1. **Remove or Protect Debug Endpoint**
   ```bash
   # Either delete the file:
   rm app/api/auth/debug/route.ts
   
   # Or add authentication check to it
   ```

2. **Review Console Logs**
   - Remove or reduce verbose logging
   - Don't log sensitive information

3. **Review CORS Settings**
   - Ensure Supabase CORS is properly configured
   - Test from different domains if using custom domain

4. **Test Error Scenarios**
   - What happens if user denies OAuth?
   - What happens if network fails?
   - What happens if session expires?

---

## Rollback Plan

If the changes don't work:

### Quick Rollback in Vercel:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." menu → "Promote to Production"

### Rollback via Git:
```bash
git revert HEAD
git push origin main
```

---

## Success Criteria

✅ All tests pass without errors
✅ Sign-in flow completes successfully
✅ "Sign Out" button appears after sign-in
✅ Sign-out flow works correctly
✅ Session persists across page refreshes
✅ Works on mobile devices
✅ No console errors
✅ Debug endpoint shows correct session state

---

## Next Steps After Successful Deployment

1. **Remove debug endpoint** (or add authentication)
2. **Monitor for a few days** to ensure no issues
3. **Set up error tracking** (Sentry, LogRocket, etc.)
4. **Test with real users** from your team
5. **Document any remaining issues** for future reference

---

## Support

If you continue to have issues after following this guide:

1. **Check Vercel Logs**: Look for server-side errors
2. **Check Supabase Logs**: Look for auth errors
3. **Check Browser Console**: Look for client-side errors
4. **Share Debug Info**: Run `/api/auth/debug` and share output
5. **Check Network Tab**: Look for failed requests

Common log locations:
- Vercel: Dashboard → Functions → View Logs
- Supabase: Dashboard → Logs → API Logs
- Browser: DevTools → Console/Network tabs
