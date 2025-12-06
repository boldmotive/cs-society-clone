/**
 * OAuth Callback Page (Client-Side Fallback)
 * 
 * This page serves as a fallback and loading state for the OAuth callback.
 * The actual OAuth code exchange happens in the server-side route handler
 * at /app/auth/callback/route.ts which provides more reliable cookie handling
 * in production environments (especially Vercel).
 * 
 * This page will only be shown if:
 * 1. The server-side redirect hasn't completed yet (brief loading state)
 * 2. There's an error that needs to be displayed to the user
 * 3. JavaScript is executing before the redirect completes
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error parameters (from server-side redirect)
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      console.error('[CALLBACK PAGE] Error from server:', errorParam, errorDescription);
      setError(errorDescription || errorParam);
      setTimeout(() => {
        router.replace(`/login?error=${encodeURIComponent(errorParam)}`);
      }, 3000);
      return;
    }

    // If no error, the server-side route should have already redirected us
    // This is just a brief loading state while that happens
    console.log('[CALLBACK PAGE] Waiting for server-side redirect...');

    // Failsafe: if we're still here after 10 seconds, something went wrong
    const timeout = setTimeout(() => {
      console.warn('[CALLBACK PAGE] Server redirect timeout, redirecting to home');
      router.replace('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [router, searchParams]);

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
            <p className="text-sm text-gray-500">Please wait...</p>
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

