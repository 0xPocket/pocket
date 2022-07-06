import Image from 'next/image';
import { Connector, useConnect } from 'wagmi';
import { useAuth } from '../../contexts/auth';
import { Spinner } from '../common/Spinner';

type AuthDialogProvidersProps = {};

function AuthDialogProviders({}: AuthDialogProvidersProps) {
  const { connectAsync, connectors, error, isLoading } = useConnect();
  const { signIn } = useAuth();

  const providerConnect = async (connector: Connector) => {
    try {
      const res = await connectAsync({ connector });

      signIn(res.chain.id, res.account);
    } catch (e) {
      console.log('test');
    }
  };

  return (
    <>
      <div className="flex w-96 gap-2">
        {connectors.map((connector) => (
          <button
            className="relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border border-white-darker bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75"
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => providerConnect(connector)}
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

export default AuthDialogProviders;
