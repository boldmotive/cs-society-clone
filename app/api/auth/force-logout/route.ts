import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Force logout endpoint - clears all auth cookies and signs out
 * Access: GET /api/auth/force-logout
 */
export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const origin = request.nextUrl.origin;

  // Create redirect response to home page
  const response = NextResponse.redirect(`${origin}/login?message=logged_out`);

  // Clear all Supabase auth cookies by setting them to expire immediately
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token', 
    `sb-${supabaseUrl?.split('//')[1]?.split('.')[0]}-auth-token`,
    `sb-${supabaseUrl?.split('//')[1]?.split('.')[0]}-auth-token-code-verifier`,
  ];

  // Delete all possible Supabase cookies
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes('supabase') || cookie.name.startsWith('sb-')) {
      response.cookies.delete(cookie.name);
    }
  });

  // Also explicitly delete known cookie names
  cookieNames.forEach((name) => {
    response.cookies.delete(name);
  });

  // Try to sign out via Supabase as well (belt and suspenders)
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name }) => {
              response.cookies.delete(name);
            });
          },
        },
      });

      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error('[FORCE LOGOUT] Error during signOut:', e);
    }
  }

  return response;
}

