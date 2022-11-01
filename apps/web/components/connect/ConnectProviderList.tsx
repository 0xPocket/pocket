import { type FC, useCallback, useState } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import Image from 'next/future/image';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';
import EmailModalForm from './EmailModalForm';
import { useEthereumSiwe } from '../../hooks/useEthereumSiwe';
import { useSignIn } from '../../hooks/useSignIn';
import { Spinner } from '../common/Spinner';

const ProviderList: FC = () => {
  const { connector: activeConnector, status } = useAccount();
  const ethereumSign = useEthereumSiwe({
    onSuccess: ({ message, signature }) => {
      signIn('ethereum', {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });
    },
  });

  const { signIn, isLoading } = useSignIn();

  const { connectors, connect } = useConnect({
    onSuccess: async () => {
      ethereumSign.mutate();
    },
  });
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
      {isLoading || status === 'connecting' || ethereumSign.isLoading ? (
        <Spinner />
      ) : (
        <div className={` flex w-full justify-center gap-8`}>
          {connectors.map((connector) => (
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
