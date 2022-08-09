import MainWrapper from '../components/wrappers/MainWrapper';
import OnBoardingForm from '../components/auth/OnBoardingForm';
import { useSession } from 'next-auth/react';
import { Spinner } from '../components/common/Spinner';
import { trpc } from '../utils/trpc';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function OnBoarding() {
  const { data } = useSession();
  const router = useRouter();

  const resendEmail = trpc.useMutation(['email.resendVerificationEmail']);

  useEffect(() => {
    if (data?.user.emailVerified && !data?.user.isNewUser) {
      router.push('/');
    }
  }, [data, router]);

  if (!data || (data?.user.emailVerified && !data?.user.isNewUser)) {
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
          <div className="mx-auto flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold">
              Please verify your email with the link we sent you.
            </p>
            {resendEmail.status === 'idle' && (
              <a
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  resendEmail.mutateAsync();
                }}
              >
                {"Didn't received any email? Click here to resend a new one."}
              </a>
            )}
            {resendEmail.status === 'loading' && <Spinner />}
            {resendEmail.status === 'success' && (
              <p className="text-success">New email sent !</p>
            )}
          </div>
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
