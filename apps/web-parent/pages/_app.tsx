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

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
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
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
