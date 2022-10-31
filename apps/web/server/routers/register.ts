import { Magic } from '@magic-sdk/admin';
import { sendEmailWrapper } from '@pocket/emails';
import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { env } from 'config/env/server';
import { SiweMessage } from 'siwe';
import { z } from 'zod';
import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
  useVerificationToken,
} from '../services/jwt';
import * as requestIp from 'request-ip';
import { grantPktToken } from '../services/grantPktToken';

const mAdmin = new Magic(env.MAGIC_LINK_SECRET_KEY);

export const registerRouter = createRouter()
  .mutation('magic', {
    input: z.object({
      invite: z
        .object({
          token: z.string(),
          childId: z.string(),
        })
        .optional(),
      name: z.string(),
      email: z.string().email(),
      didToken: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      let validInvite: typeof input.invite = undefined;

      if (input.invite) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const invite = await useVerificationToken({
          token: hashToken(input.invite.token),
          identifier: JSON.stringify({
            childId: input.invite.childId,
            email: input.email,
          }),
        });

        const invalidInvite = !invite || invite.expires.valueOf() < Date.now();

        if (invalidInvite) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid invite',
          });
        }

        validInvite = input.invite;
      }

      try {
        mAdmin.token.validate(input.didToken);
      } catch (e) {
        throw new Error('Invalid token');
      }

      const userAddress = mAdmin.token.getPublicAddress(input.didToken);
      const userMetadata = await mAdmin.users.getMetadataByPublicAddress(
        userAddress,
      );

      if (!userMetadata.email) {
        throw new Error('no email');
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: userMetadata.email,
            mode: 'insensitive',
          },
        },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ip = requestIp.getClientIp(ctx.req as any);

      if (env.NETWORK_KEY === 'polygon-mumbai') {
        await grantPktToken(userAddress);
      }

      const newUser = await prisma.user.create({
        data: {
          name: input.name,
          email: userMetadata.email,
          emailVerified: new Date(),
          address: userAddress,
          ipAddress: ip,
          type: 'Parent',
          accountType: 'Magic',
          parent: {
            create: {},
          },
        },
      });

      ctx.log.info('new register with magic', {
        email: userMetadata.email,
        address: userAddress,
      });

      if (validInvite) {
        await prisma.child.update({
          where: { userId: validInvite.childId },
          data: {
            parentUserId: newUser.id,
          },
        });

        const child = await prisma.user.findUnique({
          where: { id: validInvite.childId },
        });

        ctx.log.info('child linked', {
          parentEmail: newUser.email,
          childEmail: child?.email,
        });

        return {
          verifyEmail: false,
        };
      }

      return {
        verifyEmail: false,
      };
    },
  })
  .mutation('ethereum', {
    input: z.object({
      invite: z
        .object({
          token: z.string(),
          childId: z.string().optional(),
          parentId: z.string().optional(),
        })
        .optional(),
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
      signature: z.string(),
      type: z.enum(['Parent', 'Child']),
    }),
    resolve: async ({ input, ctx }) => {
      let validInvite: typeof input.invite = undefined;

      if (input.invite) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const invite = await useVerificationToken({
          token: hashToken(input.invite.token),
          identifier: input.invite.childId
            ? JSON.stringify({
                childId: input.invite.childId,
                email: input.email,
              })
            : JSON.stringify({
                parentId: input.invite.parentId,
                email: input.email,
              }),
        });

        const invalidInvite = !invite || invite.expires.valueOf() < Date.now();

        if (invalidInvite) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid invite',
          });
        }

        validInvite = input.invite;
      }

      const siwe = new SiweMessage(JSON.parse(input.message || '{}'));
      await siwe.validate(input.signature || '');

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: input.email,
                mode: 'insensitive',
              },
            },
            { address: { equals: siwe.address, mode: 'insensitive' } },
          ],
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This user already exists',
        });
      }

      const ip = requestIp.getClientIp(ctx.req as any);

      if (env.NETWORK_KEY === 'polygon-mumbai') {
        await grantPktToken(siwe.address);
      }

      let newUser: User;

      if (input.type === 'Parent') {
        newUser = await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            address: siwe.address,
            type: input.type,
            ipAddress: ip,
            accountType: 'Ethereum',
            parent: {
              create: {},
            },
          },
        });
      } else {
        newUser = await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            address: siwe.address,
            type: input.type,
            ipAddress: ip,
            accountType: 'Ethereum',
            child: {
              create: {},
            },
          },
        });
      }

      ctx.log.info('new register with ethereum', {
        email: newUser.email,
        address: newUser.address,
        type: newUser.type,
      });

      if (validInvite) {
        if (validInvite.childId) {
          await prisma.child.update({
            where: { userId: validInvite.childId },
            data: {
              parentUserId: newUser.id,
            },
          });
          const child = await prisma.user.findUnique({
            where: { id: validInvite.childId },
          });

          ctx.log.info('child linked', {
            parentEmail: newUser.email,
            childEmail: child?.email,
          });
        } else {
          await prisma.child.update({
            where: { userId: newUser.id },
            data: {
              parentUserId: validInvite.parentId,
            },
          });

          const parent = await prisma.user.findUnique({
            where: { id: validInvite.parentId },
          });

          ctx.log.info('child linked', {
            parentEmail: parent?.email,
            childEmail: newUser.email,
          });

          const childConfig = await prisma.pendingChild.findFirst({
            where: {
              email: {
                equals: input.email,
                mode: 'insensitive',
              },
            },
          });

          if (childConfig) {
            await prisma.user.update({
              where: { id: newUser.id },
              data: {
                name: childConfig.name,
              },
            });

            await prisma.pendingChild.delete({
              where: {
                id: childConfig.id,
              },
            });
          }
        }

        await prisma.user.update({
          where: { id: newUser.id },
          data: {
            emailVerified: new Date(),
          },
        });

        return {
          verifyEmail: false,
        };
      }

      const token = generateVerificationToken();
      const ONE_DAY_IN_SECONDS = 86400;
      const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

      await saveVerificationToken({
        identifier: newUser.email,
        expires,
        token: hashToken(token),
      });

      const params = new URLSearchParams({ token, email: newUser.email });

      await sendEmailWrapper({
        to: newUser.email,
        template: 'email_verification',
        props: {
          name: newUser.name,
          link: `${env.APP_URL}/verify-email?${params}`,
        },
      });

      return {
        verifyEmail: true,
      };
    },
  });
