import { createProtectedRouter } from '../createRouter';
import { prisma } from '../prisma';

export const authRouter = createProtectedRouter()
  .query('session', {
    resolve: ({ ctx }) => {
      return ctx.session;
    },
  })
  .query('me', {
    resolve: ({ ctx }) => {
      return prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          child: { include: { parent: { include: { user: true } } } },
          parent: true,
        },
      });
    },
  });
