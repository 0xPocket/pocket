import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Spinner } from '../components/common/Spinner';
import MainWrapper from '../components/wrappers/MainWrapper';
import { trpc } from '../utils/trpc';

const VerifyChild: FC = () => {
  const router = useRouter();

  const mutation = trpc.useMutation(['email.verifyEmail'], {
    onSuccess: () => {
      setTimeout(() => router.push('/'), 3000);
    },
  });

  useEffect(() => {
    if (
      router.query &&
      router.query.token &&
      router.query.email &&
      mutation.status === 'idle'
    ) {
      mutation.mutate({
        token: router.query.token as string,
        email: router.query.email as string,
      });
    }
  }, [router, router.query, mutation]);

  if (mutation.status === 'success') {
    return (
      <MainWrapper>
        <div className="flex flex-col items-center justify-center gap-2 text-3xl font-bold">
          Your email is now verified !
          <p className="text-sm font-thin">
            You will be redirect in few seconds...
          </p>
        </div>
      </MainWrapper>
    );
  }

  if (mutation.isError) {
    return (
      <MainWrapper>
        <div className="flex flex-col items-center justify-center gap-8 font-bold">
          <p>{mutation.error.message}</p>
          <p className="text-sm font-thin">
            If the problem persists, contact us.
          </p>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div className="flex h-screen flex-col items-center justify-center gap-8">
        <Spinner />
      </div>
    </MainWrapper>
  );
};

export default VerifyChild;
