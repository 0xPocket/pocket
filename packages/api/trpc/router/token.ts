import { TokenSchema } from "../../schemas";
import { protectedProcedure } from "../procedures";
import { t } from "../trpc";

export const tokenRouter = t.router({
  blacklist: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.blacklistToken.findMany({
      where: {
        verified: true,
      },
    });
  }),

  report: protectedProcedure
    .input(TokenSchema.report)
    .mutation(({ input, ctx }) => {
      ctx.log.info("new token reported", input);
      return ctx.prisma.blacklistToken.upsert({
        where: {
          address: input.address,
        },
        create: {
          address: input.address,
          verified: false,
        },
        update: {
          verified: false,
        },
      });
    }),
});
