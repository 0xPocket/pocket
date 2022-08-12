import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { unstable_getServerSession as getServerSession } from 'next-auth';
import { authOptions } from './next-auth';

import { GetServerSidePropsContext } from 'next';

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

  return {
    req,
    res,
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
