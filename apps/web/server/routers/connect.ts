import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

export const connectRouter = createRouter().mutation('connect', {
  input: z.object({
    email: z.string().email(),
  }),
  resolve: async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found.',
      });
    }

    if (user.type !== 'Parent') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User not found.',
      });
    }

    return true;
  },
});
