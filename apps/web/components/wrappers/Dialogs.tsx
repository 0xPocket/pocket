import { Dialog } from '@headlessui/react';
import { Dispatch, SetStateAction, useState } from 'react';

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
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-primary ">
        <span className="absolute top-8 right-8 text-4xl font-bold">X</span>
        <Dialog.Panel>
          <div className="flex h-screen w-screen items-center justify-center rounded-lg bg-primary p-8">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
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
          {/* <button onClick={handleDeactivate}>Deactivate</button> */}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
