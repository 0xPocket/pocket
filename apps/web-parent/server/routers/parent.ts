import type { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from '../services/jwt';
import { sendEmail } from '../services/sendMail';

export const parentRouter = createProtectedRouter()
  .middleware(({ ctx, next }) => {
    if (ctx.session.user.type !== 'Parent') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be a Parent to access those routes',
      });
    }
    return next();
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
  .query('childById', {
    input: z.object({
      id: z.string(),
    }),
    resolve: ({ ctx, input }) => {
      return prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          child: true,
        },
      });
    },
  })
  .mutation('children', {
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
            address: 'adga',
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
          subject: 'Welcome to the family',
          template: 'child_invitation',
          context: {
            name: child.name!,
            // TODO: Use correct URL from production
            url: `http://localhost:3000/verify-child?${params}`,
          },
        });
      }

      console.log('children created');

      return 'OK';
    },
  });