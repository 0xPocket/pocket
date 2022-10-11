import Head from 'next/head';
import type { FC } from 'react';
import { useIntl } from 'react-intl';

type TitleHelperProps = {
  id?: string;
  title?: string;
};

const TitleHelper: FC<TitleHelperProps> = ({ id, title }) => {
  const { formatMessage } = useIntl();

  if (id)
    return (
      <Head>
        <title>{`${formatMessage({
          id,
        })} | Pocket. `}</title>
      </Head>
    );

  if (title)
    return (
      <Head>
        <title>{`${title} | Pocket. `}</title>
      </Head>
    );

  return null;
};

export default TitleHelper;
