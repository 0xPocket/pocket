import type { AppProps } from 'next/app';
import { AuthProvider } from '@lib/nest-auth/next';
import config from '../next-auth.config';
import '../styles/globals.css';

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <AuthProvider config={config}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
