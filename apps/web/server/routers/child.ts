import { TRPCError } from '@trpc/server';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import { grantMaticToChild } from '../services/ethereum';
import { sanitizeChild } from '../utils/sanitizeUser';

export const childRouter = createProtectedRouter()
  .middleware(({ ctx, next }) => {
    if (ctx.session.user.type !== 'Child') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be a Child to access those routes',
      });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `user` and `session` are non-nullable to downstream procedures
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            type: 'Child' as const,
          },
        },
      },
    });
  })
  .query('canClaimMatic', {
    resolve: async ({ ctx }) => {
      const grant = await prisma.child.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          user: {
            select: {
              maticGrants: true,
            },
          },
          parent: true,
        },
      });

      if (
        grant &&
        grant.parent &&
        grant.parent.maticGrants > 0 &&
        grant.user.maticGrants.length === 0
      )
        return true;

      return false;
    },
  })
  .mutation('claimMatic', {
    resolve: async ({ ctx }) => {
      const child = sanitizeChild(
        await prisma.child.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            user: true,
          },
        }),
      );

      if (!child || !child.address) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Child not found',
        });
      }

      const tx = await grantMaticToChild(child);

      return tx.hash as `0x${string}`;
    },
  });
