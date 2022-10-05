import { NextResponse } from 'next/server';
import withAuth, { type NextRequestWithAuth } from './middleware/withAuth';
import withGeoblock from './middleware/withGeoblock';
import withRoles from './middleware/withRoles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = (req: NextRequestWithAuth) => {
  // const country = req.geo?.country || 'US';

  // // Specify the correct pathname
  // console.log(country);
  // if (BLOCKED_COUNTRY.find((c) => c === country)) {
  //   req.nextUrl.pathname = '/blocked';
  // }

  // Rewrite to URL
  return NextResponse.next();
};

export const config = {
  matcher: ['/', '/connect', '/register', '/add-account', '/account/:path*'],
};

const withRolesHandler = withRoles(handler, {
  paths: ['/', '/add-account', '/account/:path*'],
  roles: {
    Parent: ['/', '/add-account', '/account/:path*'],
    Child: ['/'],
  },
});

export default withGeoblock(
  withAuth(withRolesHandler, {
    pages: {
      signIn: '/connect',
      register: '/register',
    },
  }),
  {
    countries: ['KP', 'CU', 'IR', 'SY', 'VE', 'AF', 'FY', 'BA', 'BI', 'CF'],
  },
);
