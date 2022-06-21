import { ThemeToggler } from '@lib/ui';

type HeaderProps = {};

function Header({}: HeaderProps) {
  return (
    <header className="absolute left-0 right-0 z-10 flex ">
      <div className="container mx-auto flex h-28 w-full items-center justify-between">
        <h1>Pocket.</h1>
        <ThemeToggler />
      </div>
    </header>
  );
}

export default Header;
