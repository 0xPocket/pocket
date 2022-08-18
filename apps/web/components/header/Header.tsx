import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useAccount, useNetwork } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, signOut } = useMagic();
  // const { address, connector } = useAccount();
  const { chain } = useNetwork();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        {user && (
          <>
            {/* {address ? `${connector?.name} : ${address}` : 'Not Connected'} */}
            {chain?.id === 80001 ? (
              <p>Connected to Mumbai</p>
            ) : (
              <div>
                <FontAwesomeIcon
                  color={'#eb3461'}
                  icon={faExclamationTriangle}
                />

                <span className="text-gray"> Please connect to Mumbai </span>
                <FontAwesomeIcon
                  color={'#eb3461'}
                  icon={faExclamationTriangle}
                />
              </div>
            )}
            {/* <Link href="/" passHref>
              <div className="cursor-pointer">
                {user.name ? ` ${user.name}` : user.address}
              </div>
            </Link> */}
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
