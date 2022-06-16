import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from '../contexts/wallet';
import { ThemeProvider } from '@lib/ui';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const alchemyId = '3yzPlXcA41Y49wI2INbE3q8kLi19ME2U';

const { provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [alchemyProvider({ alchemyId })],
);

const client = createClient({
  autoConnect: true,
  provider,
});

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider config={config}>
        <WagmiConfig client={client}>
          <ThemeProvider>
            <WalletProvider>
              <SmartContractProvider>
                <Provider store={store}>
                  <Component {...pageProps} />
                </Provider>
              </SmartContractProvider>
            </WalletProvider>
          </ThemeProvider>
        </WagmiConfig>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
