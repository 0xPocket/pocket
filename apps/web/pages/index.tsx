import MainWrapper from '../components/wrappers/MainWrapper';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import ChildrenMozaic from '../components/dashboard/parent/ChildrenMozaic';
import ChildDashboard from '../components/dashboard/child/ChildDashboard';
import { trpc } from '../utils/trpc';

export default function Web() {
  const { data } = trpc.useQuery(['auth.me']);

  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mb-12 flex items-center space-x-4">
          <FontAwesomeIcon icon={faAngleRight} />
          <p>dashboard</p>
        </div>
        {data?.user.type === 'Parent' && <ChildrenMozaic />}
        {data?.user.type === 'Child' && <ChildDashboard />}
      </SectionContainer>
    </MainWrapper>
  );
}
