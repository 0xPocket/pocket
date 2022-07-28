import { GetServerSidePropsContext } from 'next';
import { createSSGHelpers } from '@trpc/react/ssg';
import { appRouter, createContext } from '@lib/trpc';
import * as superjson from 'superjson';

/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssrInit(context: GetServerSidePropsContext) {
  const ssr = createSSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: await createContext(context),
  });

  return ssr;
}
