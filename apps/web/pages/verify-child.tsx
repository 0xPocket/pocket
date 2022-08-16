import { useRouter } from 'next/router';
import { FC } from 'react';
import OnBoardingStepper from '../components/onboarding/OnBoardingStepper';
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
      <div className="mx-auto">
        <OnBoardingStepper
          token={router.query.token as string}
          email={router.query.email as string}
        />
      </div>
    </MainWrapper>
  );
};

export default VerifyChild;
