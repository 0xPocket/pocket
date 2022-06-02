import { SectionContainer } from '@lib/ui';
import AddChildForm from '../../components/forms/AddChildForm';
import MainWrapper from '../../components/wrappers/MainWrapper';

type addAccountProps = {};

function addAccount({}: addAccountProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <div className=" grid grid-cols-2 gap-8">
          <div className=" flex flex-col gap-4 rounded-xl bg-dark-light p-8">
            <h2>Set-up a new account</h2>
            <div className="flex flex-col gap-4">
              <h3>Steps</h3>
              <ol>
                <li>Fill the form</li>
                <li>Child click on the link he received</li>
                <li>Validate the account in dashboard</li>
              </ol>
            </div>
          </div>
          <AddChildForm />
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default addAccount;
