import { TRPCError } from "@trpc/server";
import { createProtectedRouter } from "../createRouter";
import { UserSchema } from "../schemas/user.schema";

export const userRouter = createProtectedRouter().mutation("onboard", {
  input: UserSchema.onboard,
  resolve: async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user?.email && !input.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email is required",
      });
    }

    // ! Handle only user with email for now

    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        name: input.name,
        email: ctx.session.user.email || input.email,
        newUser: false,
      },
    });

    return updatedUser;
  },
});
