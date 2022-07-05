import type { AppProps } from 'next/app';
import { ThemeProvider } from '@lib/ui';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import fr from '../lang/fr.json';
import en from '../lang/en-Us.json';
import { useRouter } from 'next/router';

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
          <NextSeo
            title={`L'argent de poche du web3 | Pocket`}
            description={`Pas besoin de tout comprendre aux cryptomonnaies pour en donner à ses ados. Achetez et distribuez de l'argent de poche à vos enfants en un clic.`}
            twitter={{
              handle: '@0xPocket',
              site: 'https://gopocket.fr',
              cardType: 'summary_large_image',
            }}
            openGraph={{
              url: 'https://gopocket.fr',
              title: "L'argent de poche du web3 | Pocket",
              description:
                "Pas besoin de tout comprendre aux cryptomonnaies pour en donner à ses ados. Achetez et distribuez de l'argent de poche à vos enfants en un clic.",
              images: [
                {
                  url: 'https://gopocket.fr/assets/PocketOGImage.png',
                  width: 800,
                  height: 600,
                  alt: "Pocket, L'argent de poche du web3",
                  type: 'image/jpeg',
                },
              ],
              site_name: 'Pocket',
            }}
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}

export default App;
