import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[MIDDLEWARE] Missing Supabase credentials');
    return supabaseResponse;
  }

  // Determine if we're in production (HTTPS)
  const isProduction = request.nextUrl.protocol === 'https:';

  // Production-ready cookie options
  const cookieOptions = {
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
  };

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...cookieOptions,
            ...options,
            // Ensure secure is true in production
            secure: isProduction ? true : (options?.secure ?? false),
          })
        );
      },
    },
  });

  // Refresh session if it exists - this ensures expired sessions are refreshed
  // Using getSession() instead of getUser() allows session refresh with new tokens
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // Only log unexpected auth errors, not "AuthSessionMissingError" which is expected for anonymous visitors
  if (sessionError && sessionError.name !== 'AuthSessionMissingError') {
    console.error('[MIDDLEWARE] Session error:', sessionError);
  }

  // Log auth state for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[MIDDLEWARE]', request.nextUrl.pathname, 'User:', session?.user?.email || 'anonymous');
  }

  // Get the authenticated user from the session
  const user = session?.user || null;

  // Helper to fetch user profile (role and subscription status)
  const getUserProfile = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, subscription_status')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('[MIDDLEWARE] Error fetching profile:', profileError);
      return null;
    }
    return profile;
  };

  // Protect admin routes - require admin role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      console.log('[MIDDLEWARE] Admin route access denied - no user');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const profile = await getUserProfile(user.id);

    if (!profile || profile.role !== 'admin') {
      console.log('[MIDDLEWARE] Admin route access denied - not admin');
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Admin has access - continue
    console.log('[MIDDLEWARE] Admin access granted for:', user.email);
  }

  // Protect account routes - require authentication
  // Admins always have full access regardless of subscription status
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!user) {
      console.log('[MIDDLEWARE] Account route access denied - no user');
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const profile = await getUserProfile(user.id);

    // Admins bypass all subscription checks
    if (profile?.role === 'admin') {
      console.log('[MIDDLEWARE] Admin bypass - full access granted for:', user.email);
      return supabaseResponse;
    }

    // For regular users, you can add subscription checks here if needed
    // Example: if you want to restrict certain account pages to subscribers only
    // const isSubscribed = profile?.subscription_status === 'active';
    // if (!isSubscribed && request.nextUrl.pathname.startsWith('/account/premium')) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = '/#pricing';
    //   return NextResponse.redirect(url);
    // }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
