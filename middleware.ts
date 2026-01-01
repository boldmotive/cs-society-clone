import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers for protected routes
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/shop(.*)',
  '/account(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    if (!userId) {
      // Redirect to sign-in for unauthenticated users
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect admin routes - require admin role
  if (isAdminRoute(req)) {
    // Check if user has admin role in their session claims (set via Clerk publicMetadata)
    // The role is stored in publicMetadata and synced to session claims
    const metadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
    const userRole = metadata?.role;

    if (userRole !== 'admin') {
      // Redirect non-admins to home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
