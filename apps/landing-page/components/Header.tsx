import { ThemeToggler } from '@lib/ui';
import Link from 'next/link';

type HeaderProps = {};

function Header({}: HeaderProps) {
  return (
    <header className="absolute left-0 right-0 z-10 flex px-4 md:px-0">
      <div className="flex h-28 w-full items-center justify-between">
        <Link href="/">
          <a className="text-5xl font-bold">Pocket.</a>
        </Link>
        <ThemeToggler />
      </div>
    </header>
  );
}

export default Header;
