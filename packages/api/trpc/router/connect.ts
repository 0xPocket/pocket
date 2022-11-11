import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../trpc";

export const connectRouter = t.router({
  connect: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: {
            equals: input.email,
            mode: "insensitive",
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found.",
        });
      }

      if (user.accountType === "Ethereum") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must connect with your wallet.",
        });
      }

      return true;
    }),
});
