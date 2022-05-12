import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import WalletContent from './WalletContent';

type WalletPopoverProps = {};

function WalletPopover({}: WalletPopoverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });

  return (
    <Popover className="relative">
      <Popover.Button ref={setReferenceElement}>
        <FontAwesomeIcon icon={faWallet} />
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 z-20 bg-dark opacity-30" />
      <Popover.Panel
        ref={setPopperElement}
        className="absolute z-30"
        style={styles.popper}
        {...attributes.popper}
      >
        <WalletContent />
      </Popover.Panel>
    </Popover>
  );
}

export default WalletPopover;
