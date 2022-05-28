import { Button, Header, ThemeToggler } from '@lib/ui';
import { useWeb3Auth } from '../../contexts/web3hook';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, address, status, toggleModal, disconnect } = useWeb3Auth();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title>Child</Header.Title>
        <Header.Nav show={status === 'authenticated'}>
          <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
          <Header.NavLink href="#">Blog</Header.NavLink>
          <Header.NavLink href="#">FAQ</Header.NavLink>
        </Header.Nav>
      </Header.BlockLeft>
      <Header.BlockRight>
        {status === 'authenticated' ? (
          <>
            {user?.firstName} ({address?.substring(0, 4)}...){' '}
            <Button action={() => disconnect()}>Disconnect Wallet</Button>
          </>
        ) : (
          <Button action={() => toggleModal()}>Connect Wallet</Button>
        )}

        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
