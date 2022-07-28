import { useRouter } from 'next/router';
import { FC } from 'react';
import OnBoardingStepper from '../components/onboarding/OnBoardingStepper';
import MainWrapper from '../components/wrappers/MainWrapper';

const VerifyChild: FC = () => {
  const router = useRouter();

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
