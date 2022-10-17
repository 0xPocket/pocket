import { NextSeo } from 'next-seo';
import { useIntl } from 'react-intl';

type SEOProps = {};

function SEO({}: SEOProps) {
  const intl = useIntl();

  const title = intl.formatMessage({ id: 'head.title' });
  const description = intl.formatMessage({ id: 'head.description' });

  return (
    <NextSeo
      title={title}
      description={description}
      twitter={{
        handle: '@0xPocket',
        site: 'https://gopocket.co',
        cardType: 'summary_large_image',

      }}
      openGraph={{
        url: 'https://gopocket.co',
        title: 'Web3 pocket money | Pocket',
        description: "No need to be an expert to hand cryptocurrency to your teenagers. Buy and give pocket money to your children with one click.",
        images: [
          {
            url: 'https://pocket-eu.s3.eu-west-3.amazonaws.com/PocketOGImage_en.png',
            width: 800,
            height: 600,
            alt: 'Pocket',
            type: 'image/jpeg',
          },
        ],
        site_name: 'Pocket',
      }}
    />
  );
}

export default SEO;
