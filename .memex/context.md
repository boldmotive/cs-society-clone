# CS Society Clone - Project Rules

## Project Overview
Next.js 16 application with Supabase authentication, deployed on Vercel. Computer Science student society website clone with OAuth authentication (Google, GitHub).

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

### Packages
- `@supabase/ssr` - Server-side rendering with proper cookie handling
- `@supabase/supabase-js` - Supabase client
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

### Important Files
- `lib/auth-context.tsx` - Client-side auth context with retry logic
- `lib/supabase.ts` - Supabase client singleton
- `middleware.ts` - Server-side session validation
- `components/navigation.tsx` - Navigation with auth state

## Environment Configuration

### Required Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
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

## Debugging and Testing

### Debug Tools
- **Debug Endpoint**: `/api/auth/debug` - Shows session state, cookies, profile
- **Browser Console**: Look for `[AUTH]` prefixed logs
- **Vercel Logs**: Dashboard → Functions → auth/callback for server logs

### Testing Checklist
1. Sign in with Google - "Sign Out" button should appear
2. Sign in with GitHub - "Sign Out" button should appear
3. Refresh page - user should stay signed in
4. Close/reopen browser - session should persist
5. Sign out - "Sign In" button should appear

### Success Metric
**"Sign Out" button appears in navigation after OAuth sign-in**
If this doesn't happen, authentication is broken.

## Common Issues and Solutions

### Issue: "Sign Out" button not appearing after sign-in
**Cause**: Client-side OAuth callback (race condition)
**Solution**: Use server-side route.ts for callback

### Issue: Build error - "Conflicting route and page"
**Cause**: Both route.ts and page.tsx in same directory
**Solution**: Remove page.tsx, keep only route.ts

### Issue: "Invalid redirect URI" from OAuth provider
**Cause**: Supabase redirect URLs not configured
**Solution**: Add production URL to Supabase redirect URLs list

### Issue: Session not persisting across page loads
**Cause**: Middleware not refreshing session properly
**Solution**: Use `getSession()` instead of `getUser()` in middleware

## Deployment Process

### Standard Deployment
1. Commit changes to git
2. Push to GitHub (main branch)
3. Vercel auto-deploys (2-3 minutes)
4. Verify deployment status in Vercel dashboard
5. Test authentication in production

### Post-Deployment Checklist
- [ ] Vercel deployment shows "Ready"
- [ ] Supabase redirect URLs configured
- [ ] Test sign-in with Google
- [ ] Test sign-in with GitHub
- [ ] Verify "Sign Out" button appears
- [ ] Check `/api/auth/debug` endpoint

### Before Public Launch
- [ ] Remove or protect `/api/auth/debug` endpoint
- [ ] Review and reduce verbose console logging
- [ ] Test on multiple browsers and devices
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Verify OAuth app settings in Google/GitHub consoles

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

### Error Handling
- OAuth errors redirect to `/login?error=...`
- Server errors log to console and Vercel logs
- Client errors show in browser console
- Debug endpoint provides diagnostic information

## Documentation Standards

### Created Documentation
This project has extensive deployment documentation:
- `00_START_HERE.md` - Entry point for deployment
- `DEPLOYMENT_COMPLETE.md` - Detailed deployment guide
- `SUPABASE_CONFIG_CHECKLIST.md` - Configuration steps
- `AUTH_FIX_SUMMARY.md` - Technical explanation of auth fix
- `BUILD_FIX_NOTE.md` - Build error resolution

### When to Update Docs
- After major architecture changes
- When encountering production issues
- When adding new features
- Before public launch

## Security Considerations

### Authentication
- Session cookies set with proper domain and SameSite attributes
- OAuth handled entirely server-side in production
- No sensitive data in client-side code
- Debug endpoint should be removed or protected before launch

### Environment Variables
- Never commit `.env.local` to git
- All secrets in environment variables
- Same values in local and Vercel production

## Performance

### OAuth Callback Speed
- Server-side callback: < 1 second typical
- No loading page needed - redirect is fast enough
- Cookie synchronization guaranteed before page load

### Optimization
- Singleton Supabase client on client-side
- Server-side session refresh in middleware
- Retry logic prevents unnecessary re-authentication

## Repository Information
- **GitHub**: `boldmotive/cs-society-clone`
- **Default Branch**: `main`
- **Deployment**: Auto-deploy on push to main

## Known Limitations

1. **Client-side OAuth doesn't work in Vercel production** - Must use server-side
2. **Next.js route/page conflict** - Can't have both in same directory
3. **Cookie timing in serverless** - Race conditions with client-side navigation
4. **Session initialization delay** - Needs retry logic for reliability

## Future Improvements

- Consider adding email/password authentication
- Implement password reset flow
- Add rate limiting for auth endpoints
- Set up comprehensive error tracking
- Add session analytics
- Implement user profile editing