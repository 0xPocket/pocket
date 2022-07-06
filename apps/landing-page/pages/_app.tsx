import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import fr from '../lang/fr.json';
import en from '../lang/en-US.json';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

const messages = { fr, 'en-US': en };
function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const { locale } = useRouter();

  return (
    <IntlProvider
      locale={locale as 'fr' | 'en-US'}
      messages={messages[locale as 'fr' | 'en-US']}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <SEO />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}

export default App;
