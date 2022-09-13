import {
  faEnvelopeCircleCheck,
  faList,
  faPenToSquare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SectionContainer } from '@lib/ui';
import FormattedMessage from '../components/common/FormattedMessage';
import AddChildForm from '../components/forms/AddChildForm';
import MainWrapper from '../components/wrappers/MainWrapper';

type AddAccountProps = {};

function AddAccount({}: AddAccountProps) {
  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mt-28 grid grid-cols-2 gap-28">
          <div className="relative flex flex-col space-y-14 p-8">
            <h2 className="text-center">
              <FormattedMessage id="add-account.how-to" />
            </h2>
            <ol className="flex flex-col gap-16 text-xl">
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faPenToSquare} size="2x" />
                <FormattedMessage id="add-account.step1" />
              </li>
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="2x" />
                <FormattedMessage id="add-account.step2" />
              </li>
              <li className="flex items-center gap-4">
                <FontAwesomeIcon icon={faThumbsUp} size="2x" />
                <FormattedMessage id="add-account.step3" />
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
