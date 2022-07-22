import MainWrapper from '../components/wrappers/MainWrapper';
import { useAccount, useConnect } from 'wagmi';
import EmailSignin from '../components/auth/EmailSignin';
import { Spinner } from '../components/common/Spinner';
import Image from 'next/image';

function SignUp() {
  const { status } = useAccount();
  const { connectors, connectAsync } = useConnect();

  if (status === 'reconnecting' || status === 'connecting') {
    return (
      <MainWrapper>
        <section className="flex min-h-[85vh] items-center justify-center">
          <Spinner />
        </section>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <section className="relative grid min-h-[85vh] grid-cols-1">
        <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
          <EmailSignin />
          <div className="flex w-72 items-center">
            <div className="w-full border-b opacity-25"></div>
            <h2 className="mx-2 text-lg font-bold">OR</h2>
            <div className="w-full border-b opacity-25"></div>
          </div>
          <div className="flex gap-4">
            {connectors
              .filter((connector) => connector.id !== 'magic')
              .map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connectAsync({ connector })}
                  className="container-classic relative flex w-32 items-center justify-center gap-4 p-4 transition-all dark:bg-dark-light/50 dark:hover:bg-dark-light"
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
          {/* <SocialAuth /> */}
        </div>
        {/* <div className="flex items-center justify-center">ILLU</div> */}
      </section>
    </MainWrapper>
  );
}

export default SignUp;
