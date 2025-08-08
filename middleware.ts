import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth-storage');
    const { pathname } = request.nextUrl;

    const isAuthenticated = authCookie && JSON.parse(authCookie.value).state?.isAuthenticated;

    if (pathname.startsWith('/admin') && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};