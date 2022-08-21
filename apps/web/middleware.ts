import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const userRoutes = {
  Parent: ['/', '/onboarding', '/add-account', '/account/:path*'],
  Child: ['/', '/onboarding'],
};

function routeAuthorized(currentRoute: string, toMatch: string) {
  let pathToMatch = toMatch;
  let routeToMatch = currentRoute;
  const findWildcard = toMatch.indexOf('/:path*');

  if (findWildcard > 0) {
    pathToMatch = toMatch.substring(0, findWildcard);
    routeToMatch = currentRoute.substring(0, findWildcard);
  }

  return routeToMatch === pathToMatch;
}

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.next();
    }

    // New users or unverified users go to onboarding !
    if (
      (token.isNewUser || !token.emailVerified) &&
      req.nextUrl.pathname !== '/onboarding'
    ) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // Onboarding is locked for validated users
    if (
      !token.isNewUser &&
      token.emailVerified &&
      req.nextUrl.pathname === '/onboarding'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // if (!token.emailVerified && req.nextUrl.pathname !== '/onboarding') {
    //   return NextResponse.redirect(new URL('/onboarding', req.url));
    // }

    // Redirect if user type is not allowed

    const userType = token.type;
    const authorized =
      userRoutes[userType].findIndex((route) => {
        return routeAuthorized(req.nextUrl.pathname, route);
      }) !== -1;

    if (!authorized) {
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

export const config = {
  matcher: ['/', '/onboarding', '/add-account', '/account/:path*'],
};
