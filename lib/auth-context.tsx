'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from './supabase';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
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

  useEffect(() => {
    let mounted = true;
    let sessionCheckAttempts = 0;
    const MAX_SESSION_CHECK_ATTEMPTS = 3;

    // Explicitly fetch the initial session to sync with server-set cookies
    // This is critical after OAuth redirects where the server sets the session cookie
    async function initializeSession() {
      try {
        sessionCheckAttempts++;
        console.log(`[AUTH] Initializing session (attempt ${sessionCheckAttempts})...`);
        
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
          await fetchProfile(initialSession.user.id);
        } else {
          // If no session found and we haven't reached max attempts, retry after a short delay
          // This helps handle cases where cookies are being set asynchronously
          if (sessionCheckAttempts < MAX_SESSION_CHECK_ATTEMPTS) {
            console.log('[AUTH] No session found, retrying in 500ms...');
            setTimeout(() => {
              if (mounted) initializeSession();
            }, 500);
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
          await fetchProfile(newSession.user.id);
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
  }, []);

  async function fetchProfile(userId: string) {
    console.log('fetchProfile called with userId:', userId);

    try {
      // First verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session ? 'exists' : 'null');

      if (!session) {
        console.warn('No session found, skipping profile fetch');
        setProfile(null);
        setIsLoading(false);
        return;
      }

      console.log('Starting Supabase query with auth token...');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role')
        .eq('id', userId)
        .maybeSingle();

      console.log('Supabase query completed. Data:', data, 'Error:', error);

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data as UserProfile);
      } else {
        console.log('No profile found for user');
        setProfile(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Profile fetch aborted (timeout)');
      } else {
        console.error('Error fetching profile:', err);
      }
      setProfile(null);
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  }

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

