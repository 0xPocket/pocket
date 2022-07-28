import Image from 'next/image';
import { useAccount, useConnect } from 'wagmi';
import { Spinner } from '../common/Spinner';

function Providers() {
  const { connectAsync, connectors, error, isLoading } = useConnect();
  const { connector: activeConnector } = useAccount();

  return (
    <>
      <div className="flex w-96 gap-2">
        {connectors
          .filter((el) => el.id !== 'magic')
          .map((connector) => (
            <button
              className={`relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border ${
                activeConnector?.id === connector.id
                  ? 'border-2 border-primary'
                  : 'border-white-darker'
              } bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75`}
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connectAsync({ connector })}
            >
              <div className="relative h-8 w-8">
                <Image
                  src={`/assets/providers/${connector.id}.svg`}
                  objectFit="contain"
                  layout="fill"
                  alt={connector.name}
                />
              </div>
              {connector.name}
            </button>
          ))}
      </div>

      {error && <div className="text-sm text-danger">{error.message}</div>}
      {isLoading && <Spinner />}
    </>
  );
}

export default Providers;
