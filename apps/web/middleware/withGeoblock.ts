import { NextFetchEvent, NextMiddleware, NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export interface WithGeoblockMiddlewareOptions {
  countries: string[];
}

export type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => ReturnType<NextMiddleware>;

async function handleMiddleware(
  req: NextRequestWithAuth,
  options: WithGeoblockMiddlewareOptions,
  onSuccess: () => ReturnType<NextMiddleware>,
) {
  const country = req.geo?.country || 'US';

  if (options.countries.find((c) => c === country)) {
    req.nextUrl.pathname = '/blocked';
    return NextResponse.rewrite(req.nextUrl);
  }

  return onSuccess();
}

export type WithGeoblockArgs = [
  NextMiddlewareWithAuth,
  WithGeoblockMiddlewareOptions,
];

export function withGeoblock(...args: WithGeoblockArgs) {
  const middleware = args[0];
  const options = args[1] as WithGeoblockMiddlewareOptions;
  return async (...args: Parameters<NextMiddlewareWithAuth>) =>
    await handleMiddleware(args[0], options, async () => {
      return await middleware(...args);
    });
}

export default withGeoblock;
