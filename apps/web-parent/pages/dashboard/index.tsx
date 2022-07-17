import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import ChildrenAccountPanel from '../../components/page_dashboard/ChildrenAccountPanel';
import MainWrapper from '../../components/wrappers/MainWrapper';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <MainWrapper authProtected>
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

export default Index;
