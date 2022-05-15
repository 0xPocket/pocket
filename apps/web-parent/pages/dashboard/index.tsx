import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { useEffect } from 'react';
import SectionContainer from '../../components/containers/SectionContainer';
import ChildrenAccountPanel from '../../components/panels/ChildrenAccountPanel';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { useSmartContract } from '../../contexts/contract';

type IndexProps = {};

function Index({}: IndexProps) {
  const { parentContract } = useSmartContract();
  const { user } = useAuth<UserParent>();

  useEffect(() => {
    if (user) {
      parentContract?.getNumberOfChildren().then(console.log);
    }
  }, [user, parentContract]);

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <div className="absolute right-[-700px] bottom-[-200px] h-[1080px] w-[1920px] bg-gradient-radial-pastel"></div>
        <h1>My Dashboard</h1>
        <div className="mt-8">
          {/* Accounts list  */}
          <div className="grid grid-cols-2 gap-8">
            <ChildrenAccountPanel />
          </div>
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Index;
