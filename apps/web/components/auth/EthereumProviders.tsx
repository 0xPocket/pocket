import Image from 'next/image';
import { FC, useCallback } from 'react';
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi';
import { Spinner } from '../common/Spinner';

type EthereumProvidersProps = {
  callback?: (address: string, chainId: number) => void;
};

const EthereumProviders: FC<EthereumProvidersProps> = ({ callback }) => {
  const { connectors, connectAsync, error, isLoading } = useConnect();
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
        connectAsync({ connector }).then((res) => {
          if (callback) {
            callback(res.account, res.chain.id);
          }
        });
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
              className={`container-classic relative flex items-center justify-center gap-4 p-4 transition-all dark:bg-dark-light/50 dark:hover:bg-dark-light ${
                activeConnector?.id === connector.id
                  ? 'border-2 border-primary'
                  : 'border-white-darker'
              } bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75`}
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
      {error && <div className="text-sm text-danger">{error.message}</div>}
    </>
  );
};

export default EthereumProviders;
