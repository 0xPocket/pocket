import { ChildStatus } from '.prisma/client';
import { faCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { UserChild } from '@lib/types/interfaces';
import FormattedMessage from '../../common/FormattedMessage';
import Tooltip from '../../common/Tooltip';

type AccountStatusProps = { child: UserChild };

function getIcon(status: ChildStatus) {
  switch (status) {
    case 'ACTIVE':
      return faCircleCheck;
    case 'INVITED':
      return faEnvelope;
  }
}

function getMessage(status: ChildStatus, email: string) {
  switch (status) {
    case 'ACTIVE':
      return <FormattedMessage id="card.parent.status.active" />;
    case 'INVITED':
      return (
        <FormattedMessage id="card.parent.status.invited" values={{ email }} />
      );
  }
}

function AccountStatus({ child }: AccountStatusProps) {
  return (
    <Tooltip icon={getIcon(child!.child!.status)}>
      {getMessage(child!.child!.status, child.email!)}
    </Tooltip>
  );
}

export default AccountStatus;
