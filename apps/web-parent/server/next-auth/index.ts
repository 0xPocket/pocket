import type { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Magic } from '@magic-sdk/admin';
import { SiweMessage } from 'siwe';
import { UserType } from '@prisma/client';
import { prisma } from '../prisma';

const mAdmin = new Magic('sk_live_8185E1937878AC9A');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
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
              parent: {
                create: {},
              },
            },
          });

          return {
            id: newUser.id,
            email: userMetadata.email,
            address: userAddress,
            type: newUser.type,
            isNewUser: newUser.newUser,
          };
        }

        return {
          id: existingUser.id,
          email: userMetadata.email,
          address: userAddress,
          name: existingUser.name,
          type: existingUser.type,
          isNewUser: existingUser.newUser,
        };
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
        try {
          if (!credentials) {
            throw new Error('no credentials');
          }

          const { message, signature, type } = credentials;

          if (type !== UserType.Parent && type !== UserType.Child) {
            throw new Error('invalid type');
          }

          console.log('test0');

          const siwe = new SiweMessage(JSON.parse(message || '{}'));
          await siwe.validate(signature || '');

          const existingUser = await prisma.user.findUnique({
            where: { address: siwe.address },
          });

          console.log('test1');

          if (!existingUser && type === UserType.Child) {
            throw new Error('Your parent must create your account.');
          }

          console.log('test2');

          if (existingUser && existingUser.type !== type) {
            throw new Error(
              `You must sign in with the ${existingUser.type} form.`,
            );
          }

          console.log('test3');

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                address: siwe.address,
                type: 'Parent',
              },
            });

            return {
              id: newUser.id,
              address: siwe.address,
              type: newUser.type,
              isNewUser: newUser.newUser,
            };
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            address: siwe.address,
            name: existingUser.name,
            type: existingUser.type,
            isNewUser: existingUser.newUser,
          };
        } catch (e) {
          return null;
        }
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
    signIn: async ({ user, account }) => {
      // console.log("SIGN IN CALLBACK");
      // console.log("account", account);
      // console.log("user", user);

      return true;
    },
    session: async ({ session, token, user }) => {
      // console.log("SESSION CALLBACK");
      // console.log("session", session);
      // console.log("token", token);
      // console.log("user", user);
      // console.log(token);
      const newSession: Session = {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          type: token.type as 'Parent' | 'Child',
          id: token.sub as string,
        },
      };
      return newSession;
    },
    jwt: async ({ token, account, user }) => {
      console.log('==== JWT CALLBACK ====');
      // console.log("token", token); //name, email, picture, sub (id)
      // console.log("account", account);
      // console.log("user", user); // user from return

      if (token.isNewUser) {
        const checkUser = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
        });

        if (checkUser?.newUser) {
          console.log('New user, we keep the token', token);
          return token;
        } else {
          console.log('Wet set a new token');
          token = {
            ...token,
            type: checkUser?.type,
            name: checkUser?.name,
            isNewUser: false,
          };
          return token;
        }
      }
      // console.log("NO");

      if (user) {
        console.log('Wet set a the user from scratch');

        token = {
          ...token,
          type: user.type,
          name: user.name,
          isNewUser: user.isNewUser,
        };
      }

      return token;
    },
  },
};
