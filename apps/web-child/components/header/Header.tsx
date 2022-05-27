import { Button, Header } from '@lib/ui';
import DarkModeToggle from './DarkModeToggle';
import { useWeb3Auth } from '../../contexts/web3hook';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, address, status, toggleModal, disconnect } = useWeb3Auth();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title title="Cassiope" />
        <Header.Nav show={status === 'authenticated'}>
          <Header.NavLink title="Dashboard" href="/dashboard" />
          <Header.NavLink title="Blog" href="#" />
          <Header.NavLink title="Dashboard" href="/dashboard" />
        </Header.Nav>
      </Header.BlockLeft>
      <Header.BlockRight>
        {status === 'authenticated' ? (
          <>
            {user?.firstName} ({address?.substring(0, 4)}...)
            <Button action={() => disconnect()}>Disconnect Wallet</Button>
          </>
        ) : (
          <Button action={() => toggleModal()}>Connect Wallet</Button>
        )}

        <DarkModeToggle />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
