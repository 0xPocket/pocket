import { ThemeToggler } from '@lib/ui';

type HeaderProps = {};

function Header({}: HeaderProps) {
  return (
    <header className="flex border-dark bg-bright dark:bg-dark">
      <div className="container mx-auto flex h-28 w-full items-center justify-between">
        <h1>Pocket.</h1>
        <ThemeToggler />
      </div>
    </header>
  );
}

export default Header;
