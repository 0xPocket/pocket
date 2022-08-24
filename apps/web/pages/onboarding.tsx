import MainWrapper from '../components/wrappers/MainWrapper';
import OnBoardingForm from '../components/auth/OnBoardingForm';
import { Spinner } from '../components/common/Spinner';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import EmailVerification from '../components/auth/EmailVerification';

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
        <section className="relative grid min-h-[85vh] grid-cols-1">
          <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
            <Spinner />
          </div>
        </section>
      </MainWrapper>
    );
  }

  if (!data?.user.emailVerified && data?.user.name) {
    return (
      <MainWrapper>
        <section className="relative grid min-h-[85vh] grid-cols-1">
          <EmailVerification />
        </section>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <section className="relative grid min-h-[85vh] grid-cols-1">
        <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
          <OnBoardingForm />
        </div>
      </section>
    </MainWrapper>
  );
}

export default OnBoarding;
