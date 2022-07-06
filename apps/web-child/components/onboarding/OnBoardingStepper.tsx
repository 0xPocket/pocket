import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Providers from '../auth/Providers';
import SignMessage from '../auth/SignMessage';
import Step from './Step';

type OnBoardingStepperProps = {
  registerToken: string | undefined;
};

function OnBoardingStepper({ registerToken }: OnBoardingStepperProps) {
  const [step, setStep] = useState(0);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [isConnected]);

  if (!registerToken) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <Step
        active={step === 0}
        title="1. Connect your wallet"
        completed={step > 0}
      >
        <Providers register />
      </Step>
      <Step
        active={step === 1}
        title="2. Link your account"
        completed={step > 1}
      >
        {isConnected && <span>Connected with {address}</span>}
        <SignMessage register />
      </Step>
    </div>
  );
}

export default OnBoardingStepper;
