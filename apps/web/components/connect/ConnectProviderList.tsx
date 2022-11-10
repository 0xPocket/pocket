import { type FC, useCallback, useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import Image from 'next/future/image';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';
import EmailModalForm from './EmailModalForm';
import { useEthereumSiwe } from '../../hooks/useEthereumSiwe';
import { useSignIn } from '../../hooks/useSignIn';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';

const ProviderList: FC = () => {
  const { connector: activeConnector, status, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const ethereumSign = useEthereumSiwe({
    onSuccess: ({ message, signature }) => {
      signIn('ethereum', {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });
    },
  });

  const { disconnect } = useDisconnect();

  const { signIn, isLoading } = useSignIn();

  const { connectors, connect } = useConnect();
  const [open, setIsOpen] = useState(false);

  const handleConnect = useCallback(
    async (connector: Connector) => {
      if (connector.id === 'magic') {
        setIsOpen(true);
      } else {
        if (connector.id !== activeConnector?.id) {
          connect({ connector });
        } else {
          ethereumSign.mutate();
        }
      }
    },
    [activeConnector, connect, ethereumSign],
  );

  return (
    <>
      {isLoading ||
      !isMounted ||
      status === 'connecting' ||
      open ||
      ethereumSign.isLoading ? (
        <Spinner />
      ) : isConnected ? (
        <>
          <button className="action-btn" onClick={() => ethereumSign.mutate()}>
            Sign in with ethereum
          </button>
          <button className="third-btn py-0" onClick={() => disconnect()}>
            go back
          </button>
        </>
      ) : (
        <div className={` flex w-full justify-center gap-8`}>
          {connectors
            .filter((x) => x.ready)
            .map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                className="provider-container disabled:opacity-50"
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
              </button>
            ))}
        </div>
      )}

      <DialogPopupWrapper isOpen={open} setIsOpen={setIsOpen}>
        <EmailModalForm closeModal={() => setIsOpen(false)} />
      </DialogPopupWrapper>
    </>
  );
};

export default ProviderList;
