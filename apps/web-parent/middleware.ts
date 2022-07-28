import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;

    // New user go to onboarding !
    if (token && token.isNewUser && req.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // Onboarding is locked for existing users
    if (token && !token.isNewUser && req.nextUrl.pathname === '/onboarding') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  },
);

export const config = { matcher: ['/', '/onboarding'] };
