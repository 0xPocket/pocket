import { Button } from '@lib/ui';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useAuth } from '../../contexts/auth';
import { useWeb3Auth } from '../../contexts/web3hook';
import AuthDialog from '../auth/AuthDialog';

type OnBoardingStepperProps = {
  registerToken: string | undefined;
};

function OnBoardingStepper({ registerToken }: OnBoardingStepperProps) {
  // const { toggleModal, address, registerAccount } = useWeb3Auth();
  const { address } = useAccount();
  const { setShowModal } = useAuth();
  const router = useRouter();

  if (!registerToken) {
    return <div>Loading...</div>;
  }

  const linkWallet = () => {
    // registerAccount(registerToken)?.then(() => {
    //   router.push('/');
    // });
  };

  return <AuthDialog show={true} setShow={setShowModal} />;
}

export default OnBoardingStepper;
