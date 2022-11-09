/**
 * This file contains tRPC's HTTP response handler
 */

import { withAxiom } from 'next-axiom';
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter, createContext } from '@pocket/api/trpc';

export default withAxiom(
  trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: createContext,
  }),
);
