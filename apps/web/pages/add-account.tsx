import {
  faEnvelopeCircleCheck,
  faPenToSquare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import AddChildForm from '../components/forms/AddChildForm';
import MainWrapper from '../components/wrappers/MainWrapper';

type AddAccountProps = {};

function AddAccount({}: AddAccountProps) {
  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mt-28 grid grid-cols-2 gap-28">
          <div className="relative flex flex-col space-y-14 p-8">
            <h2 className="text-center">How to set-up a new account?</h2>
            <ol className="flex flex-col gap-16 text-xl">
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faPenToSquare} size="2x" />
                {`Complete this form with your child infos`}
              </li>
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="2x" />
                {`An email will be send to the address, follow the few steps to
                  create the child account.`}
              </li>
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faThumbsUp} size="2x" />

                {`The account is set and you're ready to go !`}
              </li>
            </ol>
          </div>
          <AddChildForm />
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default AddAccount;
