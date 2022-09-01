import { Header } from '@lib/ui';
import { useAccount } from 'wagmi';
import { useMagic } from '../../contexts/auth';
import WalletPopover from '../wallet/WalletPopover';
import DropdownMenu from './DropdownMenu';

function GlobalHeader() {
  const { loggedIn } = useMagic();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      {loggedIn && (
        <Header.BlockRight>
          <WalletPopover />
          <DropdownMenu />
        </Header.BlockRight>
      )}
    </Header>
  );
}

export default GlobalHeader;
