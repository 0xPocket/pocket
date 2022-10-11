import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

export const betaRouter = createRouter().query('verifyInvite', {
  input: z.object({
    token: z.string(),
  }),
  resolve: async ({ input }) => {
    if (!env.NEXT_PUBLIC_PRIVATE_BETA) {
      return true;
    }
    const token = await prisma.privateBetaToken.findUnique({
      where: { token: input.token },
    });

    if (!token || token.used) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid token',
      });
    }

    return true;
  },
});
