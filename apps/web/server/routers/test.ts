import { z } from 'zod';
import { createProtectedRouter } from '../createRouter';

export const testRouter = createProtectedRouter().mutation(
  'addAddressToWebhook',
  {
    input: z.object({
      address: z.string(),
    }),
    resolve: async ({ input }) => {
      return input.address;
    },
  },
);
