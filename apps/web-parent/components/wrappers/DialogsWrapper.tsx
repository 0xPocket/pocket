import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';

type DialogFullWrapperProps = {
  isOpen: boolean | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
};

export function DialogFullWrapper({
  isOpen,
  setIsOpen,
  children,
}: DialogFullWrapperProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-primary ">
            <span className="absolute top-8 right-8 text-4xl font-bold">X</span>
            <Dialog.Panel>
              <div className="flex h-screen w-screen flex-col items-center justify-center rounded-lg bg-primary p-8">
                {children}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}

type DialogPopupWrapperProps = {
  isOpen: boolean | undefined;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
};

export function DialogPopupWrapper({
  isOpen,
  setIsOpen,
  children,
}: DialogPopupWrapperProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel>
          <div className="rounded-lg bg-primary p-8">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
