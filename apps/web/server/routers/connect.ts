import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

export const connectRouter = createRouter().mutation('connect', {
  input: z.object({
    email: z.string().email(),
  }),
  resolve: async ({ input }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: input.email,
          mode: 'insensitive',
        },
      },
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
        message: 'You must connect with your wallet.',
      });
    }

    return true;
  },
});
