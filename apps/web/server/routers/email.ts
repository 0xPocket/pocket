import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
  useVerificationToken,
} from '../services/jwt';
import { TRPCError } from '@trpc/server';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import { z } from 'zod';
import { SiweMessage } from 'siwe';
import { getCsrfToken } from 'next-auth/react';
import { env } from 'config/env/server';
// import { addAddressToWebhook } from '../services/alchemy';
import { sendEmailWrapper } from '@pocket/emails';

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
        const childConfig = await prisma.childConfig.findUnique({
          where: {
            email: input.email,
          },
        });

        if (!childConfig) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User not found.',
          });
        }

        const siweMessage = new SiweMessage(JSON.parse(input.message || '{}'));
        const fields = await siweMessage.validate(input.signature);

        if (fields.nonce !== (await getCsrfToken({ req: ctx.req }))) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid nonce.',
          });
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

        const [user] = await prisma.$transaction([
          prisma.user.create({
            data: {
              name: childConfig.name,
              email: childConfig.email,
              emailVerified: new Date(),
              address: fields.address,
              type: 'Child',
              child: {
                create: {
                  initialCeiling: childConfig.initialCeiling,
                  initialPeriodicity: childConfig.initialPeriodicity,
                  parentUserId: childConfig.parentUserId,
                },
              },
            },
          }),
          prisma.childConfig.delete({
            where: {
              id: childConfig.id,
            },
          }),
        ]);

        return user;
      } catch (e) {
        if (e instanceof TRPCError) {
          throw e;
        }
        if (e instanceof Error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: e.message,
          });
        }
      }
    },
  })
  .mutation('verifyEmail', {
    input: z.object({
      email: z.string(),
      token: z.string(),
    }),
    resolve: async ({ input }) => {
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
  .mutation('resendVerificationEmail', {
    input: z.object({
      email: z.string().email(),
    }),
    resolve: async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user || !user.email || !user.name) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        });
      }

      if (user.emailVerified) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
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

      await sendEmailWrapper({
        to: user.email,
        template: 'email_verification',
        props: {
          name: user.name,
          link: `${env.APP_URL}/verify-email?${params}`,
        },
      }).catch(() => {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Server error.',
        });
      });
    },
  });
