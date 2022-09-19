import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const userRoutes = {
  ALL: ['/', '/onboarding'],
  Parent: ['/add-account', '/account/:path*'],
  Child: [],
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

const handler = (req: NextRequestWithAuth) => {
  const token = req.nextauth.token;

  if (!token) {
    return NextResponse.next();
  }

  // New users or unverified users go to onboarding !
  if (
    (token.newUser || !token.emailVerified) &&
    req.nextUrl.pathname !== '/onboarding'
  ) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Onboarding is locked for validated users
  if (
    !token.newUser &&
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

  // User is not parent or child, allowed for anything
  if (!userRoutes[userType]) {
    return NextResponse.next();
  }

  const authorized =
    userRoutes['ALL'].findIndex((route) => {
      return routeAuthorized(req.nextUrl.pathname, route);
    }) !== -1 ||
    userRoutes[userType].findIndex((route) => {
      return routeAuthorized(req.nextUrl.pathname, route);
    }) !== -1;

  if (!authorized) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
};

const middleware = withAuth(handler, {
  pages: {
    signIn: '/connect',
  },
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
});

export default middleware;

export const config = {
  matcher: ['/', '/onboarding', '/add-account', '/account/:path*'],
};
