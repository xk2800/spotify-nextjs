// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ----- Configuration -----
// Define all routes in one place - outside the function
const ROUTES = {
  HOME: "/",
  PROTECTED: [
    "/dashboard",
    "/album",
    "/time-machine",
    // Add new protected routes here
  ]
};

/**
 * Authentication middleware for Spotify integration
 * Handles route protection and redirects based on authentication status
 */
export function middleware(req: NextRequest) {
  // Extract authentication token from cookies
  const token = req.cookies.get("spotify_token")?.value;
  const { pathname } = req.nextUrl;

  // ----- Redirect Logic -----
  // Redirect authenticated users away from login page to dashboard
  if (pathname === ROUTES.HOME && token) {
    return NextResponse.redirect(new URL(ROUTES.PROTECTED[0], req.url));
  }

  // Check if current path is a protected route
  const isProtectedRoute = ROUTES.PROTECTED.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Matcher configuration for the middleware
 * Must be statically analyzable at compile time
 */
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/album/:path*',
    '/time-machine/:path*'
  ]
};