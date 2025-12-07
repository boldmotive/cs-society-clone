import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';
  const origin = requestUrl.origin;

  // Determine if we're in production (HTTPS)
  const isProduction = origin.startsWith('https://');

  console.log('[AUTH CALLBACK] Processing OAuth callback', {
    hasCode: !!code,
    next,
    origin,
    isProduction,
    timestamp: new Date().toISOString(),
  });

  // Handle OAuth errors
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('[AUTH CALLBACK] OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (!code) {
    console.error('[AUTH CALLBACK] No authorization code provided');
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  // Create Supabase server client with cookie handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let response = NextResponse.redirect(`${origin}${next}`);

  // Production-ready cookie options
  const cookieOptions = {
    secure: isProduction, // Only send cookies over HTTPS in production
    sameSite: 'lax' as const, // Required for OAuth redirects to work
    path: '/',
    // httpOnly is handled by Supabase - auth tokens should be httpOnly
  };

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Set cookies on both the request and response with production-ready options
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          // Merge default cookie options with any options from Supabase
          response.cookies.set(name, value, {
            ...cookieOptions,
            ...options,
            // Ensure secure is true in production regardless of what Supabase sends
            secure: isProduction ? true : (options?.secure ?? false),
          });
        });
      },
    },
  });

  // Exchange code for session
  try {
    console.log('[AUTH CALLBACK] Exchanging code for session...');
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('[AUTH CALLBACK] Error exchanging code:', exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=auth_callback_error&error_description=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (!session) {
      console.error('[AUTH CALLBACK] No session returned after code exchange');
      return NextResponse.redirect(`${origin}/login?error=no_session`);
    }

    console.log('[AUTH CALLBACK] Session established for user:', session.user.email);
    
    // Verify the session was set correctly
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[AUTH CALLBACK] Failed to verify user after session creation:', userError);
      return NextResponse.redirect(`${origin}/login?error=session_verification_failed`);
    }

    console.log('[AUTH CALLBACK] User verified:', user.email);

    // Success! Redirect to the intended destination
    console.log('[AUTH CALLBACK] Redirecting to:', next);
    return response;

  } catch (err) {
    console.error('[AUTH CALLBACK] Unexpected error during code exchange:', err);
    return NextResponse.redirect(
      `${origin}/login?error=unexpected_error&error_description=${encodeURIComponent(
        err instanceof Error ? err.message : 'Unknown error'
      )}`
    );
  }
}
