import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { useTimer } from '../hooks/useTimer';
import { trpc } from '../utils/trpc';

const LinkAccount: FC = () => {
  const router = useRouter();

  const { trigger, timer } = useTimer({
    callback: () => router.push('/'),
    delay: 5000,
  });

  const mutation = trpc.email.linkAccount.useMutation({
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
            <p>
              <FormattedMessage id="error_linking_account" />
            </p>
          </>
        )}
        {mutation.isSuccess && (
          <FormattedMessage id="linking_success_redirect" values={{ timer }} />
        )}
      </div>
    </PageWrapper>
  );
};

export default LinkAccount;
