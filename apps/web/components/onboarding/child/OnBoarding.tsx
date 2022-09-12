import { signIn } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import { trpc } from '../../../utils/trpc';
import SignMessage from '../../auth/SignMessage';
import EthereumProviders from '../../auth/EthereumProviders';
import { toast } from 'react-toastify';

type OnBoardingStepperProps = {
  token: string;
  email: string;
};

function OnBoardingStepper({ token, email }: OnBoardingStepperProps) {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const mutation = trpc.useMutation(['email.verifyChild']);

  return (
    <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
      <p>Connect with your favorite wallet</p>
      {!isConnected && <EthereumProviders />}
      {isConnected && (
        <div className="flex gap-4">
          <button
            className="third-btn"
            onClick={(e) => {
              e.preventDefault();
              disconnect();
            }}
          >
            Disconnect
          </button>
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
                    type: 'Child',
                    callbackUrl: '/',
                  }),
                )
                .catch((e) => toast.error(e.message))
            }
          />
        </div>
      )}
    </div>
  );
}

export default OnBoardingStepper;
