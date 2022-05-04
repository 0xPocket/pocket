import SectionContainer from '../../components/containers/SectionContainer';
import ChildrenAccountPanel from '../../components/panels/ChildrenAccountPanel';
import WalletPanel from '../../components/panels/WalletPanel';
import MainWrapper from '../../components/wrappers/MainWrapper';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <h1>My Dashboard</h1>
        <div className="mt-8">
          {/* Accounts list  */}
          <div className="grid grid-cols-2 gap-8">
            <ChildrenAccountPanel />
            <WalletPanel />
          </div>
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Index;
