import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Creates a Supabase client for server-side operations.
 * Uses service role key for full database access (bypasses RLS).
 * Use this for webhook handlers and admin operations.
 */
export function createSupabaseServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client with anon key.
 * Subject to RLS policies.
 */
export function createSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Gets the current user from Clerk.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const user = await currentUser();
  return user;
}

/**
 * Gets the user's role from the profiles table.
 * Uses Clerk user ID to look up the profile.
 */
export async function getUserRole() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = createSupabaseServiceClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error getting user role:', error);
    return 'user'; // Default role
  }

  return profile?.role || 'user';
}

/**
 * Checks if the current user is an admin.
 */
export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin';
}

