import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { trpc } from '../../utils/trpc';
import Providers from './Providers';
import SignMessage from './SignMessage';
import Step from './Step';

type OnBoardingStepperProps = {
  token: string;
  email: string;
};

function OnBoardingStepper({ token, email }: OnBoardingStepperProps) {
  const [step, setStep] = useState(0);
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { disconnectAsync } = useDisconnect();

  const mutation = trpc.useMutation(['auth.verifyChild'], {
    onSuccess: () => {
      router.push('/');
    },
  });

  useEffect(() => {
    if (isConnected) {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [isConnected]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Step
        active={step === 0}
        title="1. Connect your wallet"
        completed={step > 0}
      >
        <Providers />
      </Step>
      <button onClick={() => disconnectAsync()}>Disconnect</button>
      <Step
        active={step === 1}
        title="2. Link your account"
        completed={step > 1}
      >
        {isConnected && <span>Connected with {address}</span>}
        <SignMessage
          callback={(message, signature) =>
            mutation
              .mutateAsync({
                email,
                token,
                message,
                signature,
              })
              .then(() =>
                signIn('ethereum', {
                  message,
                  signature,
                  type: 'Parent',
                  callbackUrl: '/',
                }),
              )
          }
        />
      </Step>
    </div>
  );
}

export default OnBoardingStepper;
