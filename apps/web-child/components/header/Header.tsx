import { Button, Header, ThemeToggler } from '@lib/ui';
import { useAuth } from '../../contexts/auth';
import AuthDialog from '../auth/AuthDialog';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, showModal, setShowModal, signOut } = useAuth();

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
          <>
            <Button action={() => setShowModal(true)}>Connect Wallet</Button>
            <AuthDialog show={showModal} setShow={setShowModal} />
          </>
        )}
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
