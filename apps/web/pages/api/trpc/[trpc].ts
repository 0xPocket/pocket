/**
 * This file contains tRPC's HTTP response handler
 */

import { createNextApiHandler } from '@trpc/server/adapters/next';
import { withAxiom } from 'next-axiom';
import { appRouter } from '../../../server';
import { createContext } from '../../../server';

export default withAxiom(
  createNextApiHandler({
    router: appRouter,
    /**
     * @link https://trpc.io/docs/context
     */
    createContext,
    /**
     * @link https://trpc.io/docs/error-handling
     */
    onError({ error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        // send to bug reporting
        console.error('Something went wrong', error);
      }
    },
    /**
     * Enable query batching
     */
    batching: {
      enabled: true,
    },
  }),
);
