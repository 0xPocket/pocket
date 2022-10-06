import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Magic } from '@magic-sdk/admin';
import { SiweMessage } from 'siwe';
import { prisma } from '../prisma';
import { env } from 'config/env/server';

const mAdmin = new Magic(env.MAGIC_LINK_SECRET_KEY);

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Magic',
      id: 'magic',
      credentials: {
        token: { label: 'token', type: 'text', placeholder: 'token' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          mAdmin.token.validate(credentials.token);
        } catch (e) {
          throw new Error('Error validating your account');
        }

        const userAddress = mAdmin.token.getPublicAddress(credentials.token);
        const userMetadata = await mAdmin.users.getMetadataByPublicAddress(
          userAddress,
        );

        if (!userMetadata.email) {
          throw new Error('Error validating your account');
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: {
              equals: userMetadata.email,
              mode: 'insensitive',
            },
          },
        });

        if (!existingUser) {
          throw new Error('Account not found. Please sign up.');
        }

        return existingUser;
      },
    }),
    CredentialsProvider({
      name: 'Ethereum',
      id: 'ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('no credentials');
        }

        const { message, signature } = credentials;

        const siwe = new SiweMessage(JSON.parse(message || '{}'));

        try {
          await siwe.validate(signature || '');
        } catch (e) {
          throw new Error('The signature is invalid');
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            address: {
              equals: siwe.address,
              mode: 'insensitive',
            },
          },
        });

        if (!existingUser) {
          throw new Error('Account not found. Please sign up.');
        }

        if (!existingUser.emailVerified) {
          throw new Error(
            'Your email is not verified. Please use the link we sent you to verify it.',
          );
        }

        return existingUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/connect',
  },
  callbacks: {
    session: async ({ session, token }) => {
      const newSession: Session = {
        ...session,
        user: {
          ...session.user,
          address: token.address,
          type: token.type,
          id: token.sub!,
        },
      };
      return newSession;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          email: user.email,
          address: user.address,
          type: user.type,
          name: user.name,
        };
      }

      return token;
    },
  },
};
