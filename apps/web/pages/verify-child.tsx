import { useRouter } from 'next/router';
import { FC } from 'react';
import OnBoardingStepper from '../components/onboarding/child/OnBoarding';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useIsMounted } from '../hooks/useIsMounted';

const VerifyChild: FC = () => {
  const router = useRouter();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <MainWrapper>
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">Welcome to Pocket !</h1>
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
