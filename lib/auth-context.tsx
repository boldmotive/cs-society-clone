'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get client once at module level to prevent multiple instances
const supabase = createSupabaseBrowserClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, mounted: boolean) => {
    console.log('fetchProfile called with userId:', userId);

    // Create a timeout promise that rejects after 20 seconds
    // This accounts for slow networks and Supabase latency
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Profile fetch timeout after 20s'));
      }, 20000);
    });

    try {
      // First verify we have a valid session
      const { data: { session }, error: sessionCheckError } = await supabase.auth.getSession();
      console.log('Current session:', session ? `exists (user: ${session.user.email})` : 'null', 'Error:', sessionCheckError);

      if (!session) {
        console.warn('No session found, skipping profile fetch');
        if (mounted) {
          setProfile(null);
          setIsLoading(false);
        }
        return;
      }

      console.log('Session verified, querying profiles table...');

      // Query profiles table with explicit error handling and timeout protection
      const { data, error } = await Promise.race([
        supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, bio, role, subscription_status, subscription_plan')
          .eq('id', userId)
          .maybeSingle(),
        timeoutPromise,
      ]);

      console.log('Profile query completed:', { 
        dataExists: !!data, 
        error: error ? `${error.code}: ${error.message}` : null,
        userId 
      });

      if (!mounted) return;

      if (error) {
        console.error('Error fetching profile from Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        setProfile(null);
      } else if (data) {
        console.log('Profile fetched successfully:', {
          id: data.id,
          email: data.email,
          role: data.role,
          hasAvatar: !!data.avatar_url,
        });
        setProfile(data as UserProfile);
      } else {
        console.log('No profile data found for user - profile may not exist yet');
        // Create a minimal profile from the user data if profiles table entry doesn't exist
        if (session.user) {
          const minimalProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || null,
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            bio: null,
            role: 'user',
            subscription_status: null,
            subscription_plan: null,
          };
          console.log('Created minimal profile from user metadata:', minimalProfile);
          setProfile(minimalProfile);
        } else {
          setProfile(null);
        }
      }
    } catch (err: unknown) {
      if (!mounted) return;
      if (err instanceof Error && err.message.includes('timeout')) {
        console.warn('Profile fetch timed out after 20s. This may indicate a slow network connection or Supabase latency.');
      } else {
        console.error('Error in fetchProfile:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
      setProfile(null);
    } finally {
      if (mounted) {
        console.log('Profile fetch complete, setting isLoading to false');
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let sessionCheckAttempts = 0;
    const MAX_SESSION_CHECK_ATTEMPTS = 5;
    const RETRY_DELAY_MS = 300;

    // Explicitly fetch the initial session to sync with server-set cookies
    // This is critical after OAuth redirects where the server sets the session cookie
    async function initializeSession() {
      try {
        sessionCheckAttempts++;
        console.log(`[AUTH] Initializing session (attempt ${sessionCheckAttempts}/${MAX_SESSION_CHECK_ATTEMPTS})...`);
        
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[AUTH] Session error:', sessionError);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (!mounted) return;

        console.log('[AUTH] Initial session check:', initialSession?.user?.email || 'no session');

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id, mounted);
        } else {
          // If no session found and we haven't reached max attempts, retry after a short delay
          // This helps handle cases where cookies are being set asynchronously in Vercel/production
          if (sessionCheckAttempts < MAX_SESSION_CHECK_ATTEMPTS) {
            console.log(`[AUTH] No session found, retrying in ${RETRY_DELAY_MS}ms...`);
            setTimeout(() => {
              if (mounted) initializeSession();
            }, RETRY_DELAY_MS);
          } else {
            console.log('[AUTH] No session found after max attempts');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('[AUTH] Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    // Initialize session immediately
    initializeSession();

    // Listen for auth changes - this handles subsequent auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log('[AUTH] State changed:', event, 'User:', newSession?.user?.email || 'none');

        // Skip INITIAL_SESSION as we handle it above with getSession()
        if (event === 'INITIAL_SESSION') {
          return;
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Fetch profile on sign in events
        if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Always fetch profile on SIGNED_IN to ensure we have the latest data
          console.log('Fetching profile for user:', newSession.user.id);
          await fetchProfile(newSession.user.id, mounted);
        } else if (!newSession?.user) {
          console.log('No user in session, clearing profile');
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('Google sign in error:', error);
  }

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('GitHub sign in error:', error);
  }

  async function signOut() {
    try {
      setIsLoading(true);
      // Use scope: 'local' to only sign out the current browser tab/session
      // This avoids issues when the global session is already invalidated
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Sign out error:', error);
        // Even if there's an error, still clear local state
      }
      // Explicitly clear state after sign out
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out failed:', err);
      // Still clear local state on error
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAdmin: profile?.role === 'admin',
    isSubscribed: profile?.subscription_status === 'active',
    signInWithGoogle,
    signInWithGitHub,
    signOut,
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

