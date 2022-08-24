import { FC, useCallback, useMemo, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { getCsrfToken, signIn } from 'next-auth/react';
import SignMessage from './SignMessage';
import EthereumProviders from './EthereumProviders';
import { SiweMessage } from 'siwe';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';

type EthereumSigninProps = {
  type: 'Parent' | 'Child';
};

const EthereumSignin: FC<EthereumSigninProps> = ({ type }) => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isLoading: isLoadingSignMessage } =
    useSignMessage();
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const mounted = useIsMounted();

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

        signIn('ethereum', {
          message: JSON.stringify(message),
          signature,
          type: type,
          callbackUrl: '/',
        });
      } catch (e) {
        console.log(e);
        setIsLoadingGlobal(false);
      }
    },
    [type, signMessageAsync],
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <p>Connect with your favorite wallet</p>
      {!isConnected && <EthereumProviders callback={siweSignMessage} />}
      {isLoading && <Spinner />}
      {isConnected && !isLoading && (
        <div className="flex gap-4">
          <button
            className="dismiss-btn"
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            Disconnect
          </button>
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
        </div>
      )}
    </>
  );
};

export default EthereumSignin;
