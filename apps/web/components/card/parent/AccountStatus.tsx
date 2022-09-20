import { ChildStatus } from '.prisma/client';
import { faCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import FormattedMessage from '../../common/FormattedMessage';

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
  const [show, setShow] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  });

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      ref={setReferenceElement}
    >
      <FontAwesomeIcon icon={getIcon(child!.child!.status)} />
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="rounded-md bg-primary p-1 text-sm"
        >
          {getMessage(child!.child!.status, child.email!)}
        </div>
      )}
    </div>
  );
}

export default AccountStatus;
