import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback } from 'react';
import { IProviderUserOptions } from 'web3modal';
import { AuthStatus } from '../../contexts/web3hook';
import AuthDialogProviders from './AuthDialogProviders';
import AuthDialogStepper from './AuthDialogStepper';

type AuthDialogProps = {
  status: AuthStatus;
  setStatus: (toggle: AuthStatus) => void;
  connectProvider: (providerId: string) => Promise<void>;
};

function AuthDialog({ status, setStatus, connectProvider }: AuthDialogProps) {
  const onProviderClick = useCallback(
    async (option: IProviderUserOptions) => {
      try {
        setStatus('connecting_wallet');
        await connectProvider(option.id);
        setStatus('verifying_account');
      } catch (e) {
        setStatus('choose_provider');
      }
    },
    [connectProvider, setStatus],
  );

  return (
    <Transition show={status !== 'hidden'} as={Fragment}>
      <Dialog
        open={status !== 'hidden'}
        as="div"
        onClose={() => setStatus('hidden')}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 flex items-center justify-center bg-dark/30 p-4">
            <Dialog.Panel className="mx-auto rounded-lg bg-[#273138] p-4 text-bright">
              {status === 'choose_provider' ||
              status === 'connecting_wallet' ? (
                <AuthDialogProviders onClick={onProviderClick} />
              ) : (
                <AuthDialogStepper status={status} />
              )}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default AuthDialog;
