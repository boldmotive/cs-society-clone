'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { createSupabaseBrowserClient } from './supabase';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  subscription_status: 'inactive' | 'active' | 'canceled' | 'past_due' | null;
  subscription_plan: 'monthly' | 'annual' | null;
}

interface AuthContextType {
  // Clerk user info is available via useUser() hook directly
  // This context now primarily provides profile data from Supabase
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get client once at module level to prevent multiple instances
const supabase = createSupabaseBrowserClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, isMounted: boolean) => {
    console.log('[AUTH] fetchProfile called with userId:', userId);

    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Profile fetch timeout after 5s'));
      }, 5000);
    });

    try {
      console.log('[AUTH] Querying profiles table...');

      // Query profiles table with explicit error handling and timeout protection
      const { data, error } = await Promise.race([
        supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, bio, role, subscription_status, subscription_plan')
          .eq('id', userId)
          .maybeSingle(),
        timeoutPromise,
      ]);

      console.log('[AUTH] Profile query completed:', {
        dataExists: !!data,
        error: error ? `${error.code}: ${error.message}` : null,
        userId
      });

      if (!isMounted) return;

      if (error) {
        console.error('[AUTH] Error fetching profile from Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        setProfile(null);
      } else if (data) {
        console.log('[AUTH] Profile fetched successfully:', {
          id: data.id,
          email: data.email,
          role: data.role,
          hasAvatar: !!data.avatar_url,
        });
        setProfile(data as UserProfile);
      } else {
        console.log('[AUTH] No profile data found for user - profile may not exist yet');
        setProfile(null);
      }
    } catch (err: unknown) {
      if (!isMounted) return;
      if (err instanceof Error && err.message.includes('timeout')) {
        console.warn('[AUTH] Profile fetch timed out after 5s.');
      } else {
        console.error('[AUTH] Error in fetchProfile:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      setProfile(null);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Function to manually refresh profile
  const refreshProfile = useCallback(async () => {
    if (clerkUser?.id) {
      setIsLoading(true);
      await fetchProfile(clerkUser.id, true);
    }
  }, [clerkUser?.id, fetchProfile]);

  // Fetch profile when Clerk user changes
  useEffect(() => {
    let mounted = true;

    if (!clerkLoaded) {
      // Clerk is still loading
      return;
    }

    if (isSignedIn && clerkUser?.id) {
      console.log('[AUTH] Clerk user signed in:', clerkUser.primaryEmailAddress?.emailAddress);
      fetchProfile(clerkUser.id, mounted);
    } else {
      // User is signed out or Clerk has finished loading with no user
      console.log('[AUTH] No Clerk user, clearing profile');
      setProfile(null);
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [clerkLoaded, isSignedIn, clerkUser?.id, fetchProfile]);

  const value: AuthContextType = {
    profile,
    isLoading: !clerkLoaded || isLoading,
    isAdmin: profile?.role === 'admin',
    isSubscribed: profile?.subscription_status === 'active',
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
