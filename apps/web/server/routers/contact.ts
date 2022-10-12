import { createRouter } from '../createRouter';
import { prisma } from '../prisma';
import { ContactSchema } from '../schemas';

export const contactRouter = createRouter().mutation('submit', {
  input: ContactSchema['submit'],
  resolve: async ({ input, ctx }) => {
    ctx.log.info('new form contact submitted');
    return prisma.contact.create({
      data: {
        ...input,
        userId: ctx.session?.user.id,
      },
    });
  },
});
