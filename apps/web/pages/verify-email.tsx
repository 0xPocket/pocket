import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Spinner } from '../components/common/Spinner';
import MainWrapper from '../components/wrappers/MainWrapper';
import { trpc } from '../utils/trpc';

const VerifyChild: FC = () => {
  const router = useRouter();

  const mutation = trpc.useMutation(['email.verifyEmail']);

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
      <MainWrapper noHeader>
        <div className="flex h-screen flex-col items-center justify-center gap-2 text-3xl font-bold">
          Your email is now verified !
          <p className="text-sm font-thin">You can safely close this window.</p>
        </div>
      </MainWrapper>
    );
  }

  if (mutation.isError) {
    return (
      <MainWrapper noHeader>
        <div className="flex h-screen flex-col items-center justify-center gap-8 font-bold text-danger">
          {mutation.error.message}
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper noHeader>
      <div className="flex h-screen flex-col items-center justify-center gap-8">
        <Spinner />
      </div>
    </MainWrapper>
  );
};

export default VerifyChild;
