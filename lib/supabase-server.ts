import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Production-ready cookie options
// Note: In server components, we can't easily detect HTTPS, so we use NODE_ENV
const isProduction = process.env.NODE_ENV === 'production';
const defaultCookieOptions = {
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...defaultCookieOptions,
              ...options,
              // Ensure secure is true in production
              secure: isProduction ? true : (options?.secure ?? false),
            })
          );
        } catch {
          // This can happen when calling from a Server Component
          // The cookies will be set by middleware instead
        }
      },
    },
  });
}

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

export async function getUserRole() {
  const user = await getUser();
  
  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
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

export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin';
}

