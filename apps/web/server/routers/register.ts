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
} from '../services/jwt';
import * as requestIp from 'request-ip';

const mAdmin = new Magic(env.MAGIC_LINK_SECRET_KEY);

const PRIVATE_BETA = true;

export const registerRouter = createRouter()
  .mutation('magic', {
    input: z.object({
      token: z.string().optional(),
      name: z.string(),
      email: z.string().email(),
      didToken: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      if (PRIVATE_BETA && !input.token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You need a token to register',
        });
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

      const existingUser = await prisma.user.findUnique({
        where: { email: userMetadata.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      if (PRIVATE_BETA) {
        const token = await prisma.privateBetaToken.findUnique({
          where: { token: input.token },
        });

        if (!token || token.used) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid token',
          });
        }

        await prisma.privateBetaToken.update({
          data: {
            used: true,
            identifier: userMetadata.email,
          },
          where: {
            token: input.token,
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ip = requestIp.getClientIp(ctx.req as any);

      console.log('ip', ip);

      return prisma.user.create({
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
    },
  })
  .mutation('ethereum', {
    input: z.object({
      token: z.string().optional(),
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
      signature: z.string(),
      type: z.enum(['Parent', 'Child']),
    }),
    resolve: async ({ input, ctx }) => {
      if (PRIVATE_BETA && !input.token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You need a token to register',
        });
      }

      const siwe = new SiweMessage(JSON.parse(input.message || '{}'));
      await siwe.validate(input.signature || '');

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: input.email }, { address: siwe.address }] },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This user already exists',
        });
      }

      if (PRIVATE_BETA) {
        const token = await prisma.privateBetaToken.findUnique({
          where: { token: input.token },
        });

        if (!token || token.used) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid token',
          });
        }

        await prisma.privateBetaToken.update({
          data: {
            used: true,
            identifier: input.email,
          },
          where: {
            token: input.token,
          },
        });
      }

      const ip = requestIp.getClientIp(ctx.req as any);

      console.log('ip', ip);

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
        // newUser = await prisma.user.create({
        //   data: {
        //     address: siwe.address,
        //     type: input.type,
        //     accountType: 'Ethereum',
        //     child: {
        //       create: {},
        //     },
        //   },
        // });
        throw new Error('Not implemented');
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

      return newUser;
    },
  });
