import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import { Spinner } from '../components/common/Spinner';
import TitleHelper from '../components/common/TitleHelper';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { trpc } from '../utils/trpc';

const VerifyChild: FC = () => {
  const router = useRouter();

  const mutation = trpc.useMutation(['email.verifyEmail'], {
    onSuccess: () => {
      setTimeout(() => router.push('/connect'), 3000);
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

      <div className="flex flex-col items-center justify-center gap-4">
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
              <FormattedMessage id="verify-email.redirect" />
            </p>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default VerifyChild;
