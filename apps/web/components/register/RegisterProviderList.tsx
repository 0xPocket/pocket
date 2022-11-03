import { type FC, useCallback, useMemo } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useIsMounted } from '../../hooks/useIsMounted';
import Image from 'next/future/image';
import FormattedMessage from '../common/FormattedMessage';
import { Spinner } from '../common/Spinner';

type ProviderListProps = {
  callback: (id: string) => void;
  userType: 'Parent' | 'Child';
};

const ProviderList: FC<ProviderListProps> = ({ callback, userType }) => {
  const mounted = useIsMounted();

  const { connectors, connect } = useConnect({
    onSuccess: (connector) => {
      if (connector.connector) {
        callback(connector.connector?.id);
      }
    },
  });

  const { isConnected, connector: activeConnector, status } = useAccount();

  const handleConnect = useCallback(
    (connector: Connector) => {
      if (
        (isConnected && connector.id === activeConnector?.id) ||
        connector.id === 'magic'
      ) {
        callback(connector.id);
      } else {
        connect({ connector });
      }
    },
    [connect, isConnected, activeConnector, callback],
  );

  const filteredConnectors = useMemo(() => {
    if (userType === 'Parent') return connectors;
    return connectors.filter((c) => c.id !== 'magic');
  }, [userType, connectors]);

  return (
    <>
      <h3>
        <FormattedMessage id="register.step1.title" />
      </h3>

      {!mounted || status === 'connecting' ? (
        <Spinner />
      ) : (
        <div className={` flex w-full justify-center gap-8`}>
          {filteredConnectors.map((connector) => (
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
      )}
    </>
  );
};

export default ProviderList;
