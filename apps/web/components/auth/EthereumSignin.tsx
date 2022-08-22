import { FC, useCallback, useMemo, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { getCsrfToken, signIn } from 'next-auth/react';
import SignMessage from '../onboarding/SignMessage';
import EthereumProviders from './EthereumProviders';
import { SiweMessage } from 'siwe';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type EthereumSigninProps = {
  type: 'Parent' | 'Child';
};

const EthereumSignin: FC<EthereumSigninProps> = ({ type }) => {
  const { isConnected, address, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    signMessageAsync,
    isLoading: isLoadingSignMessage,
    error,
  } = useSignMessage();
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const mounted = useIsMounted();
  const router = useRouter();

  const isLoading = useMemo(
    () => isLoadingSignMessage || isLoadingGlobal,
    [isLoadingSignMessage, isLoadingGlobal],
  );

  const siweSignMessage = useCallback(
    async (address: string, chainId: number) => {
      setIsLoadingGlobal(true);
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign this message to access Pocket.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await getCsrfToken(),
      });

      try {
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        await signIn('ethereum', {
          message: JSON.stringify(message),
          signature,
          type: type,
          redirect: false,
        }).then(async (res) => {
          if (res?.ok) {
            router.push('/');
          } else {
            toast.error(res?.error);
            setIsLoadingGlobal(false);
          }
        });
      } catch (e) {
        setIsLoadingGlobal(false);
      }
    },
    [type, signMessageAsync, router],
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <EthereumProviders callback={siweSignMessage} />
      {isLoading && <Spinner />}
      {error && <div className="text-sm text-danger">{error.message}</div>}
      {isConnected && !isLoading && activeConnector?.id !== 'magic' && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            Disconnect
          </button>
          <span>Connected with {address}</span>
        </>
      )}
      {isConnected && !isLoading && activeConnector?.id !== 'magic' && (
        <SignMessage
          callback={(message, signature) =>
            signIn('ethereum', {
              message,
              signature,
              type: type,
              callbackUrl: '/',
            })
          }
        />
      )}
    </>
  );
};

export default EthereumSignin;
