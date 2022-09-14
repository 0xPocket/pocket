import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const LangToggler: FC = () => {
  const { locale, asPath } = useRouter();

  return (
    <div>
      {locale === 'en-US' ? (
        <Link href={asPath} locale="fr">
          <a className="text-2xl">🇫🇷</a>
        </Link>
      ) : (
        <Link href={asPath} locale="en-US">
          <a className="text-2xl">🇺🇸</a>
        </Link>
      )}
    </div>
  );
};

export default LangToggler;
