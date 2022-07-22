import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSession(sessionId: string | undefined) {
  return fetch('http://localhost:3000/api/auth/parents/me', {
    credentials: 'omit',
    headers: {
      cookie: 'connect.sid=' + sessionId,
    },
  });
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const res = await getSession(request.cookies.get('connect.sid')).catch();

  if (request.nextUrl.pathname === '/connect' && res.ok) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!res.ok && request.nextUrl.pathname !== '/connect') {
    return NextResponse.redirect(new URL('/connect', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/connect'],
};
