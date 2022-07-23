import MainWrapper from '../components/wrappers/MainWrapper';
import { useAccount } from 'wagmi';
import EmailSignin from '../components/auth/EmailSignin';
import { Spinner } from '../components/common/Spinner';
import SocialSignin from '../components/auth/SocialSignin';
import EthereumSignin from '../components/auth/EthereumSignin';

function SignUp() {
  const { status } = useAccount();

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
          <SocialSignin />
          <div className="flex w-72 items-center">
            <div className="w-full border-b opacity-25"></div>
            <h2 className="mx-2 text-lg font-bold">OR</h2>
            <div className="w-full border-b opacity-25"></div>
          </div>
          <EthereumSignin />
        </div>
      </section>
    </MainWrapper>
  );
}

export default SignUp;
