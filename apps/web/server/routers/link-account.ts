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
  resolve: async ({ input, ctx }) => {
    const parentId =
      ctx.session.user.type === 'Parent' ? ctx.session.user.id : input.parentId;
    const childId =
      ctx.session.user.type === 'Child' ? ctx.session.user.id : input.childId;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const invite = await useVerificationToken({
      token: hashToken(input.token),
      identifier: JSON.stringify({
        childId,
        parentId,
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
        userId: childId,
      },
      data: {
        parent: {
          connect: {
            userId: parentId,
          },
        },
      },
    });
  },
});
