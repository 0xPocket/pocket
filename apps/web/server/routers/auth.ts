import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from '../services/jwt';
import { sendEmail } from '../services/sendMail';
import { TRPCError } from '@trpc/server';
import { unstable_getServerSession } from 'next-auth';
import { createProtectedRouter } from '../createRouter';
import { authOptions } from '../next-auth';
import { prisma } from '../prisma';
import { AuthSchema } from '../schemas/auth.schema';
import { User } from '@prisma/client';

export const authRouter = createProtectedRouter().mutation('onboard', {
  input: AuthSchema.onboard,
  resolve: async ({ ctx, input }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user?.email && !input.email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email is required',
      });
    }

    // ! Handle only user with email for now

    const updatedUser: User = await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        name: input.name,
        email: ctx.session.user.email || input.email,
        newUser: false,
      },
    });

    if (!updatedUser.emailVerified) {
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
        to: updatedUser.email!,
        template: 'email_verification',
        context: {
          name: updatedUser.name,
          // TODO: Use correct URL from production
          url: process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}/verify-email?${params}`
            : `http://localhost:3000/verify-email?${params}`,
        },
      });
    }

    // We force settings a new token
    if (ctx.req && ctx.res) {
      await unstable_getServerSession(ctx.req!, ctx.res!, authOptions);
    }

    return updatedUser;
  },
});
