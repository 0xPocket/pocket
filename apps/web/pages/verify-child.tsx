import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import OnBoardingStepper from '../components/onboarding/child/OnBoarding';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { useMagic } from '../contexts/auth';
import { useIsMounted } from '../hooks/useIsMounted';
import TitleHelper from '../components/common/TitleHelper';

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
    <PageWrapper>
      <TitleHelper id="titles.onboard" />

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
    </PageWrapper>
  );
};

export default VerifyChild;
