import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';
import { TicketSchema } from '../schemas';

export const ticketRouter = createProtectedRouter().mutation('submit', {
  input: TicketSchema['submit'],
  resolve: async ({ ctx, input }) => {
    return prisma.ticket.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
  },
});
