import WalletPopover from '../wallet/WalletPopover';
import DropdownMenu from './DropdownMenu';
import { Header } from '../common/HeaderComponent';
import { env } from 'config/env/client';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../../hooks/useIsMounted';

function GlobalHeader() {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

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
        {isMounted && isConnected && <WalletPopover />}
        <DropdownMenu />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
