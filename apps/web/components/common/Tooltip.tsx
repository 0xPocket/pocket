import {
  faCircleQuestion,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Placement } from '@popperjs/core';
import { FC, ReactNode, useState } from 'react';
import { usePopper } from 'react-popper';

type TooltipProps = {
  children?: ReactNode;
  placement?: Placement;
  icon?: IconDefinition;
  className?: string;
};

const Tooltip: FC<TooltipProps> = ({
  children,
  placement = 'top',
  icon = faCircleQuestion,
  className = '',
}) => {
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
        name: 'computeStyles',
        options: {
          adaptive: false, // true by default
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
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
        className={`${className} flex items-center justify-center`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      {show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          id="tooltip"
          className="tooltip-container"
          {...attributes.popper}
        >
          {children}
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
