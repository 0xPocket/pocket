import { sendEmailWrapper } from '@pocket/emails';
import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from '../services/jwt';

export const childRouter = createProtectedRouter()
  .middleware(({ ctx, next }) => {
    if (ctx.session.user.type !== 'Child') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be a Child to access those routes',
      });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `user` and `session` are non-nullable to downstream procedures
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            type: 'Child' as const,
          },
        },
      },
    });
  })
  .mutation('inviteParent', {
    input: z.object({
      email: z.string().email(),
    }),
    resolve: async ({ input, ctx }) => {
      const existingParent = await prisma.user.findFirst({
        where: {
          email: {
            equals: input.email,
            mode: 'insensitive',
          },
        },
      });

      // send an email to link the parent to the child
      if (existingParent) {
        const token = generateVerificationToken();
        const ONE_DAY_IN_SECONDS = 86400;
        const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

        await saveVerificationToken({
          identifier: JSON.stringify({
            childId: ctx.session.user.id,
            parentId: existingParent.id,
          }),
          token: hashToken(token),
          expires: expires,
        });

        const params = new URLSearchParams({
          token,
          childId: ctx.session.user.id,
          parentId: existingParent.id,
        });

        await sendEmailWrapper({
          to: existingParent.email,
          template: 'link_invitation',
          subject: 'Your child wants to be part of your account !',
          props: {
            name: existingParent.name,
            link: `${env.APP_URL}/link-account?${params}`,
            from: 'Child',
            fromName: ctx.session.user.name,
          },
        });

        return 'SENT';
      }
      return 'test';
    },
  })
  .query('getParent', {
    resolve: async ({ ctx }) => {
      return prisma.user.findFirst({
        where: {
          type: 'Parent',
          parent: {
            children: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          address: true,
        },
      });
    },
  });
