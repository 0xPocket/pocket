import { FC, useCallback, useMemo, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { getCsrfToken, signIn } from 'next-auth/react';
import SignMessage from './SignMessage';
import EthereumProviders from './EthereumProviders';
import { SiweMessage } from 'siwe';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { trpc } from '../../utils/trpc';

type EthereumSigninProps = {
  type: 'Parent' | 'Child';
};

const EthereumSignin: FC<EthereumSigninProps> = ({ type }) => {
  const { isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isLoading: isLoadingSignMessage } =
    useSignMessage();
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const mounted = useIsMounted();
  const router = useRouter();
  const utils = trpc.useContext();

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
        // HELP
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
          redirect: false,
        }).then(async (res) => {
          if (res?.ok) {
            await utils.invalidateQueries(['auth.me']);
            router.push('/onboarding');
          } else {
            toast.error(res?.error);
            setIsLoadingGlobal(false);
          }
        });
      } catch (e) {
        setIsLoadingGlobal(false);
      }
    },
    [type, signMessageAsync, router, utils],
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <p>Connect with your favorite wallet</p>
      {!isConnected && <EthereumProviders callback={siweSignMessage} />}
      {isLoading && <Spinner />}
      {isConnected && !isLoading && activeConnector?.id !== 'magic' && (
        <div className="flex gap-4">
          <button
            className="third-btn"
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
                redirect: false,
              }).then(async (res) => {
                if (res?.ok) {
                  router.push('/onboarding');
                } else {
                  toast.error(res?.error);
                  setIsLoadingGlobal(false);
                }
              })
            }
          />
        </div>
      )}
    </>
  );
};

export default EthereumSignin;
