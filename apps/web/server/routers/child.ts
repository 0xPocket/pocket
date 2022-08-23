import { TRPCError } from '@trpc/server';
import { providers, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { createProtectedRouter } from '../createRouter';
import { env } from '../env';
import { prisma } from '../prisma';
import { grantMaticToChild } from '../services/ethereum';
import { sanitizeChild } from '../utils/sanitizeUser';

const provider = new providers.JsonRpcProvider(env.NEXT_PUBLIC_RPC_ENDPOINT);
const wallet = new Wallet(env.POCKET_PRIVATE_KEY, provider);

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

      if (child.maticClaimed) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Matic already claimed',
        });
      }

      const tx = await grantMaticToChild(child).catch(() => {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server error',
        });
      });

      return tx.hash as `0x${string}`;
    },
  });
