import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { useAutoRedirect } from '../hooks/useAutoRedirect';
import { trpc } from '../utils/trpc';

const LinkAccount: FC = () => {
  const router = useRouter();

  const { trigger, timer } = useAutoRedirect({
    callbackUrl: '/',
    initialTimer: 5000,
  });

  const mutation = trpc.useMutation(['linkAccount.link'], {
    onSuccess: () => {
      trigger();
    },
  });

  useEffect(() => {
    if (
      router.query &&
      router.query.token &&
      router.query.childId &&
      router.query.parentId &&
      mutation.status === 'idle'
    ) {
      mutation.mutate({
        token: router.query.token as string,
        childId: router.query.childId as string,
        parentId: router.query.parentId as string,
      });
    }
  }, [router, router.query, mutation]);

  return (
    <PageWrapper>
      <TitleHelper id="titles.onboard" />

      <div className="flex flex-col items-center justify-center gap-4">
        {mutation.isLoading && <Spinner />}
        {mutation.isError && (
          <>
            <h1>{mutation.error.message}</h1>
            <p>Error linking your account;</p>
          </>
        )}
        {mutation.isSuccess && (
          <>Your account has been linked! Redirecting in {timer}</>
        )}
      </div>
    </PageWrapper>
  );
};

export default LinkAccount;
