import Image from 'next/image';
import { useConnect } from 'wagmi';
import { Spinner } from '../common/Spinner';

type AuthDialogProvidersProps = {};

function AuthDialogProviders({}: AuthDialogProvidersProps) {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <>
      <div className="flex w-96 gap-2">
        {connectors.map((connector) => (
          <button
            className="relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border border-white-darker bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
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
            {/* {!connector.ready && ' (unsupported)'}
                    {isLoading && connector.id === pendingConnector?.id && (
                      <Spinner />
                    )} */}
          </button>
        ))}
      </div>

      {error && <div className="text-sm text-danger">{error.message}</div>}
      {isLoading && <Spinner />}
    </>
  );
}

export default AuthDialogProviders;
