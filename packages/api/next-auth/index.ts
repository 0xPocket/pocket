import type { NextAuthOptions, Session } from "next-auth";
import { getCsrfToken } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { prisma } from "@lib/prisma";
import { env } from "config/env/server";
import { verifyDidToken } from "../trpc/services/magic";
import type { IncomingMessage } from "http";

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      name: "Magic",
      id: "magic",
      credentials: {
        token: { label: "token", type: "text", placeholder: "token" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const userMetadata = await verifyDidToken(credentials.token);

        if (!userMetadata) {
          throw new Error("Error validating your account");
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: {
              equals: userMetadata.email,
              mode: "insensitive",
            },
          },
        });

        if (!existingUser) {
          throw new Error("Account not found. Please sign up.");
        }

        return existingUser;
      },
    }),
    CredentialsProvider({
      name: "Ethereum",
      id: "ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("no credentials");
        }

        const { message, signature } = credentials;

        const siwe = new SiweMessage(JSON.parse(message || "{}"));

        // const nextAuthUrl =
        //   env.NEXTAUTH_URL ||
        //   (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null);

        // if (!nextAuthUrl) {
        //   throw new Error("Invalid domain");
        // }

        // TODO: reimplement
        // const nextAuthHost = new URL(nextAuthUrl).host;

        // if (siwe.domain !== nextAuthHost) {
        //   throw new Error("Invalid domain");
        // }

        if (siwe.nonce !== (await getCsrfToken({ req }))) {
          throw new Error("Invalid nonce");
        }

        try {
          await siwe.validate(signature || "");
        } catch (e) {
          throw new Error("The signature is invalid");
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            address: {
              equals: siwe.address,
              mode: "insensitive",
            },
          },
        });

        if (!existingUser) {
          throw new Error("Account not found. Please sign up.");
        }

        if (!existingUser.emailVerified) {
          throw new Error(
            "Your email is not verified. Please use the link we sent you to verify it."
          );
        }

        return existingUser;
      },
    }),
  ];

  return {
    secret: env.NEXTAUTH_SECRET,
    providers,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/connect",
    },
    callbacks: {
      async redirect({ baseUrl, url }) {
        const redirectUrl = decodeURIComponent(url);
        const callbackIndex = redirectUrl.indexOf("callbackUrl=");
        if (callbackIndex > -1) {
          const callbackPath = redirectUrl.slice(callbackIndex + 12);
          // If I try to login from my homepage, the nested callbackUrl contains the full baseUrl.
          // This behavior seems to be triggerd if you call `signIn()` from a page.
          return callbackPath.includes(baseUrl)
            ? callbackPath
            : baseUrl + callbackPath;
        }
        return url;
      },
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
}
