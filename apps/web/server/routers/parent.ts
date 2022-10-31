import { sendEmailWrapper } from '@pocket/emails';
import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import { ParentSchema } from '../schemas';
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from '../services/jwt';

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
  .query('pendingChildren', {
    resolve: async ({ ctx }) => {
      return prisma.pendingChild.findMany({
        where: {
          parentUserId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation('resendChildVerificationEmail', {
    input: z.object({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      return 'TEST';
      // const childConfig = await prisma.pendingChild.findUnique({
      //   where: {
      //     id: input.id,
      //   },
      // });

      // if (!childConfig) {
      //   throw new TRPCError({ code: 'NOT_FOUND' });
      // }

      // const token = generateVerificationToken();
      // const ONE_DAY_IN_SECONDS = 86400;
      // const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      // await saveVerificationToken({
      //   identifier: childConfig.email,
      //   expires,
      //   token: hashToken(token),
      // });

      // const params = new URLSearchParams({ token, email: childConfig.email });

      // await sendEmailWrapper({
      //   to: childConfig.email,
      //   template: 'child_invitation',
      //   props: {
      //     name: childConfig.name,
      //     link: `${env.APP_URL}/verify-child?${params}`,
      //   },
      // });
    },
  })
  .mutation('createChild', {
    input: ParentSchema.createChild,
    resolve: async ({ ctx, input }) => {
      const parent = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!parent) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const [existingChild, pendingChild] = await prisma.$transaction([
        prisma.user.findFirst({
          where: {
            email: {
              equals: input.email,
              mode: 'insensitive',
            },
          },
        }),
        prisma.pendingChild.findFirst({
          where: {
            email: {
              equals: input.email,
              mode: 'insensitive',
            },
          },
        }),
      ]);

      // if the child already exists, we just need to link them to the parent
      if (existingChild) {
        const token = generateVerificationToken();
        const ONE_DAY_IN_SECONDS = 86400;
        const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

        await saveVerificationToken({
          identifier: JSON.stringify({
            childId: existingChild.id,
            parentId: ctx.session.user.id,
          }),
          token: hashToken(token),
          expires: expires,
        });

        const params = new URLSearchParams({
          token,
          childId: existingChild.id,
          parentId: ctx.session.user.id,
        });

        await sendEmailWrapper({
          to: existingChild.email,
          template: 'link_invitation',
          subject: 'Your parent wants you to be part of his account !',
          props: {
            name: existingChild.name,
            link: `${env.APP_URL}/link-account?${params}`,
            from: 'Parent',
            fromName: ctx.session.user.name,
          },
        });

        return 'SENT';
      }

      if (pendingChild) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A user with that email already exists',
        });
      }

      const childConfig = await prisma.pendingChild.create({
        data: {
          name: input.name,
          email: input.email,
          parentUserId: parent.id,
        },
      });

      const token = generateVerificationToken();

      const ONE_DAY_IN_SECONDS = 86400;
      const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      await saveVerificationToken({
        identifier: JSON.stringify({
          parentId: ctx.session.user.id,
          email: input.email,
        }),
        token: hashToken(token),
        expires: expires,
      });

      const params = new URLSearchParams({
        token,
        parentId: ctx.session.user.id,
        email: input.email,
        type: 'Child',
      });

      await sendEmailWrapper({
        to: childConfig.email,
        template: 'register_invitation',
        props: {
          link: `${env.APP_URL}/register-invite?${params}`,
          from: 'Parent',
          fromName: childConfig.name,
        },
      });

      ctx.log.info('new child created', { childConfig });

      return 'OK';
    },
  })
  .middleware(async ({ ctx, next, rawInput }) => {
    const inputSchema = z.object({
      address: z.string(),
    });
    const result = inputSchema.safeParse(rawInput);

    if (!result.success) throw new TRPCError({ code: 'BAD_REQUEST' });

    const child = await prisma.user.findFirst({
      where: {
        address: {
          equals: result.data.address,
          mode: 'insensitive',
        },
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

    return next({
      ctx: {
        ...ctx,
        child,
      },
    });
  })
  .query('childByAddress', {
    input: z.object({
      address: z.string(),
    }),
    resolve: ({ ctx }) => {
      return ctx.child;
    },
  });
