import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import { ReactElement, ReactNode, useState } from 'react';
import { NextPage } from 'next';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { AuthProvider } from '../contexts/auth';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

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
  ],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
