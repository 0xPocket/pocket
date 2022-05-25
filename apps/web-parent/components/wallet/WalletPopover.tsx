import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import WalletContent from './WalletContent';
import DecryptWalletModal from './DecryptWalletModal';

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
      {({ open }) => (
        <>
          <Popover.Button ref={setReferenceElement}>
            <FontAwesomeIcon icon={faWallet} />
          </Popover.Button>
          <Popover.Overlay className="fixed inset-0 z-50 bg-dark opacity-30" />
          <Popover.Panel
            ref={setPopperElement}
            className="absolute z-50"
            style={styles.popper}
            {...attributes.popper}
          >
            {open && <WalletContent />}
          </Popover.Panel>
          <DecryptWalletModal />
        </>
      )}
    </Popover>
  );
}

export default WalletPopover;
