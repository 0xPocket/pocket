import { FC, useCallback } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { getCsrfToken, signIn } from 'next-auth/react';
import SignMessage from '../onboarding/SignMessage';
import EthereumProviders from './EthereumProviders';
import { SiweMessage } from 'siwe';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';

type EthereumSigninProps = {
  type: 'Parent' | 'Child';
};

const EthereumSignin: FC<EthereumSigninProps> = ({ type }) => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isLoading, error } = useSignMessage();
  const mounted = useIsMounted();

  const siweSignMessage = useCallback(
    async (address: string, chainId: number) => {
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

        signIn('ethereum', {
          message: JSON.stringify(message),
          signature,
          type: type,
          callbackUrl: '/',
        });
      } catch (e) {
        console.log(e);
      }
    },
    [type, signMessageAsync],
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <EthereumProviders callback={siweSignMessage} />
      {isLoading && <Spinner />}
      {error && <div className="text-sm text-danger">{error.message}</div>}
      {isConnected && !isLoading && (
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
      {isConnected && !isLoading && (
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
