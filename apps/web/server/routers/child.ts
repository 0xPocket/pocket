import { TRPCError } from '@trpc/server';
import { createProtectedRouter } from '../createRouter';

export const childRouter = createProtectedRouter().middleware(
  ({ ctx, next }) => {
    if (ctx.session.user.type !== 'Child') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must be a Child to access those routes',
      });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `user` and `session` are non-nullable to downstream procedures
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            type: 'Child' as const,
          },
        },
      },
    });
  },
);
