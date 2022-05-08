import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { Web3Provider } from '@ethersproject/providers';
import { SmartContractProvider } from '../contexts/contract';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <AuthProvider config={config}>
      <SmartContractProvider>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </SmartContractProvider>
    </AuthProvider>
  );
}

export default App;
