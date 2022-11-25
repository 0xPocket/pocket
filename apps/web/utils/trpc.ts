// src/utils/trpc.ts
import type { AppRouter } from '@pocket/api/trpc';
import { transformer } from '@pocket/api/transformer';
import { httpBatchLink, loggerLink } from '@trpc/client';

import { createTRPCNext } from '@trpc/next';
import { env } from 'config/env/client';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (env.APP_URL)
    // reference for vercel.com
    return `https://${env.APP_URL}`;
  // assume localhost
  return `http://localhost:3000`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 600 * 1000,
            cacheTime: 600 * 1000,
          },
        },
      },
    };
  },
  ssr: false,
});
