import { Button, Header, ThemeToggler } from '@lib/ui';
import { useAccount } from 'wagmi';
import { useAuth } from '../../contexts/auth';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { address, isConnected } = useAccount();
  const { user, setShowModal, signOut } = useAuth();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title>Child</Header.Title>
        <Header.Nav show={false}>
          <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
          <Header.NavLink href="#">Blog</Header.NavLink>
          <Header.NavLink href="#">FAQ</Header.NavLink>
        </Header.Nav>
      </Header.BlockLeft>
      <Header.BlockRight>
        {user ? (
          <>
            <div>{user.web3Account.address}</div>
            <button className="bg-primary p-4" onClick={() => signOut()}>
              LOGOUT
            </button>
          </>
        ) : (
          <Button action={() => setShowModal(true)}>Connect Wallet</Button>
        )}
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );

  // return (
  //   <Header>
  //     <Header.BlockLeft>
  //       <Header.Title>Child</Header.Title>
  //       <Header.Nav show={status === 'authenticated'}>
  //         <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
  //         <Header.NavLink href="#">Blog</Header.NavLink>
  //         <Header.NavLink href="#">FAQ</Header.NavLink>
  //       </Header.Nav>
  //     </Header.BlockLeft>
  //     <Header.BlockRight>
  //       {status === 'authenticated' ? (
  //         <>
  //           {user?.firstName} ({address?.substring(0, 4)}...){' '}
  //           <Button action={() => disconnect()}>Disconnect Wallet</Button>
  //         </>
  //       ) : (
  //         <Button action={() => toggleModal('login')}>Connect Wallet</Button>
  //       )}

  //       <ThemeToggler />
  //     </Header.BlockRight>
  //   </Header>
  // );
}

export default GlobalHeader;
