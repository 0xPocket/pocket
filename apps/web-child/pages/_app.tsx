import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

/*
  TODO: In env variable
 */

const alchemyId = '3yzPlXcA41Y49wI2INbE3q8kLi19ME2U';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon],
  [alchemyProvider({ alchemyId })],
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider>
      <WagmiConfig client={client}>
        {getLayout(<Component {...pageProps} />)}
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
