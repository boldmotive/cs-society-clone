import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Debug endpoint to verify authentication state
 *
 * This endpoint helps troubleshoot auth issues by:
 * 1. Checking server-side session
 * 2. Verifying cookies
 * 3. Testing database connection
 *
 * Access: GET /api/auth/debug
 *
 * SECURITY: Remove or protect this endpoint before production!
 */
export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      error: 'Missing Supabase configuration',
      supabaseConfigured: false,
    }, { status: 500 });
  }

  // Determine if we're in production (HTTPS)
  const isProduction = request.nextUrl.protocol === 'https:';

  // Production-ready cookie options
  const cookieOptions = {
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
  };

  let response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...cookieOptions,
            ...options,
            secure: isProduction ? true : (options?.secure ?? false),
          });
        });
      },
    },
  });

  try {
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Get cookies (without exposing sensitive values)
    const cookies = request.cookies.getAll().map(c => ({
      name: c.name,
      hasValue: !!c.value,
      valueLength: c.value?.length || 0,
    }));

    // Try to fetch profile if user exists
    let profileData = null;
    let profileError = null;

    if (user) {
      const result = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .single();
      
      profileData = result.data;
      profileError = result.error;
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isProduction,
      protocol: request.nextUrl.protocol,
      cookieSettings: {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
      },
      supabaseConfigured: true,
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          createdAt: session.user.created_at,
        } : null,
        expiresAt: session?.expires_at || null,
        error: sessionError?.message || null,
      },
      user: {
        exists: !!user,
        id: user?.id || null,
        email: user?.email || null,
        error: userError?.message || null,
      },
      profile: {
        exists: !!profileData,
        data: profileData,
        error: profileError?.message || null,
      },
      cookies: {
        count: cookies.length,
        supabaseAuth: cookies.filter(c => c.name.includes('supabase')),
      },
      url: request.url,
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    };

    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (error) {
    console.error('[AUTH DEBUG] Error:', error);
    return NextResponse.json({
      error: 'Failed to get auth debug info',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
