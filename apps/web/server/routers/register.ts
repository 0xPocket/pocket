import { Magic } from '@magic-sdk/admin';
import { sendEmailWrapper } from '@pocket/emails';
import { User } from '@prisma/client';
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

const mAdmin = new Magic(env.MAGIC_LINK_SECRET_KEY);

export const registerRouter = createRouter()
  .mutation('magic', {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      didToken: z.string(),
    }),
    resolve: async ({ input }) => {
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

      return prisma.user.create({
        data: {
          email: userMetadata.email,
          emailVerified: new Date(),
          address: userAddress,
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
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
      signature: z.string(),
      type: z.enum(['Parent', 'Child']),
    }),
    resolve: async ({ input }) => {
      const siwe = new SiweMessage(JSON.parse(input.message || '{}'));
      await siwe.validate(input.signature || '');

      const existingUser = await prisma.user.findUnique({
        where: { address: siwe.address },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      let newUser: User;

      if (input.type === 'Parent') {
        newUser = await prisma.user.create({
          data: {
            email: input.email,
            address: siwe.address,
            type: input.type,
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

      // TODO: make email and name mandatory
      if (!newUser.email || !newUser.name) {
        throw new Error('No email');
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
