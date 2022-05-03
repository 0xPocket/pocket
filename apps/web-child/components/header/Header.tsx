import Button from '../common/Button';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/nest-auth/next';
import Link from 'next/link';
import Nav from './Nav';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const router = useRouter();
  const { user, status, signOut } = useAuth();

  const handleConnect = () => {
    console.log('Sign');
    router.push('/signup');
  };

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-opacity-40 bg-primary px-8">
      <div className="flex">
        <Link href="/" passHref>
          <div className="cursor-pointer text-3xl font-bold">Parent.</div>
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
          </>
        ) : (
          <>
            <Button action={handleConnect}>Connect Wallet</Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
