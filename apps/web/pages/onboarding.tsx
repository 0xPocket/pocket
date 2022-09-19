import MainWrapper from '../components/common/wrappers/MainWrapper';
import { Spinner } from '../components/common/Spinner';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import EmailVerification from '../components/auth/EmailVerification';
import OnBoardingForm from '../components/onboarding/parent/OnBoardingForm';
import FormattedMessage from '../components/common/FormattedMessage';

function OnBoarding() {
  const router = useRouter();
  const { data, isLoading, isFetching } = trpc.useQuery(['auth.session'], {
    onSuccess: (data) => {
      if (data.user.emailVerified && !data.user.newUser) {
        router.push('/');
      }
    },
  });

  if (
    !data ||
    isLoading ||
    isFetching ||
    (data?.user.emailVerified && !data?.user.newUser)
  ) {
    return (
      <MainWrapper>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 text-center">
          <div className="container-classic rounded-lg p-8">
            <Spinner />
          </div>
        </div>
      </MainWrapper>
    );
  }

  if (!data?.user.emailVerified && data?.user.name) {
    return (
      <MainWrapper>
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 text-center">
          <div className="container-classic rounded-lg p-8">
            <EmailVerification />
          </div>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div className="mx-auto flex  flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">
          <FormattedMessage id="onboarding.more-info" />
        </h1>
        <div className="container-classic rounded-lg p-8">
          <OnBoardingForm />
        </div>
      </div>
    </MainWrapper>
  );
}

export default OnBoarding;
