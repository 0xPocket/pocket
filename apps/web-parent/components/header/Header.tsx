import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useRouter } from 'next/router';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, signOut } = useMagic();
  const router = useRouter();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        {user ? (
          <>
            <Link href="/" passHref>
              <div className="cursor-pointer">
                {user.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : user.address}
              </div>
            </Link>
            <WalletPopover />
            <Button action={signOut}>Logout</Button>
          </>
        ) : (
          <>
            {router.pathname !== '/connect' && (
              <Link href="/connect">Connect</Link>
            )}
          </>
        )}
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
