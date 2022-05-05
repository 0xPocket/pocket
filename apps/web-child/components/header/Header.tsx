import Button from '../common/Button';
import Link from 'next/link';
import Nav from './Nav';
import { useWeb3Auth } from '../../contexts/web3hook';

type HeaderProps = {};

function Header({}: HeaderProps) {
  const { address, status, connect, disconnect } = useWeb3Auth();

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-opacity-40 bg-primary px-8">
      <div className="flex">
        <Link href="/" passHref>
          <div className="cursor-pointer text-3xl font-bold">Child.</div>
        </Link>
        <Nav />
      </div>
      <div className="flex items-center justify-between gap-8">
        <div>{address}</div>
        <div>
          {status === 'unauthenticated' ? (
            <Button action={() => connect()}>Connect Wallet</Button>
          ) : (
            <Button action={() => disconnect()}>Disconnect Wallet</Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
