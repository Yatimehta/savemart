import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'savemart-secret-fallback-for-dev-only-change-in-prod-2026',
  });

  // If visiting login page while already authenticated, redirect to /admin
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    if (token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Protect /admin and any subroutes
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');

  if (isAdminPage || isAdminApi) {
    if (!token) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: 'Unauthorized: Authentication required.' },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
