import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import OnBoardingStepper from '../components/onboarding/child/OnBoarding';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useMagic } from '../contexts/auth';
import { useIsMounted } from '../hooks/useIsMounted';

const VerifyChild: FC = () => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { signOut, loggedIn } = useMagic();

  useEffect(() => {
    if (loggedIn) {
      signOut(false);
    }
  }, [loggedIn, signOut]);

  if (!isMounted) {
    return null;
  }

  return (
    <MainWrapper>
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">
          <FormattedMessage id="common.welcome" />
        </h1>
        <div className="container-classic rounded-lg p-8">
          <OnBoardingStepper
            token={router.query.token as string}
            email={router.query.email as string}
          />
        </div>
      </div>
    </MainWrapper>
  );
};

export default VerifyChild;
