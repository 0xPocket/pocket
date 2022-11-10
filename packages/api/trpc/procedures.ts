/**
 * We define middlewares and procedures here
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "./trpc";

const isAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuth);

export const parentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.type !== "Parent") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You must be a Parent to access those routes",
    });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          type: "Parent" as const,
        },
      },
    },
  });
});

export const parentRelatedProcedure = parentProcedure
  .input(z.object({ address: z.string() }))
  .use(async ({ ctx, next, input }) => {
    const child = await ctx.prisma.user.findFirst({
      where: {
        address: {
          equals: input.address,
          mode: "insensitive",
        },
        child: {
          parentUserId: ctx.session.user.id,
        },
      },
      include: {
        child: true,
      },
    });

    if (!child || !child.child) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Child not found",
      });
    }

    return next({
      ctx: {
        child,
      },
    });
  });

export const childProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.type !== "Child") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You must be a Child to access those routes",
    });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          type: "Child" as const,
        },
      },
    },
  });
});
