// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;
  const { pathname } = req.nextUrl;

  // Redirect logged-in users away from the login page
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect certain routes, requiring authentication
  const protectedRoutes = ["/dashboard"]; // Add more protected routes if needed

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to home page
  }

  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/", "/dashboard/:path*"], // Add more paths if needed
};