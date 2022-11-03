import PageWrapper from '../components/common/wrappers/PageWrapper';
import { Spinner } from '../components/common/Spinner';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import TitleHelper from '../components/common/TitleHelper';
import { useSession } from 'next-auth/react';

const ParentDashboard = dynamic(
  () => import('../components/dashboard/parent/ParentDashboard'),
  { suspense: true },
);

const ChildDashboard = dynamic(
  () => import('../components/dashboard/child/ChildDashboard'),
  { suspense: true },
);

export default function Web() {
  const { data, status } = useSession();

  return (
    <PageWrapper>
      <TitleHelper id="titles.dashboard" />
      {status === 'loading' && <Spinner />}

      <Suspense fallback={<Spinner />}>
        {data && <Breadcrumb routes={[]} />}
        {data?.user.type === 'Parent' && <ParentDashboard />}
        {data?.user.type === 'Child' && <ChildDashboard />}
      </Suspense>
    </PageWrapper>
  );
}
