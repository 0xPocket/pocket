import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import { usePopper } from 'react-popper';

type PendingHelperProps = {
  child: UserChild;
};

function PendingHelper({ child }: PendingHelperProps) {
  const [show, setShow] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {});
  return (
    <div
      ref={setReferenceElement}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="max-w-fit"
    >
      Pending <FontAwesomeIcon icon={faQuestionCircle} />
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="rounded-md bg-primary p-1 text-sm"
        >
          An email has been sent to {child.email}
        </div>
      )}
    </div>
  );
}

export default PendingHelper;
