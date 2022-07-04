import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { AuthProvider } from '../contexts/auth';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

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

const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider>
      <WagmiConfig client={client}>
        <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
