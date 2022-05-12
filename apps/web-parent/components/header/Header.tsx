import Button from '../common/Button';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/nest-auth/next';
import Link from 'next/link';
import Nav from './Nav';
import { UserParent } from '@lib/types/interfaces';
import ToggleThemeMode from './ToggleThemeMode';
import WalletPopover from '../wallet/WalletPopover';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const router = useRouter();
  const { user, status, signOut } = useAuth<UserParent>();

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
  };

  return (
    <header className="flex border-b border-opacity-40 bg-bright px-8 dark:bg-primary">
      <div className="container mx-auto flex h-28 w-full items-center justify-between">
        <div className="flex">
          <Link href="/" passHref>
            <div className="cursor-pointer text-3xl font-bold">Kuryusi</div>
          </Link>
          {status === 'authenticated' && <Nav />}
        </div>
        <div className="flex items-center justify-between gap-8">
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
          {/* <ToggleThemeMode /> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
