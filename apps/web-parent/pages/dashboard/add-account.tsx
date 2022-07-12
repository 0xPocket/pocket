import { SectionContainer } from '@lib/ui';
import AddChildForm from '../../components/forms/AddChildForm';
import MainWrapper from '../../components/wrappers/MainWrapper';

type addAccountProps = {};

function addAccount({}: addAccountProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <div className=" grid grid-cols-2 gap-8">
          <div className="relative flex flex-col space-y-10 overflow-hidden rounded-lg border border-dark border-opacity- bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light">
            <h2>How to set-up a new account?</h2>
            <div className="flex flex-col gap-4">
              {/* <h3>The 3 steps:</h3> */}
              <ol>
                <li>&#x2022; Register his info</li>
                <li>&#x2022; Your teen receives an email to fill in his web3 address</li>
                <li>&#x2022; You can give him crypto !</li>
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
