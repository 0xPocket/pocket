// import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  const { user, signOut } = useMagic();
  const { connector } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        {user && (
          <>
            {/* {address ? `${connector?.name} : ${address}` : 'Not Connected'} */}
            {Number(chain?.id) === 80001 ? (
              <p>Connected to Mumbai via {connector?.name} </p>
            ) : (
              <div>
                <button
                  disabled={!switchNetwork}
                  key={80001}
                  onClick={() => switchNetwork?.(80001)}
                >
                  <FontAwesomeIcon
                    color={'#eb3461'}
                    icon={faExclamationTriangle}
                  />
                  <span> Please click here to connect to polygon mumbai </span>
                  <FontAwesomeIcon
                    color={'#eb3461'}
                    icon={faExclamationTriangle}
                  />
                  {isLoading && pendingChainId === 80001 && ' (switching)'}
                </button>
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
