import { type FC, useCallback, useMemo, useState } from 'react';
import { Connector, useAccount, useConnect, useNetwork } from 'wagmi';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import FormattedMessage from '../common/FormattedMessage';
import Image from 'next/image';

type EthereumConnectProps = {
  callback: () => void;
};

const EthereumConnect: FC<EthereumConnectProps> = ({ callback }) => {
  const mounted = useIsMounted();

  const { connectors, connectAsync, isLoading } = useConnect();
  const { isConnected, connector: activeConnector, address } = useAccount();

  const { chain } = useNetwork();

  const handleConnect = useCallback(
    (connector: Connector) => {
      if (isConnected && connector.id === activeConnector?.id) {
        callback();
      } else {
        connectAsync({ connector }).then(() => callback());
      }
    },
    [connectAsync, isConnected, address, chain, activeConnector],
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <p>
        <FormattedMessage id="onboarding.connect-wallet" />
      </p>
      {isLoading && <Spinner />}
      <>
        <div className={`grid w-full grid-cols-2 gap-4`}>
          {connectors
            .filter((connector) => connector.id !== 'magic')
            .map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
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
    </>
  );
};

export default EthereumConnect;
