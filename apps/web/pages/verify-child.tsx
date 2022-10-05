import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import FormattedMessage from '../components/common/FormattedMessage';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import { useAuth } from '../contexts/auth';
import TitleHelper from '../components/common/TitleHelper';
import ProviderList from '../components/register/RegisterProviderList';
import { useEthereumSiwe } from '../hooks/useEthereumSiwe';
import { trpc } from '../utils/trpc';
import { Spinner } from '../components/common/Spinner';
import Link from 'next/link';

const VerifyChild: FC = () => {
  const router = useRouter();
  const token = router.query.token as string;
  const email = router.query.email as string;

  const { signOut, loggedIn } = useAuth();

  const verifyChild = trpc.useMutation(['email.verifyChild']);

  useEffect(() => {
    if (loggedIn) {
      signOut();
    }
  }, [loggedIn, signOut]);

  const siwe = useEthereumSiwe({
    onSuccess: (data) => {
      verifyChild.mutate({
        email,
        token,
        message: JSON.stringify(data.message),
        signature: data.signature,
      });
    },
  });

  return (
    <PageWrapper>
      <TitleHelper id="titles.onboard" />

      <div className="flex flex-col items-center">
        <div className="flex w-[512px] flex-col items-center gap-16">
          <h1>
            <FormattedMessage id="common.welcome" />
          </h1>
          <div
            className=" mx-auto flex w-full flex-col justify-center gap-8 rounded-lg
					text-center"
          >
            {verifyChild.isIdle && (
              <ProviderList
                userType="Child"
                callback={() => {
                  siwe.mutate();
                }}
              />
            )}
            {verifyChild.isLoading && <Spinner />}
            {verifyChild.isSuccess && (
              <>
                <h2>Your account is created !</h2>
                <Link href={'/connect'}>
                  <a>Go to connect</a>
                </Link>
              </>
            )}
            {verifyChild.isError && <h2>{verifyChild.error.message}</h2>}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VerifyChild;
