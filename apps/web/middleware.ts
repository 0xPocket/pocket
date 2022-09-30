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

  const userType = token.type;

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
  matcher: ['/', '/add-account', '/account/:path*'],
};
