import Button from '../common/Button';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/nest-auth/next';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const router = useRouter();
  const { user, status, signOut } = useAuth();

  const handleLogIn = () => {
    console.log('Log');
    router.push('/login');
  };

  const handleSignIn = () => {
    console.log('Sign');
    router.push('/signin');
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex h-20 w-full items-center justify-between border-b border-opacity-40 bg-primary p-8">
      <div className="text-3xl font-bold">Brand.</div>
      <div className="flex justify-between gap-8">
        {status === 'authenticated' ? (
          <>
            <div> Welcome {user?.firstName}</div>
            <Button action={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button action={handleLogIn} light={true}>
              Log In
            </Button>
            <Button action={handleSignIn}>Sign In</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
