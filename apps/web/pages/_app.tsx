import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { env } from 'config/env/client';
import { SessionProvider } from 'next-auth/react';
import fr from '../lang/fr.json';
import en from '../lang/en-US.json';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import type { Session } from 'next-auth';
import { trpc } from '../utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  ledgerWallet,
  braveWallet,
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

import '@rainbow-me/rainbowkit/styles.css';

const messages = { fr, 'en-US': en };
export type IntlMessageID = keyof typeof en;

const chains_map = {
  'polygon-mainnet': chain.polygon,
  'polygon-mumbai': chain.polygonMumbai,
};

import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { MagicConnector } from '../utils/MagicConnector';
import { RainbowKitSiweNextAuthProvider } from '../contexts/RainbowKitNextAuthProvider';

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

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: 'Pocket', chains }),
      braveWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const { locale, route } = useRouter();
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
        ...connectors(),
      ],
    }),
  );

  return (
    <IntlProvider
      locale={locale as 'fr' | 'en-US'}
      messages={messages[locale as 'fr' | 'en-US']}
    >
      <WagmiConfig client={wagmiClient}>
        <SessionProvider session={session}>
          <RainbowKitSiweNextAuthProvider enabled={route === '/connect'}>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
              <QueryClientProvider client={client}>
                <SmartContractProvider>
                  <Component {...pageProps} />
                  <ToastContainer
                    toastClassName="toast-container"
                    position="bottom-right"
                    autoClose={3000}
                  />
                  <ReactQueryDevtools />
                </SmartContractProvider>
              </QueryClientProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </IntlProvider>
  );
}

export default trpc.withTRPC(App);

export { reportWebVitals } from 'next-axiom';
