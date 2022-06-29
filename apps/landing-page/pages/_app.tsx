import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { NextSeo } from 'next-seo';

config.autoAddCss = false;

function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <ThemeProvider>
      <NextSeo
        title={`L'argent de poche du web3 | Pocket`}
        description={`Pas besoin de tout comprendre aux cryptomonnaies pour en donner à ses ados. Achetez et distribuez de l'argent de poche à vos enfants en un clic.`}
        twitter={{ handle: '@0xPocket', site: 'http://gopocket.fr' }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default App;
