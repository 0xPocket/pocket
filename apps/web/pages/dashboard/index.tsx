import { UserParent } from '@lib/types/interfaces';
import SectionContainer from '../../components/containers/SectionContainer';
import ChildrenAccountPanel from '../../components/panels/ChildrenAccountPanel';
import WalletPanel from '../../components/panels/WalletPanel';
import MainWrapper from '../../components/wrappers/MainWrapper';

type IndexProps = {};

const mockParent: UserParent = {
  id: 'caca',
  firstName: 'Patrick',
  lastName: 'Balkany',
  email: 'patbalk@prison.fr',
  emailVerified: null,
  userWalletId: 'ewqwe',
  children: [
    {
      id: 'wqerewr',
      firstName: 'Johnny',
      lastName: 'Balkany',
      username: 'JohnBalk',
      email: 'wfwefw@fwfe.fr',
      userParentId: 'caca',
      web3AccountId: 'qewqeqwee',
    },
    {
      id: 'wewrewr',
      firstName: 'Pamela',
      lastName: 'Balkany',
      username: 'PamBalk',
      email: 'wfwefw@fwfe.fr',
      userParentId: 'caca',
      web3AccountId: 'qewqeqwee',
    },
  ],
};

function Index({}: IndexProps) {
  const user = mockParent;

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <h1>My Dashboard</h1>
        <div className="mt-8">
          {/* Accounts list  */}
          <div className="grid grid-cols-2 gap-8">
            <ChildrenAccountPanel user={user} />
            <WalletPanel user={user} />
          </div>
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Index;
