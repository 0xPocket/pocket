// import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';

type StatusProps = {};

function Status({}: StatusProps) {
  const { signOut } = useMagic();
  const { connector, status } = useAccount();
  const { chain } = useNetwork();
  const { isLoading, switchNetwork } = useSwitchNetwork();
  const { asPath } = useRouter();

  const mounted = useIsMounted();

  if (!mounted) return <Spinner />;

  if (asPath.includes('/connect') || asPath.includes('/onboarding'))
    return null;

  if (status === 'connecting' || status === 'reconnecting') return <Spinner />;

  if (connector?.id === 'magic')
    return (
      <>
        <WalletPopover />
        <Button action={signOut}>Logout</Button>
      </>
    );

  if (status === 'connected')
    return (
      <>
        {Number(chain?.id) === 80001 ? (
          <p>Connected to Mumbai via {connector?.name} </p>
        ) : (
          <div>
            <button
              disabled={!switchNetwork}
              key={80001}
              onClick={() => switchNetwork?.(80001)}
            >
              {!isLoading && (
                <>
                  <FontAwesomeIcon
                    color={'#eb3461'}
                    icon={faExclamationTriangle}
                  />
                  <span> Please click here to connect to polygon mumbai </span>
                  <FontAwesomeIcon
                    color={'#eb3461'}
                    icon={faExclamationTriangle}
                  />
                </>
              )}
            </button>
          </div>
        )}
        <WalletPopover />
        <Button action={signOut}>Logout</Button>
      </>
    );
  else return null;
}

export default Status;
