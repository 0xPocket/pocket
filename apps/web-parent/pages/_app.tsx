import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { Web3Provider } from '@ethersproject/providers';
import { SmartContractProvider } from '../contexts/contract';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider config={config}>
        <SmartContractProvider>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </SmartContractProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
