import type { AppProps } from 'next/app';
import { SmartContractProvider } from '../contexts/contract';
import { Web3AuthProvider } from '../contexts/web3hook';
import '../styles/globals.css';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <Web3AuthProvider>
      <SmartContractProvider>
        <Component {...pageProps} />
      </SmartContractProvider>
    </Web3AuthProvider>
  );
}

export default App;
