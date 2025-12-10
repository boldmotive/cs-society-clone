import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Single browser client instance - created once and reused
let browserClient: SupabaseClient | null = null;

// Helper function to get cookie options - computed at runtime to ensure correct values
function getCookieOptions() {
  // Check if we're in a browser environment and if we're using HTTPS
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  if (typeof window !== 'undefined') {
    console.log('[SUPABASE] Cookie config:', { 
      isSecure, 
      protocol: window.location.protocol,
      host: window.location.host 
    });
  }
  
  return {
    // In production (HTTPS), cookies must be secure
    // In development (HTTP), secure cookies won't work
    secure: isSecure,
    // sameSite: 'lax' allows cookies to be sent on navigation from external sites
    // This is important for OAuth redirects
    sameSite: 'lax' as const,
    // Path should be root to ensure cookies are sent with all requests
    path: '/',
  };
}

export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: create a new client (won't persist)
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookieOptions: getCookieOptions(),
    });
  }

  // Client-side: use singleton
  if (!browserClient) {
    console.log('[SUPABASE] Creating new browser client instance');
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookieOptions: getCookieOptions(),
    });
  }
  return browserClient;
}

// Legacy export for backward compatibility
export const supabase = typeof window !== 'undefined'
  ? createSupabaseBrowserClient()
  : createBrowserClient(supabaseUrl, supabaseAnonKey, { cookieOptions: getCookieOptions() });
