import { ThemeToggler } from '@lib/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const { locale, asPath } = useRouter();

  return (
    <header className="absolute left-0 right-0 z-10 flex px-4 md:px-0">
      <div className="flex h-28 w-full items-center justify-between">
        <Link href="/">
          <a className="text-5xl font-bold">Pocket.</a>
        </Link>
        <div className="flex items-center justify-center gap-8 text-2xl">
          <div>
            {locale === 'fr' ? (
              <Link href={asPath} locale="en-US">
                <a>🇺🇸</a>
              </Link>
            ) : (
              <Link href={asPath} locale="fr">
                <a>🇫🇷</a>
              </Link>
            )}
          </div>
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export default Header;
