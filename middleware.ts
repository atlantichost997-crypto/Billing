import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

// Define protected and public routes
const protectedRoutes = ['/portal', '/checkout'];
const publicRoutes = ['/login', '/register', '/reset-password'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Retrieve and decrypt the session cookie
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // If the user is trying to access a protected route without a valid session, redirect to login
  if (isProtectedRoute && !session?.clientId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // If the user is already logged in and tries to access login/register, redirect to portal
  if (isPublicRoute && session?.clientId) {
    return NextResponse.redirect(new URL('/portal/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

// Configure the matcher to run middleware on all routes except static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
