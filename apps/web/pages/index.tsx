import MainWrapper from '../components/common/wrappers/MainWrapper';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { trpc } from '../utils/trpc';
import { Spinner } from '../components/common/Spinner';
import FormattedMessage from '../components/common/FormattedMessage';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
    <MainWrapper>
      {isLoading && <Spinner />}

      <Suspense fallback={<Spinner />}>
        {data && (
          <div className="mb-12 flex items-center space-x-4">
            <FontAwesomeIcon icon={faAngleRight} />
            <p>
              <FormattedMessage id="route.dashboard" />
            </p>
          </div>
        )}
        {data?.user.type === 'Parent' && <ChildrenMozaic />}
        {data?.user.type === 'Child' && <ChildDashboard />}
      </Suspense>
    </MainWrapper>
  );
}
