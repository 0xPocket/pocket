import { NextSeo } from 'next-seo';
import { useIntl } from 'react-intl';

type SEOProps = {};

function SEO({}: SEOProps) {
  const intl = useIntl();

  const title = intl.formatMessage({ id: 'head.title' });
  const description = intl.formatMessage({ id: 'head.description' });
  const alt = intl.formatMessage({ id: 'head.alt' });
  const img_url =
    intl.locale === 'fr'
      ? 'https://pocket-eu.s3.eu-west-3.amazonaws.com/PocketOGImage.png'
      : 'https://pocket-eu.s3.eu-west-3.amazonaws.com/PocketOGImage_en.png';

  return (
    <NextSeo
      title={title}
      description={description}
      twitter={{
        handle: '@0xPocket',
        site: 'https://gopocket.fr',
        cardType: 'summary_large_image',
      }}
      openGraph={{
        url: 'https://gopocket.fr',
        title: title,
        description: description,
        images: [
          {
            url: img_url,
            width: 800,
            height: 600,
            alt: alt,
            type: 'image/jpeg',
          },
        ],
        site_name: 'Pocket',
      }}
    />
  );
}

export default SEO;
