import { SectionContainer } from '@lib/ui';
import AddChildForm from '../../components/forms/AddChildForm';
import MainWrapper from '../../components/wrappers/MainWrapper';

type addAccountProps = {};

function addAccount({}: addAccountProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <AddChildForm />
      </SectionContainer>
    </MainWrapper>
  );
}

export default addAccount;
