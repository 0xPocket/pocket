import { useAuth } from '../../contexts/auth';
import WalletPopover from '../wallet/WalletPopover';
import DropdownMenu from './DropdownMenu';
import { Header } from '../common/HeaderComponent';
import { env } from 'config/env/client';

function GlobalHeader() {
  const { loggedIn } = useAuth();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">
          Pocket.{' '}
          {env.NETWORK_KEY === 'polygon-mumbai' && (
            <span className="font-thin opacity-90">| Testnet</span>
          )}
        </Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        {loggedIn && <WalletPopover />}
        <DropdownMenu />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
