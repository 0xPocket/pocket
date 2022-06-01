import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserParent } from '@lib/types/interfaces';
import { Button, Header, ThemeToggler } from '@lib/ui';
import { useAuth } from '@lib/nest-auth/next';
import WalletPopover from '../wallet/WalletPopover';
import { useQueryClient } from 'react-query';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const router = useRouter();
  const { user, status, signOut } = useAuth<UserParent>();
  const queryClient = useQueryClient();

  const handleLogIn = () => {
    console.log('Log');
    router.push('/login');
  };

  const handleSignIn = () => {
    console.log('Sign');
    router.push('/signup');
  };

  const handleLogout = () => {
    signOut();
    queryClient.invalidateQueries();
  };

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title>Parent</Header.Title>
        <Header.Nav show={status === 'authenticated'}>
          <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
          <Header.NavLink href="#">Blog</Header.NavLink>
          <Header.NavLink href="#">FAQ</Header.NavLink>
        </Header.Nav>
      </Header.BlockLeft>
      <Header.BlockRight>
        {status === 'authenticated' ? (
          <>
            <Link href="/dashboard" passHref>
              <div className=" cursor-pointer">
                {user?.firstName} {user?.lastName?.charAt(0)}.
              </div>
            </Link>
            <WalletPopover />
            <Button action={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button action={handleLogIn} light={true}>
              Log In
            </Button>
            <Button action={handleSignIn}>Sign Up</Button>
          </>
        )}
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
