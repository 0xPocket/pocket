import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@lib/ui';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AlchemyProvider } from '../contexts/alchemy';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { MagicAuthProvider } from '../contexts/auth';
import { MagicConnector } from '../utils/MagicConnector';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import type { AppRouter } from '@lib/trpc';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { httpLink } from '@trpc/client/links/httpLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';

const { chains, provider } = configureChains(
  [chain.polygon],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `http://localhost:8545`,
      }),
    }),
    // alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_KEY_ALCHEMY_POLYGON }),
    // publicProvider(),
  ],
);

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 600 * 1000,
            cacheTime: 600 * 1000,
          },
        },
      }),
  );
  const [wagmiClient] = useState(() =>
    createClient({
      autoConnect: true,
      provider,
      connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
          },
        }),
        new MagicConnector({
          options: {
            apiKey: 'pk_live_4752F69D8DDF4CF5',
            oauthOptions: {
              providers: ['facebook', 'google'],
            },
            additionalMagicOptions: {
              network: {
                rpcUrl: 'http://localhost:8545',
                chainId: 137,
              },
            },
          },
          chains: chains,
        }),
      ],
    }),
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <MagicAuthProvider>
            <AlchemyProvider>
              <ThemeProvider>
                <SmartContractProvider>
                  <Component {...pageProps} />
                </SmartContractProvider>
              </ThemeProvider>
              <ToastContainer position="bottom-right" autoClose={3000} />
            </AlchemyProvider>
            <ReactQueryDevtools />
          </MagicAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default withTRPC<AppRouter>({
  config() {
    const url =
      typeof window !== 'undefined'
        ? '/api/trpc'
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/api/trpc`
        : `http://${process.env.NEXT_PUBLIC_WEB_URL}/api/trpc`;

    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            !!process.env.NEXT_PUBLIC_DEBUG ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          // check for context property `skipBatch`
          condition: (op) => {
            return op.context.skipBatch === true;
          },
          // when condition is true, use normal request
          true: httpLink({ url }),
          // when condition is false, use batching
          false: httpBatchLink({
            url,
            /** @link https://github.com/trpc/trpc/issues/2008 */
            // maxBatchSize: 7
          }),
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);

// export default App;
