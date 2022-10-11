import { faCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import Tooltip from '../../common/Tooltip';

type AccountStatus = 'ACTIVE' | 'INVITED';

type AccountStatusProps = { email?: string; status: AccountStatus };

function getIcon(status: AccountStatus) {
  switch (status) {
    case 'ACTIVE':
      return faCircleCheck;
    case 'INVITED':
      return faEnvelope;
  }
}

function getMessage(status: AccountStatus, email?: string) {
  switch (status) {
    case 'ACTIVE':
      return <FormattedMessage id="card.parent.status.active" />;
    case 'INVITED':
      return (
        <FormattedMessage id="card.parent.status.invited" values={{ email }} />
      );
  }
}

function AccountStatus({ email, status }: AccountStatusProps) {
  return <Tooltip icon={getIcon(status)}>{getMessage(status, email)}</Tooltip>;
}

export default AccountStatus;
