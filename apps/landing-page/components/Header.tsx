import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import CallToAction from './CallToAction';
import { ThemeToggler } from './ThemeToggler';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const { locale, asPath } = useRouter();

  return (
    <header className="absolute left-0 right-0 z-10 flex sm:px-4 md:px-0">
      <div className="my-4 flex w-full items-center justify-between px-4 md:my-8">
        <Link href="/">
          <a className="text-3xl font-bold md:text-5xl">Pocket.</a>
        </Link>
        <div className="flex items-center justify-center space-x-4 text-2xl lg:space-x-8">
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

          <div className="hidden items-center text-base sm:flex">
            <CallToAction
              url={'https://app.gopocket.co/'}
              msg={<FormattedMessage id={'launch_pocket'} />}
            />
          </div>
          <div className="flex items-center text-sm sm:hidden">
            <CallToAction
              url={'https://app.gopocket.co/'}
              msg={<FormattedMessage id={'launch_pocket'} />}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
