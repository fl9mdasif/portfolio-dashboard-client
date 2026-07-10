import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded && decoded.exp ? decoded.exp * 1000 < Date.now() : true;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  let isExpired = false;
  if (sessionCookie) {
    isExpired = isTokenExpired(sessionCookie.value);
  }

  // If token is expired, clean it up and redirect to login if they try to access dashboard
  if (isExpired) {
    const response = pathname.startsWith('/dashboard')
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.next();
    response.cookies.delete('session');
    return response;
  }

  // 1. If user is logged in and tries to access login or root, redirect to dashboard
  if (sessionCookie && !isExpired && (pathname === '/' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If user is NOT logged in and tries to access dashboard, redirect to login
  if ((!sessionCookie || isExpired) && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. For all other routes, proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login'],
};