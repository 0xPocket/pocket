import MainWrapper from '../components/common/wrappers/MainWrapper';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChildrenMozaic from '../components/dashboard/parent/ChildrenMozaic';
import ChildDashboard from '../components/dashboard/child/ChildDashboard';
import { trpc } from '../utils/trpc';
import { Spinner } from '../components/common/Spinner';
import FormattedMessage from '../components/common/FormattedMessage';

export default function Web() {
  const { data, isLoading } = trpc.useQuery(['auth.session']);

  return (
    <MainWrapper>
      {isLoading && (
        <div className="flex h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      )}
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
    </MainWrapper>
  );
}
