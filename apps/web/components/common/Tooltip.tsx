import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Placement, placements } from '@popperjs/core';
import { FC, useState } from 'react';
import { usePopper } from 'react-popper';

type TooltipProps = {
  message: string;
  placement?: Placement;
};

const Tooltip: FC<TooltipProps> = ({ message, placement = 'top' }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 6],
        },
      },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  });

  return (
    <div className="self-stretch">
      <div
        ref={setReferenceElement}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex h-6 w-6 items-center justify-center opacity-60"
      >
        <FontAwesomeIcon icon={faCircleQuestion} />
      </div>
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          id="tooltip"
          className="tooltip-container"
          {...attributes.popper}
        >
          {message}
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
