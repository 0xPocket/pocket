import Button from '../components/common/Button';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useWeb3Auth } from '../contexts/web3hook';

type ChildrenSignupProps = {};

function ChildrenSignup({}: ChildrenSignupProps) {
  const { status, provider } = useWeb3Auth();

  return (
    <MainWrapper>
      {status === 'authenticated' ? (
        <Button>CLAIM</Button>
      ) : (
        <section className=" h-screen bg-primary">You must connect</section>
      )}
    </MainWrapper>
  );
}

export default ChildrenSignup;
