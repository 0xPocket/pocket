import { NextFetchEvent, NextMiddleware, NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export interface WithRolesMiddlewareOptions<T extends string> {
  paths: T[];
  roles: {
    [key: string]: T[];
  };
}

export type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent,
) => ReturnType<NextMiddleware>;

async function handleMiddleware<T extends string = string>(
  req: NextRequestWithAuth,
  options: WithRolesMiddlewareOptions<T>,
  onSuccess: () => ReturnType<NextMiddleware>,
) {
  const { pathname, origin } = req.nextUrl;

  const role = req.nextauth.token?.type;

  const shouldCheckRole =
    role &&
    options.paths.find((path) => {
      const regexp = pathToRegexp(path);
      return !!regexp.exec(pathname);
    });

  if (!shouldCheckRole) {
    return await onSuccess();
  }

  const roleMatch = options.roles[role].find((r) => {
    const regexp = pathToRegexp(r);
    return regexp.exec(pathname);
  });

  if (roleMatch) {
    return await onSuccess();
  }

  return NextResponse.redirect(new URL('/', origin));
}

export type WithRolesArgs<T extends string> = [
  NextMiddlewareWithAuth,
  WithRolesMiddlewareOptions<T>,
];

export function withRoles<T extends string>(...args: WithRolesArgs<T>) {
  const middleware = args[0];
  const options = args[1] as WithRolesMiddlewareOptions<T>;
  return async (...args: Parameters<NextMiddlewareWithAuth>) =>
    await handleMiddleware(args[0], options, async () => {
      return await middleware(...args);
    });
}

export default withRoles;
