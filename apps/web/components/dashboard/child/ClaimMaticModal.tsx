import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../../utils/trpc';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { toast } from 'react-toastify';
import { Spinner } from '../../common/Spinner';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';
import FormattedMessage from '../../common/FormattedMessage';

export default function ClaimMaticModal() {
  const [open, setOpen] = useState(false);
  const { pocketContract } = useSmartContract();
  const { address } = useAccount();

  const { data: config } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [address!],
    enabled: !!address,
  });

  const { refetch } = trpc.useQuery(['child.canClaimMatic'], {
    onSuccess: (data) => {
      setOpen(data);
    },
  });
  const claimMatic = trpc.useMutation(['child.claimMatic'], {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      refetch();

      toast.info(<FormattedMessage id="dashboard.child.claimMatic.pending" />, {
        isLoading: true,
      });
    },
  });
  const tx = useWaitForTransaction({
    hash: claimMatic.data,
    enabled: claimMatic.isSuccess,
    onSuccess: () => {
      toast.dismiss();

      toast.success(
        <FormattedMessage id="dashboard.child.claimMatic.success" />,
      );
    },
  });

  return (
    <Transition.Root
      show={open && !!config && !config?.balance.isZero()}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex min-h-screen items-end justify-center bg-black/50 px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="bg-gray-500 fixed inset-0 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="container-classic relative inline-block transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div className="bg-green-100 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="h-6 w-6 text-success"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="my-4 text-lg font-bold leading-6"
                  >
                    <FormattedMessage id="dashboard.child.claimMatic.title" />
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-gray-500 text-sm">
                      <FormattedMessage id="dashboard.child.claimMatic.message" />
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                {claimMatic.isLoading || tx.isLoading ? (
                  <div className="flex w-full justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="action-btn mx-auto w-48 bg-primary py-2"
                    onClick={() => claimMatic.mutate()}
                    disabled={claimMatic.isLoading}
                  >
                    <FormattedMessage id="claim" />
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
