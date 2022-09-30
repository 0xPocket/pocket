import { type FC, useCallback, useState } from 'react';
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from 'wagmi';
import { getCsrfToken, signIn } from 'next-auth/react';
// import SignMessage from './SignMessage';
// import EthereumProviders from './EthereumProviders';
import { SiweMessage } from 'siwe';
import { useIsMounted } from '../../hooks/useIsMounted';
import FormattedMessage from '../common/FormattedMessage';
import Image from 'next/future/image';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';
import EmailModalForm from './EmailModalForm';
import { toast } from 'react-toastify';

const ProviderList: FC = () => {
  const { connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const mounted = useIsMounted();
  const { disconnectAsync } = useDisconnect();
  const { connectors, connect } = useConnect({
    onSuccess(data) {
      siweSignMessage(data.account, data.chain.id);
    },
  });
  const [open, setIsOpen] = useState(false);

  // const isLoading = useMemo(
  //   () => isLoadingSignMessage || isLoadingGlobal,
  //   [isLoadingSignMessage, isLoadingGlobal],
  // );

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
          redirect: false,
        }).then((res) => {
          if (res?.ok) {
            window.location.href = '/';
          } else {
            toast.error(res?.error);
          }
        });
      } catch (e) {}
    },
    [signMessageAsync],
  );

  const handleConnect = useCallback(
    async (connector: Connector) => {
      if (connector.id === 'magic') {
        setIsOpen(true);
      } else {
        if (connector.id === activeConnector?.id) {
          await disconnectAsync();
        }
        connect({ connector });
      }
    },
    [activeConnector, disconnectAsync, connect],
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>
        <FormattedMessage id="onboarding.connect-wallet" />
      </p>
      <div className={`grid w-full grid-cols-3 gap-4`}>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={!connector.ready}
            className="relative flex flex-col items-center justify-center gap-4 transition-all hover:scale-110"
          >
            <Image
              src={`/assets/providers/${connector.id}.svg`}
              alt={connector.name}
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <p className="text-xs">{connector.name}</p>
          </button>
        ))}
      </div>
      <DialogPopupWrapper isOpen={open} setIsOpen={setIsOpen}>
        <EmailModalForm closeModal={() => setIsOpen(false)} />
      </DialogPopupWrapper>
      {/* {isLoading && <Spinner />} */}
      {/* {isConnected && !isLoading && activeConnector?.id !== 'magic' && (
        <div className="flex gap-4">
          <button
            className="third-btn"
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            <FormattedMessage id="disconnect" />
          </button>
          <SignMessage
            callback={(message, signature) =>
              signIn('ethereum', {
                message,
                signature,
                type: type,
              })
            }
          />
        </div>
      )} */}
    </div>
  );
};

export default ProviderList;
