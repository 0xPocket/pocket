import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { useTimer } from '../hooks/useTimer';
import { trpc } from '../utils/trpc';

const VerifyChild: FC = () => {
  const router = useRouter();
  const { trigger, timer } = useTimer({
    callback: () => router.push('/connect'),
    delay: 3000,
  });

  const mutation = trpc.email.verifyEmail.useMutation({
    onSuccess: () => {
      trigger();
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

  return (
    <PageWrapper>
      <TitleHelper id="titles.onboard" />

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {mutation.isLoading && <Spinner />}
        {mutation.isError && (
          <>
            <h1>{mutation.error.message}</h1>
            <p>
              <FormattedMessage id="verify-email.problem" />
            </p>
          </>
        )}
        {mutation.isSuccess && (
          <>
            <h1>
              <FormattedMessage id="verify-email.email-verified" />
            </h1>
            <p>
              <FormattedMessage id="verify-email.redirect" values={{ timer }} />
            </p>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default VerifyChild;
