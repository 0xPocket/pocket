import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { usePopper } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import MainTabPanel from './MainTabPanel';

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
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        <FontAwesomeIcon icon={faWallet} />
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 z-20 bg-black opacity-30" />
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          ref={setPopperElement}
          className="absolute z-50"
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="container-classic mt-2 flex min-w-[360px] flex-col items-center rounded-md p-4">
            <MainTabPanel />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default WalletPopover;
