import { type FC, useCallback, useMemo } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import FormattedMessage from '../common/FormattedMessage';
import Image from 'next/future/image';
import { toast } from 'react-toastify';

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
  const { isConnected, connector: activeConnector } = useAccount();

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

  if (!mounted) {
    return null;
  }

  return (
    <>
      <h2>Choose your connection method</h2>
      <>
        <div className={` flex w-full justify-center gap-8`}>
          {filteredConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              className="provider-container"
            >
              <div className="provider-img">
                <Image
                  src={`/assets/providers/${connector.id}.svg`}
                  width={128}
                  height={128}
                  alt={connector.name}
                />
              </div>
            </button>
          ))}
        </div>
      </>
    </>
  );
};

export default ProviderList;
