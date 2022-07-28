import { SiweMessage } from 'siwe';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { getCsrfToken } from 'next-auth/react';
import { TRPCError } from '@trpc/server';
import { hashToken, useVerificationToken } from '../services/jwt';
import { prisma } from '../prisma';

export const authRouter = createRouter().mutation('verifyChild', {
  input: z.object({
    email: z.string(),
    token: z.string(),
    signature: z.string(),
    message: z.string(),
  }),
  resolve: async ({ ctx, input }) => {
    try {
      const siweMessage = new SiweMessage(JSON.parse(input.message || '{}'));
      const fields = await siweMessage.validate(input.signature);

      if (fields.nonce !== (await getCsrfToken({ req: ctx.req }))) {
        throw new Error('Invalid nonce.');
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const invite = await useVerificationToken({
        token: hashToken(input.token),
        identifier: input.email,
      });

      const invalidInvite = !invite || invite.expires.valueOf() < Date.now();

      if (invalidInvite) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid invite.',
        });
      }

      const user = await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          address: fields.address,
          newUser: false,
          child: {
            update: {
              status: 'ACTIVE',
            },
          },
          emailVerified: new Date(),
        },
      });

      return user;
    } catch (e) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid request.' });
    }
  },
});
