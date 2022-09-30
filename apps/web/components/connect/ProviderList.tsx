import { type FC, useCallback, useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import { signIn } from 'next-auth/react';
import { useIsMounted } from '../../hooks/useIsMounted';
import Image from 'next/future/image';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';
import EmailModalForm from './EmailModalForm';
import { toast } from 'react-toastify';
import { useEthereumSiwe } from '../../hooks/useEthereumSiwe';

const ProviderList: FC = () => {
  const { connector: activeConnector } = useAccount();
  const mounted = useIsMounted();
  const { disconnectAsync } = useDisconnect();
  const ethereumSign = useEthereumSiwe();

  const { connectors, connect } = useConnect({
    onSuccess: async () => {
      const { message, signature } = await ethereumSign.mutateAsync();

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
    },
  });
  const [open, setIsOpen] = useState(false);

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
