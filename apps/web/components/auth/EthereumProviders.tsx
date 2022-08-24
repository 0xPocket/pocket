import Image from 'next/image';
import type { FC } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Spinner } from '../common/Spinner';

type EthereumProvidersProps = {
  callback?: (address: string, chainId: number) => void;
};

const EthereumProviders: FC<EthereumProvidersProps> = ({ callback }) => {
  const { connectors, connectAsync, error, isLoading } = useConnect();
  const { isConnected, connector: activeConnector } = useAccount();

  const handleConnect = (connector: Connector) => {
    connectAsync({ connector }).then((res) => {
      if (callback) {
        callback(res.account, res.chain.id);
      }
    });
  };

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
              className={`relative flex items-center justify-center gap-4 p-4 transition-all hover:scale-110`}
            >
              <div className="relative h-8 w-8">
                <Image
                  src={`/assets/providers/${connector.id}.svg`}
                  objectFit="contain"
                  layout="fill"
                  alt={connector.name}
                />
              </div>
            </button>
          ))}
      </div>
      {isLoading && <Spinner />}
    </>
  );
};

export default EthereumProviders;
