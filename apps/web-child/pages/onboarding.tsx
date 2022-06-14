import { Button } from '@lib/ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OnBoardingStepper from '../components/onboarding/OnBoardingStepper';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useWeb3Auth } from '../contexts/web3hook';

function OnBoarding() {
  const [registerToken, setRegisterToken] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      setRegisterToken(router.query.token as string);
    }
  }, [router]);

  return (
    <MainWrapper noHeader>
      <OnBoardingStepper registerToken={registerToken} />
    </MainWrapper>
  );
}

export default OnBoarding;