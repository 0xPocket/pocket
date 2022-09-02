import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';

export const tokenRouter = createProtectedRouter()
  .query('blacklist', {
    resolve: async () => {
      return prisma.blacklistToken.findMany({
        where: {
          verified: true,
        },
      });
    },
  })
  .mutation('report', {
    input: z.object({
      address: z.string().transform((address) => address.toLowerCase()),
    }),
    resolve: async ({ ctx, input }) => {
      ctx.log.info('new token reported', input);

      return prisma.blacklistToken.upsert({
        where: {
          address: input.address,
        },
        create: {
          address: input.address,
          verified: false,
        },
        update: {
          address: input.address,
          verified: false,
        },
      });
    },
  });
