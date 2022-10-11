import {
  NextResponse,
  type NextRequest,
  type NextMiddleware,
  type NextFetchEvent,
} from 'next/server';

import { getToken, type JWT } from 'next-auth/jwt';
import { type NextAuthOptions } from 'next-auth';

export interface InternalUrl {
  /** @default "http://localhost:3000" */
  origin: string;
  /** @default "localhost:3000" */
  host: string;
  /** @default "/api/auth" */
  path: string;
  /** @default "http://localhost:3000/api/auth" */
  base: string;
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string;
}

/** Returns an `URL` like object to make requests/redirects from server-side */
function parseUrl(url?: string): InternalUrl {
  const defaultUrl = new URL('http://localhost:3000/api/auth');

  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }

  const _url = new URL(url ?? defaultUrl);
  const path = (_url.pathname === '/' ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, '');

  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}

export interface NextAuthMiddlewareOptions {
  pages?: NextAuthOptions['pages'] & {
    register: string;
  };
}

async function handleMiddleware(
  req: NextRequest,
  options: NextAuthMiddlewareOptions | undefined,
  onSuccess?: (token: JWT) => ReturnType<NextMiddleware>,
) {
  const { pathname, origin } = req.nextUrl;

  const signInPage = options?.pages?.signIn ?? '/api/auth/signin';
  const errorPage = options?.pages?.error ?? '/api/auth/error';
  const registerPage = options?.pages?.register ?? '/api/auth/register';
  const basePath = parseUrl(process.env.NEXTAUTH_URL).path;
  const publicPaths = ['/_next', '/favicon.ico'];

  // Avoid infinite redirects/invalid response
  // on paths that never require authentication
  if (
    pathname.startsWith(basePath) ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return;
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error(
      `[next-auth][error][NO_SECRET]`,
      `\nhttps://next-auth.js.org/errors#no_secret`,
    );

    const errorUrl = new URL(errorPage, origin);
    errorUrl.searchParams.append('error', 'Configuration');

    return NextResponse.redirect(errorUrl);
  }

  const token = await getToken({
    req,
    secret,
  });

  const isAuthorized = !!token;

  const isAuthPage = [signInPage, registerPage].includes(pathname);

  if (!isAuthorized && isAuthPage) {
    return;
  }

  if (isAuthorized && isAuthPage) {
    return NextResponse.redirect(new URL('/', origin));
  }

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return await onSuccess?.(token);

  // the user is not logged in, redirect to the sign-in page
  const signInUrl = new URL(signInPage, origin);
  return NextResponse.redirect(signInUrl);
}

export interface NextRequestWithAuth extends NextRequest {
  nextauth: { token: JWT | null };
}

export type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => ReturnType<NextMiddleware>;

export type WithAuthArgs = [NextMiddlewareWithAuth, NextAuthMiddlewareOptions];

export function withAuth(...args: WithAuthArgs) {
  const middleware = args[0];
  const options = args[1] as NextAuthMiddlewareOptions | undefined;
  return async (...args: Parameters<NextMiddlewareWithAuth>) =>
    await handleMiddleware(args[0], options, async (token) => {
      args[0].nextauth = { token };
      return await middleware(...args);
    });
}

export default withAuth;
