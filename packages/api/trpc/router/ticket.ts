import { TicketSchema } from "../../schemas";
import { protectedProcedure } from "../procedures";
import { t } from "../trpc";

export const ticketRouter = t.router({
  submit: protectedProcedure
    .input(TicketSchema.submit)
    .mutation(({ input, ctx }) => {
      ctx.log.info("new ticket submitted");
      return ctx.prisma.ticket.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
