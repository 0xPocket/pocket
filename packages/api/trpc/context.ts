import type { Session } from "next-auth";

import { prisma } from "@lib/prisma";

import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import type { Logger } from "next-axiom";

import { NextApiRequest } from "next";
import { getServerAuthSession } from "../next-auth/get-server-auth-session";
import { env } from "config/env/server";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session: Session | null;
  logger: Logger;
  req?: NextApiRequest;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    log: opts.logger,
    req: opts.req,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logger = (req as any)?.log as Logger;

  // randomly slow the api for testing
  if (env.NODE_ENV === "development" && Math.random() > 0.5) {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 500)
    );
  }

  return await createContextInner({
    session,
    logger,
    req,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
