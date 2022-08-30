import type { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import { grantMaticToParent } from '../services/ethereum';
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from '../services/jwt';
import { sendEmail } from '../services/sendMail';
import { sanitizeParent } from '../utils/sanitizeUser';

export const parentRouter = createProtectedRouter()
  .middleware(({ ctx, next }) => {
    if (ctx.session.user.type !== 'Parent') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be a Parent to access those routes',
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
            type: 'Parent' as const,
          },
        },
      },
    });
  })
  .query('children', {
    resolve: async ({ ctx }) => {
      return prisma.user.findMany({
        where: {
          type: 'Child',
          child: {
            parentUserId: ctx.session.user.id,
          },
        },
        include: {
          child: true,
        },
      });
    },
  })
  .mutation('createChild', {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    resolve: async ({ ctx, input }) => {
      const parent = await prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
      });

      if (!parent) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      let child: User;

      try {
        child = await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            type: 'Child',
            newUser: true,
            child: {
              create: {
                parent: {
                  connect: {
                    userId: parent.id,
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Child with this email already exists',
        });
      }

      if (child) {
        const token = generateVerificationToken();

        const ONE_DAY_IN_SECONDS = 86400;
        const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

        await saveVerificationToken({
          identifier: input.email,
          expires,
          token: hashToken(token),
        });

        const params = new URLSearchParams({ token, email: input.email });

        await sendEmail({
          to: child.email!,
          template: 'child_invitation',
          context: {
            name: child.name!,
            // TODO: Use correct URL from production
            url: process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}/verify-child?${params}`
              : `http://localhost:3000/verify-child?${params}`,
          },
        });
      }

      console.log('children created');

      return 'OK';
    },
  })
  .mutation('testWebhookRamp', {
    resolve: async ({ ctx }) => {
      const parent = sanitizeParent(
        await prisma.parent.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            user: true,
          },
        }),
      );
      if (!parent) {
        return;
      }
      await grantMaticToParent(parent);
    },
  })
  .middleware(async ({ ctx, next, rawInput }) => {
    const inputSchema = z.object({
      address: z.string(),
    });
    const result = inputSchema.safeParse(rawInput);

    if (!result.success) throw new TRPCError({ code: 'BAD_REQUEST' });

    const child = await prisma.user.findUnique({
      where: {
        address: result.data.address,
      },
      include: {
        child: true,
      },
    });

    if (
      child?.type === 'Child' &&
      child?.child?.parentUserId !== ctx.session.user.id
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not related to this child',
      });
    }

    return next();
  })
  .query('childByAddress', {
    input: z.object({
      address: z.string(),
    }),
    resolve: ({ input }) => {
      return prisma.user.findUnique({
        where: {
          address: input.address,
        },
        include: {
          child: true,
        },
      });
    },
  });
