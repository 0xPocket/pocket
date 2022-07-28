import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useAccount } from 'wagmi';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, signOut } = useMagic();
  const { address, connector } = useAccount();

  console.log(user);
  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        {user && (
          <>
            {address ? `${connector?.name} : ${address}` : 'Not Connected'}
            <Link href="/" passHref>
              <div className="cursor-pointer">
                {user.name ? ` ${user.name}` : user.address}
              </div>
            </Link>
            <WalletPopover />
            <Button action={signOut}>Logout</Button>
          </>
        )}
        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
