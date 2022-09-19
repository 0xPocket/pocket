import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

const LangToggler: FC = () => {
  const { locale, asPath, push } = useRouter();

  return (
    <div>
      {locale === 'en-US' ? (
        <button
          onClick={() => {
            document.cookie = 'NEXT_LOCALE=fr; path=/; max-age=31536000';
            push(asPath, asPath, { locale: 'fr' });
          }}
        >
          <a className="text-2xl">🇫🇷</a>
        </button>
      ) : (
        <button
          onClick={() => {
            document.cookie = 'NEXT_LOCALE=en-US; path=/; max-age=31536000';
            push(asPath, asPath, { locale: 'en-US' });
          }}
        >
          <a className="text-2xl">🇺🇸</a>
        </button>
      )}
    </div>
  );
};

export default LangToggler;
