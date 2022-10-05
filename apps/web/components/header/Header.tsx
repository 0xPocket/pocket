import { useAuth } from '../../contexts/auth';
import WalletPopover from '../wallet/WalletPopover';
import DropdownMenu from './DropdownMenu';
import { Header } from '../common/HeaderComponent';

function GlobalHeader() {
  const { loggedIn } = useAuth();

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
