import Button from '../common/Button';
import { useRouter } from 'next/router';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const router = useRouter();

  const handleLogIn = () => {
    console.log('Log');
    router.push('/login');
  };

  const handleSignIn = () => {
    console.log('Sign');
    router.push('/signin');
  };

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-opacity-40 bg-primary px-8">
      <div className="text-3xl font-bold">Brand.</div>
      <div className="flex justify-between gap-8">
        <Button action={handleLogIn} light={true}>
          Log In
        </Button>
        <Button action={handleSignIn}>Sign In</Button>
      </div>
    </header>
  );
}

export default Header;
