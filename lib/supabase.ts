import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Single browser client instance - created once and reused
let browserClient: SupabaseClient | null = null;

/**
 * Creates a Supabase client for browser-side operations.
 * Uses anon key and is subject to RLS policies.
 * Note: With Clerk auth, this client is only used for database queries,
 * not for authentication.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: create a new client (won't persist)
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  // Client-side: use singleton
  if (!browserClient) {
    console.log('[SUPABASE] Creating new browser client instance');
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return browserClient;
}

// Legacy export for backward compatibility
export const supabase = typeof window !== 'undefined'
  ? createSupabaseBrowserClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
