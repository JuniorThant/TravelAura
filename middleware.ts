import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { getAuthUser, hasAirline, hasProperty } from './utils/actions';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/','/properties(.*)','/airlines(.*)','/tours(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const userId = auth().userId;

  // if (!userId) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }

  const isAdminUser = userId === process.env.ADMIN_USER_ID;

  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
