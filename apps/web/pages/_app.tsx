/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { MagicConnector } from '../utils/MagicConnector';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { env } from 'config/env/client';
import { SessionProvider } from 'next-auth/react';
import fr from '../lang/fr.json';
import en from '../lang/en-US.json';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '../contexts/theme';
import type { Session } from 'next-auth';
import Script from 'next/script';
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const messages = { fr, 'en-US': en };
export type IntlMessageID = keyof typeof en;

const chains_map = {
  'polygon-mainnet': chain.polygon,
  'polygon-mumbai': chain.polygonMumbai,
};

const { chains, provider } = configureChains(
  [chains_map[env.NETWORK_KEY]],
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
  const [client] = useState(new QueryClient());

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
    <ThemeProvider>
      <IntlProvider
        locale={locale as 'fr' | 'en-US'}
        messages={messages[locale as 'fr' | 'en-US']}
      >
        <WagmiConfig client={wagmiClient}>
          <QueryClientProvider client={client}>
            <SessionProvider session={session}>
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
            </SessionProvider>
          </QueryClientProvider>
        </WagmiConfig>
      </IntlProvider>
    </ThemeProvider>
  );
}

export default trpc.withTRPC(App);

export { reportWebVitals } from 'next-axiom';
