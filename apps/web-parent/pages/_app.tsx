import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';
import { SmartContractProvider } from '../contexts/contract';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <AuthProvider config={config}>
      <SmartContractProvider>
        <Component {...pageProps} />
      </SmartContractProvider>
    </AuthProvider>
  );
}

export default App;
