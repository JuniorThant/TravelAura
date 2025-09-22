import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/airlines(.*)',
  '/tours(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();

  const isAdminUser = userId === process.env.ADMIN_USER_ID;

  // Protect admin routes
  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect private routes
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Always return next if allowed
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
