import { type FC, useCallback, useMemo } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import FormattedMessage from '../common/FormattedMessage';
import Image from 'next/future/image';

type ProviderListProps = {
  callback: (id: string) => void;
  userType: 'Parent' | 'Child';
};

const ProviderList: FC<ProviderListProps> = ({ callback, userType }) => {
  const mounted = useIsMounted();

  const { connectors, connectAsync, isLoading } = useConnect();
  const { isConnected, connector: activeConnector } = useAccount();

  const handleConnect = useCallback(
    (connector: Connector) => {
      if (
        (isConnected && connector.id === activeConnector?.id) ||
        connector.id === 'magic'
      ) {
        callback(connector.id);
      } else {
        connectAsync({ connector }).then(() => callback(connector.id));
      }
    },
    [connectAsync, isConnected, activeConnector, callback],
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
      <h3>Choose your connection method</h3>

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
            {/* <p className="">{connector.name}</p> */}
          </button>
        ))}
      </div>
    </>
  );
};

export default ProviderList;
