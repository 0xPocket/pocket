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
import { ThemeProvider } from '../contexts/themeContext';
import { WalletProvider } from '../contexts/wallet';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider config={config}>
        <ThemeProvider>
          <WalletProvider>
            <SmartContractProvider>
              <Provider store={store}>
                <Component {...pageProps} />
              </Provider>
            </SmartContractProvider>
          </WalletProvider>
        </ThemeProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
