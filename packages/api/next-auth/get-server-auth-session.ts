import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { getAuthOptions } from ".";

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return unstable_getServerSession(ctx.req, ctx.res, getAuthOptions(ctx.req));
};
