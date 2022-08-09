import MainWrapper from '../components/wrappers/MainWrapper';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import ChildrenAccountPanel from '../components/page_dashboard/ChildrenAccountPanel';
import { useSession } from 'next-auth/react';
import ClaimDashboard from '../components/dashboard/child/ClaimDashboard';

export default function Web() {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mb-12 flex items-center space-x-4">
          <FontAwesomeIcon icon={faAngleRight} />
          <p>dashboard</p>
        </div>
        {data?.user.type === 'Parent' && <ChildrenAccountPanel />}
        {data?.user.type === 'Child' && <ClaimDashboard />}
      </SectionContainer>
    </MainWrapper>
  );
}
