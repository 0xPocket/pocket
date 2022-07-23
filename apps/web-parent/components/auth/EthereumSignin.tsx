import Image from 'next/image';
import type { FC } from 'react';
import { useConnect } from 'wagmi';

const EthereumSignin: FC = () => {
  const { connectors, connectAsync } = useConnect();

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {connectors
        .filter((connector) => connector.id !== 'magic')
        .map((connector) => (
          <button
            key={connector.id}
            onClick={() => connectAsync({ connector })}
            className="container-classic relative flex items-center justify-center gap-4 p-4 transition-all dark:bg-dark-light/50 dark:hover:bg-dark-light"
          >
            <div className="relative h-8 w-8">
              <Image
                src={`/assets/providers/${connector.id}.svg`}
                objectFit="contain"
                layout="fill"
                alt={connector.name}
              />
            </div>
            {/* {connector.name} */}
          </button>
        ))}
    </div>
  );
};

export default EthereumSignin;
