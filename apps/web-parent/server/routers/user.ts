import { TRPCError } from '@trpc/server';
import { unstable_getServerSession } from 'next-auth';
import { createProtectedRouter } from '../createRouter';
import { authOptions } from '../next-auth';
import { prisma } from '../prisma';
import { UserSchema } from '../schemas/user.schema';

export const userRouter = createProtectedRouter().mutation('onboard', {
  input: UserSchema.onboard,
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

    const updatedUser = await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        name: input.name,
        email: ctx.session.user.email || input.email,
        newUser: false,
      },
    });

    // We force settings a new token
    if (ctx.req && ctx.res) {
      await unstable_getServerSession(ctx.req!, ctx.res!, authOptions);
    }

    return updatedUser;
  },
});
