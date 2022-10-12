import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { unstable_getServerSession as getServerSession } from 'next-auth/next';
import { authOptions } from './next-auth';

import { GetServerSidePropsContext } from 'next';
import type { Logger } from 'next-axiom';
import { env } from 'config/env/server';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions | GetServerSidePropsContext,
) => {
  // for API-response caching see https://trpc.io/docs/caching
  const req = opts?.req;
  const res = opts?.res;
  const session = req && res && (await getServerSession(req, res, authOptions));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logger = (req as any)?.log as Logger;

  // slow the api for testing
  if (env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return {
    req,
    res,
    log: logger,
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
