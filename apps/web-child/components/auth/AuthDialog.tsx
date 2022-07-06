import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useAuth } from '../../contexts/auth';
import { Spinner } from '../common/Spinner';
import AuthDialogProviders from './AuthDialogProviders';

type AuthDialogProps = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

function AuthDialog({ show, setShow }: AuthDialogProps) {
  const { isConnected, address } = useAccount();
  const { signIn, signingIn } = useAuth();
  const { chain } = useNetwork();

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
            <Dialog.Panel className="mx-auto flex flex-col items-center justify-center gap-3 rounded-lg p-4 text-bright">
              {!isConnected ? (
                <AuthDialogProviders />
              ) : (
                <div className="flex w-96 justify-center gap-2">
                  {signingIn ? (
                    <div className="flex w-48 justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <button
                      className="relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border border-white-darker bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75"
                      disabled={signingIn}
                      onClick={() => signIn(chain?.id!, address!)}
                    >
                      Sign Message
                    </button>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default AuthDialog;
