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
    <>
      <div className={` flex w-full justify-center gap-8`}>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            className="provider-container"
          >
            <div className="container-classic rounded-md p-8">
              <div className="provider-img">
                <Image
                  src={`/assets/providers/${connector.id}.svg`}
                  width={128}
                  height={128}
                  alt={connector.name}
                />
              </div>
            </div>
            {/* <p className="">{connector.name}</p> */}
          </button>
        ))}
      </div>

      <DialogPopupWrapper isOpen={open} setIsOpen={setIsOpen}>
        <EmailModalForm closeModal={() => setIsOpen(false)} />
      </DialogPopupWrapper>
    </>
  );
};

export default ProviderList;
