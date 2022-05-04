import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { Web3Provider } from '@ethersproject/providers';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <AuthProvider config={config}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
