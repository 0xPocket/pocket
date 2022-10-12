import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from 'react-query/devtools';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { AuthProvider } from '../contexts/auth';
import { MagicConnector } from '../utils/MagicConnector';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import type { AppRouter } from '../server';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { httpLink } from '@trpc/client/links/httpLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { splitLink } from '@trpc/client/links/splitLink';
import { withTRPC } from '@trpc/next';
import { env } from 'config/env/client';
import { SessionProvider } from 'next-auth/react';
import fr from '../lang/fr.json';
import en from '../lang/en-US.json';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '../contexts/theme';
import type { Session } from 'next-auth';
import Script from 'next/script';

const messages = { fr, 'en-US': en };
export type IntlMessageID = keyof typeof en;

const { chains, provider } = configureChains(
  [env.WAGMI_CHAIN],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: env.RPC_URL,
      }),
    }),
  ],
);

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const { locale } = useRouter();

  const [wagmiClient] = useState(() =>
    createClient({
      autoConnect: true,
      provider,
      persister: null,
      connectors: [
        new MagicConnector({
          options: {
            apiKey: env.NEXT_PUBLIC_MAGIC_LINK_PUBLIC_KEY,
            additionalMagicOptions: {
              network: {
                rpcUrl: env.RPC_URL,
                chainId: env.CHAIN_ID,
              },
            },
          },
          chains: chains,
        }),
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
          },
        }),
      ],
    }),
  );

  return (
    <>
      <ThemeProvider>
        <IntlProvider
          locale={locale as 'fr' | 'en-US'}
          messages={messages[locale as 'fr' | 'en-US']}
        >
          <WagmiConfig client={wagmiClient}>
            <SessionProvider session={session}>
              <AuthProvider>
                <SmartContractProvider>
                  <Script src="/theme.js" strategy="beforeInteractive"></Script>
                  <Component {...pageProps} />
                  <ToastContainer
                    toastClassName="toast-container"
                    position="bottom-right"
                    autoClose={3000}
                  />
                  <ReactQueryDevtools />
                </SmartContractProvider>
              </AuthProvider>
            </SessionProvider>
          </WagmiConfig>
        </IntlProvider>
      </ThemeProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config() {
    const url =
      typeof window !== 'undefined' ? '/api/trpc' : `${env.APP_URL}/api/trpc`;

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
            !!env.NEXT_PUBLIC_DEBUG ||
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
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App);

export { reportWebVitals } from 'next-axiom';
