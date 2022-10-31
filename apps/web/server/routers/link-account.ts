import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import { hashToken, useVerificationToken } from '../services/jwt';

export const linkAccountRouter = createProtectedRouter().mutation('link', {
  input: z.object({
    token: z.string(),
    parentId: z.string(),
    childId: z.string(),
  }),
  resolve: async ({ input }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const invite = await useVerificationToken({
      token: hashToken(input.token),
      identifier: JSON.stringify({
        childId: input.childId,
        parentId: input.parentId,
      }),
    });

    const invalidInvite = !invite || invite.expires.valueOf() < Date.now();

    if (invalidInvite) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid invite.',
      });
    }

    await prisma.child.update({
      where: {
        userId: input.childId,
      },
      data: {
        parent: {
          connect: {
            userId: input.parentId,
          },
        },
      },
    });
  },
});
