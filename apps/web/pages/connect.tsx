import PageWrapper from '../components/common/wrappers/PageWrapper';
import TitleHelper from '../components/common/TitleHelper';
import ProviderList from '../components/connect/ProviderList';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

function Connect() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [router, status]);

  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="mt-28 flex flex-col items-center">
        <h1 className="mb-8">Choose your connection method</h1>

        <div className="w-[512px]">
          <div
            className=" mx-auto flex w-full flex-col justify-center gap-8 rounded-lg p-8
					text-center"
          >
            <ProviderList />
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <p>{"Don't have an account yet ?"}</p>
            <Link href="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Connect;
