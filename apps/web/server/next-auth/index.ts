import type { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Magic } from '@magic-sdk/admin';
import { SiweMessage } from 'siwe';
import { UserType } from '@prisma/client';
import { prisma } from '../prisma';
import { env } from '../env';

const mAdmin = new Magic('sk_live_8185E1937878AC9A');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          console.error(e);
          return null;
        }

        const userAddress = mAdmin.token.getPublicAddress(credentials.token);
        const userMetadata = await mAdmin.users.getMetadataByPublicAddress(
          userAddress,
        );

        if (!userMetadata.email) {
          throw new Error('no email');
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: userMetadata.email },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
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

          return newUser;
        }

        if (existingUser.accountType !== 'Magic') {
          throw new Error(
            'Your email is already linked to an Ethereum Wallet.',
          );
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
        type: {
          label: 'Type',
          type: 'text',
          placeholder: 'Parent',
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('no credentials');
        }

        const { message, signature, type } = credentials;

        if (type !== UserType.Parent && type !== UserType.Child) {
          throw new Error('Invalid User Type');
        }

        const siwe = new SiweMessage(JSON.parse(message || '{}'));
        await siwe.validate(signature || '');

        const existingUser = await prisma.user.findUnique({
          where: { address: siwe.address },
        });

        if (!existingUser && type === UserType.Child) {
          throw new Error('Your parent must create your account.');
        }

        // console.log('test2');

        // if (existingUser && existingUser.type !== type) {
        //   throw new Error(
        //     `You must sign in with the ${existingUser.type} form.`,
        //   );
        // }

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              address: siwe.address,
              type: 'Parent',
              accountType: 'Ethereum',
              parent: {
                create: {},
              },
            },
          });

          return newUser;
        }

        if (existingUser?.accountType !== 'Ethereum') {
          throw new Error('Your email is linked to a Magic Wallet.');
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
          emailVerified: !!token.emailVerified,
          newUser: token.newUser,
          type: token.type,
          id: token.sub!,
        },
      };
      return newSession;
    },
    jwt: async ({ token, user }) => {
      // console.log('==== JWT CALLBACK ====');
      // console.log("token", token); //name, email, picture, sub (id)
      // console.log("account", account);
      // console.log("user", user); // user from return

      if (token.newUser || !token.emailVerified) {
        const checkUser = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        });

        if (!checkUser) {
          return token;
        }

        return {
          ...token,
          type: checkUser.type,
          name: checkUser.name,
          newUser: checkUser.newUser,
          emailVerified: !!checkUser.emailVerified,
        };
      }
      // console.log("NO");

      if (user) {
        // console.log('Wet set a the user from scratch');

        return {
          ...token,
          type: user.type,
          name: user.name,
          newUser: user.newUser,
          emailVerified: !!user.emailVerified,
        };
      }

      return token;
    },
  },
};
