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
      return false;
    }
    return user.type === 'Parent';
  },
});
