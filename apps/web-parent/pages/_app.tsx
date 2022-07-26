import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from '../contexts/wallet';
import { ThemeProvider } from '@lib/ui';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AlchemyProvider } from '../contexts/alchemy';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyProvider>
        <AuthProvider config={config}>
          <ThemeProvider>
            <WalletProvider>
              <SmartContractProvider>
                <Component {...pageProps} />
              </SmartContractProvider>
            </WalletProvider>
          </ThemeProvider>
        </AuthProvider>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AlchemyProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
