import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Single browser client instance - created once and reused
let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Server-side: create a new client (won't persist)
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  // Client-side: use singleton
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// Legacy export for backward compatibility
export const supabase = typeof window !== 'undefined'
  ? createSupabaseBrowserClient()
  : createBrowserClient(supabaseUrl, supabaseAnonKey);
