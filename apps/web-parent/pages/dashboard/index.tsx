import { SectionContainer } from '@lib/ui';
import ChildrenAccountPanel from '../../components/page_dashboard/ChildrenAccountPanel';
import MainWrapper from '../../components/wrappers/MainWrapper';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <div className="absolute right-[-700px] bottom-[-200px] -z-50 h-[1080px] w-[1920px] bg-dark-radial-herosection dark:opacity-10"></div>
        <h1>My Dashboard</h1>
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-8">
            <ChildrenAccountPanel />
          </div>
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Index;
