'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginContent() {
  const { user, isLoading, signInWithGoogle, signInWithGitHub } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirect);
    }
  }, [user, isLoading, router, redirect]);

  if (isLoading) {
    return (
      <div className="gradient-bg min-h-screen flex justify-center items-center" style={{ backgroundColor: '#0a1628' }}>
        {/* Animated gradient orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="gradient-mesh" />
        <div className="gradient-content" style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
      {/* Animated gradient orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      {/* Mesh gradient overlay */}
      <div className="gradient-mesh" />

      <div className="gradient-content animate-fade-in-up" style={{
        backgroundColor: 'rgba(15, 29, 50, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '1rem',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px',
        margin: '1rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: '#06b6d4', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.5rem'
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Sign in to access your account
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            color: '#ef4444',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            Authentication failed. Please try again.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={signInWithGoogle}
            className="btn-oauth"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={signInWithGitHub}
            className="btn-oauth"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: '#24292e',
              color: '#ffffff',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '0.75rem', 
          marginTop: '2rem' 
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="gradient-bg min-h-screen flex justify-center items-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="gradient-mesh" />
        <div className="gradient-content" style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

