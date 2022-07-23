import MainWrapper from '../components/wrappers/MainWrapper';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import ChildrenAccountPanel from '../components/page_dashboard/ChildrenAccountPanel';

export default function Web() {
  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mb-12 flex items-center space-x-4">
          <FontAwesomeIcon icon={faAngleRight} />
          <p>dashboard</p>
        </div>
        <ChildrenAccountPanel />
      </SectionContainer>
    </MainWrapper>
  );
}
