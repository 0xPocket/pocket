import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
  useVerificationToken,
} from '../services/jwt';
import { sendEmail } from '../services/sendMail';
import { TRPCError } from '@trpc/server';
import { unstable_getServerSession } from 'next-auth';
import { createRouter } from '../createRouter';
import { authOptions } from '../next-auth';
import { prisma } from '../prisma';
import { z } from 'zod';
import { SiweMessage } from 'siwe';
import { getCsrfToken } from 'next-auth/react';

export const emailRouter = createRouter()
  .mutation('verifyChild', {
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
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid request.',
        });
      }
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `user` and `session` are non-nullable to downstream procedures
        session: ctx.session,
      },
    });
  })
  .mutation('verifyEmail', {
    input: z.object({
      email: z.string(),
      token: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      try {
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
            newUser: false,
            emailVerified: new Date(),
          },
        });

        // We force settings a new token
        if (ctx.req && ctx.res) {
          await unstable_getServerSession(ctx.req, ctx.res, authOptions);
        }

        return user;
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid request.',
        });
      }
    },
  })
  .mutation('resendVerificationEmail', {
    resolve: async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user || !user.email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }

      if (!!user.emailVerified) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email is already verified',
        });
      }

      const token = generateVerificationToken();

      const ONE_DAY_IN_SECONDS = 86400;
      const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      await saveVerificationToken({
        identifier: user.email,
        expires,
        token: hashToken(token),
      });

      const params = new URLSearchParams({ token, email: user.email });

      await sendEmail({
        to: user.email,
        template: 'email_verification',
        context: {
          name: user.name,
          // TODO: Use correct URL from production
          url: process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}/verify-email?${params}`
            : `http://localhost:3000/verify-email?${params}`,
        },
      });
    },
  });
