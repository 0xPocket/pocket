import PageWrapper from '../components/common/wrappers/PageWrapper';
import { trpc } from '../utils/trpc';
import { Spinner } from '../components/common/Spinner';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import TitleHelper from '../components/common/TitleHelper';

const ChildrenMozaic = dynamic(
  () => import('../components/dashboard/parent/ChildrenMozaic'),
  { suspense: true },
);

const ChildDashboard = dynamic(
  () => import('../components/dashboard/child/ChildDashboard'),
  { suspense: true },
);

export default function Web() {
  const { data, isLoading } = trpc.useQuery(['auth.session']);

  return (
    <PageWrapper>
      <TitleHelper id="titles.dashboard" />
      {isLoading && <Spinner />}

      <Suspense fallback={<Spinner />}>
        {data && <Breadcrumb routes={[]} />}
        {data?.user.type === 'Parent' && <ChildrenMozaic />}
        {data?.user.type === 'Child' && <ChildDashboard />}
      </Suspense>
    </PageWrapper>
  );
}
