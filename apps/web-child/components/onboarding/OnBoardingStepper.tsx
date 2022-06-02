import { Button } from '@lib/ui';
import { useRouter } from 'next/router';
import { useWeb3Auth } from '../../contexts/web3hook';

type OnBoardingStepperProps = {
  registerToken: string | undefined;
};

function OnBoardingStepper({ registerToken }: OnBoardingStepperProps) {
  const { toggleModal, address, registerAccount } = useWeb3Auth();
  const router = useRouter();

  if (!registerToken) {
    return <div>Loading...</div>;
  }

  const linkWallet = () => {
    registerAccount(registerToken)?.then(() => {
      router.push('/');
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">Step 1:</span>
        {address ? (
          <div>Wallet : {address}</div>
        ) : (
          <Button action={() => toggleModal()}>Connect your Wallet</Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">Step 2:</span>
        <Button action={() => linkWallet()}>Link your Wallet</Button>
      </div>
    </div>
  );
}

export default OnBoardingStepper;
