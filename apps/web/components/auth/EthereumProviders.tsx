import Image from 'next/image';
import { FC, useCallback } from 'react';
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi';

type EthereumProvidersProps = {
  callback?: (address: string, chainId: number) => void;
};

const EthereumProviders: FC<EthereumProvidersProps> = ({ callback }) => {
  const { connectors, connectAsync } = useConnect();
  const { isConnected, connector: activeConnector, address } = useAccount();

  const { chain } = useNetwork();

  const handleConnect = useCallback(
    (connector: Connector) => {
      if (
        isConnected &&
        address &&
        callback &&
        chain &&
        connector.id === activeConnector?.id
      ) {
        callback(address, chain?.id);
      } else {
        connectAsync({ connector })
          .then((res) => {
            if (callback) {
              callback(res.account, res.chain.id);
            }
          })
          .catch(() => null);
      }
    },
    [callback, connectAsync, isConnected, address, chain, activeConnector],
  );

  return (
    <>
      <div
        className={`grid w-full grid-cols-2 gap-4 ${
          isConnected && 'opacity-50'
        }`}
      >
        {connectors
          .filter((connector) => connector.id !== 'magic')
          .map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={!connector.ready}
              className="relative flex flex-col items-center justify-center gap-4 transition-all hover:scale-110"
            >
              <div className="relative h-8 w-8">
                <Image
                  src={`/assets/providers/${connector.id}.svg`}
                  objectFit="contain"
                  layout="fill"
                  alt={connector.name}
                />
              </div>
              <p className="text-sm">{connector.name}</p>
            </button>
          ))}
      </div>
    </>
  );
};

export default EthereumProviders;
