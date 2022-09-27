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
      <PageWrapper>
        <TitleHelper id="titles.onboard" />

        <div className="flex flex-col items-center justify-center gap-2 text-3xl font-bold">
          <FormattedMessage id="verify-email.email-verified" />
          <p className="text-sm font-thin">
            <FormattedMessage id="verify-email.redirect" />
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (mutation.isError) {
    return (
      <PageWrapper>
        <TitleHelper id="titles.email-verification" />

        <div className="flex flex-col items-center justify-center gap-8 font-bold">
          <p>{mutation.error.message}</p>
          <p className="text-sm font-thin">
            <FormattedMessage id="verify-email.problem" />
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TitleHelper id="titles.email-verification" />

      <div className="flex h-screen flex-col items-center justify-center gap-8">
        <Spinner />
      </div>
    </PageWrapper>
  );
};

export default VerifyChild;
