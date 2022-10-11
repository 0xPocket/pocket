import {
  faEnvelopeCircleCheck,
  faPenToSquare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormattedMessage from '../components/common/FormattedMessage';
import AddChildForm from '../components/dashboard/parent/AddChildForm';
import PageWrapper from '../components/common/wrappers/PageWrapper';
import TitleHelper from '../components/common/TitleHelper';

type AddAccountProps = {};

function AddAccount({}: AddAccountProps) {
  return (
    <PageWrapper>
      <TitleHelper id="titles.add-account" />

      <div className="mt-28 grid grid-cols-2 gap-28">
        <div className="relative flex flex-col space-y-14 p-8">
          <h2 className="text-center">
            <FormattedMessage id="add-account.how-to" />
          </h2>
          <ol className="text-l flex flex-col gap-16">
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
    </PageWrapper>
  );
}

export default AddAccount;
