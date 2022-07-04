import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import AuthDialogProviders from './AuthDialogProviders';

type AuthDialogProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

function AuthDialog({ show, setShow }: AuthDialogProps) {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={show} as="div" onClose={() => setShow(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-dark/50 p-4">
            <Dialog.Panel className="mx-auto flex flex-col items-center gap-3 rounded-lg p-4 text-bright">
              <AuthDialogProviders />
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default AuthDialog;
