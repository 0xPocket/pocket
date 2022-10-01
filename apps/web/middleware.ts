import { NextResponse } from 'next/server';
import withAuth, { type NextRequestWithAuth } from './middleware/withAuth';
import withRoles from './middleware/withRoles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = (req: NextRequestWithAuth) => {
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

export default withAuth(withRolesHandler, {
  pages: {
    signIn: '/connect',
    register: '/register',
  },
});
