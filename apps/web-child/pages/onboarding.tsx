import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import OnBoardingStepper from '../components/onboarding/OnBoardingStepper';
import MainWrapper from '../components/wrappers/MainWrapper';
import { NextPageWithLayout } from './_app';

const OnBoarding: NextPageWithLayout = () => {
  const [registerToken, setRegisterToken] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      setRegisterToken(router.query.token as string);
    }
  }, [router]);

  return <OnBoardingStepper registerToken={registerToken} />;
};

OnBoarding.getLayout = (page) => {
  return <MainWrapper noHeader>{page}</MainWrapper>;
};

export default OnBoarding;
