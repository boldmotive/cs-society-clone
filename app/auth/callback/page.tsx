'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Suspense } from 'react';

function CallbackContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Get params directly from window.location to avoid useSearchParams issues
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const next = params.get('next') ?? '/';
    const oauthError = params.get('error');
    const errorDescription = params.get('error_description');

    console.log('Auth callback - code:', code ? 'present' : 'missing', 'next:', next);

    if (oauthError) {
      console.error('OAuth error:', oauthError, errorDescription);
      setError(`OAuth error: ${oauthError}`);
      setTimeout(() => router.replace(`/login?error=${encodeURIComponent(oauthError)}`), 2000);
      return;
    }

    if (!code) {
      console.error('No code provided in callback');
      setError('No authorization code received');
      setTimeout(() => router.replace('/login?error=no_code'), 2000);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    // Navigate helper that prevents double navigation
    // Use window.location.href for full page load to ensure auth state is fresh
    function navigateTo(path: string) {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      console.log('Navigating to:', path);
      window.location.href = path;
    }

    // Listen for SIGNED_IN event - this fires when session is established
    // Navigate immediately when this fires, don't wait for the promise
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Callback auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        console.log('SIGNED_IN detected, navigating to:', next);
        navigateTo(next);
      }
    });

    // Start the code exchange - the promise may hang but onAuthStateChange will fire
    console.log('Exchanging code for session...');
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        setError(`Authentication failed: ${exchangeError.message}`);
        setTimeout(() => navigateTo('/login?error=auth_callback_error'), 2000);
      }
      // If successful, onAuthStateChange will handle navigation
    }).catch((err) => {
      console.error('Callback error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`);
      setTimeout(() => navigateTo('/login?error=auth_callback_error'), 2000);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="gradient-bg min-h-screen flex justify-center items-center px-4" style={{ backgroundColor: '#0a1628' }}>
      {/* Animated gradient orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      <div className="gradient-mesh" />
      <div className="gradient-content flex flex-col items-center gap-4">
        {error ? (
          <>
            <div className="w-8 h-8 text-red-500 text-2xl">⚠️</div>
            <p className="text-base sm:text-lg text-red-400">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-base sm:text-lg md:text-xl text-gray-400">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="gradient-bg min-h-screen flex justify-center items-center px-4" style={{ backgroundColor: '#0a1628' }}>
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="gradient-mesh" />
        <div className="gradient-content flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-base sm:text-lg md:text-xl text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

