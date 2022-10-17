import Link from 'next/link';
import { useRouter } from 'next/router';
import CallToAction from './CallToAction';
import { ThemeToggler } from './ThemeToggler';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const { locale, asPath } = useRouter();

  return (
    <header className="absolute left-0 right-0 z-10 flex px-4 md:px-0">
      <div className="my-4 flex w-full items-center justify-between md:my-8">
        <Link href="/">
          <a className=" text-4xl font-bold md:text-5xl">Pocket.</a>
        </Link>
        <div className="flex items-center justify-center space-x-8 text-2xl">
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
          <ThemeToggler className="h-6 w-6 cursor-pointer md:h-8 md:w-8" />

          <div className="flex items-center  gap-8 text-base">
            <Link href="https://app.gopocket.co">
              <button className="action-btn">Sign In</button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
