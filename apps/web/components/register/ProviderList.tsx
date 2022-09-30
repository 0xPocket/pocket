import { type FC, useCallback, useMemo, useState } from 'react';
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi';
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
  const { isConnected, connector: activeConnector, address } = useAccount();

  const { chain } = useNetwork();

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
    [connectAsync, isConnected, address, chain, activeConnector],
  );

  const filteredConnectors = useMemo(() => {
    if (userType === 'Parent') return connectors;
    return connectors.filter((c) => c.id !== 'magic');
  }, [userType]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <h2>Choose your connection method</h2>
      {isLoading && <Spinner />}
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
              {/* <p className="">{connector.name}</p> */}
            </button>
          ))}
        </div>
      </>
    </>
  );
};

export default ProviderList;
