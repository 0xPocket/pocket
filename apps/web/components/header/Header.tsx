// import Link from 'next/link';
import { Header, ThemeToggler } from '@lib/ui';
import Status from './Status';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        <Status />
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
