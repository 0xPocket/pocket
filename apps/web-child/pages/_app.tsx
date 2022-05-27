import type { AppProps } from 'next/app';
import { SmartContractProvider } from '../contexts/contract';
import { ThemeProvider } from '@lib/ui';
import { Web3AuthProvider } from '../contexts/web3hook';
import '../styles/globals.css';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <Web3AuthProvider>
      <ThemeProvider>
        <SmartContractProvider>
          <Component {...pageProps} />
        </SmartContractProvider>
      </ThemeProvider>
    </Web3AuthProvider>
  );
}

export default App;
