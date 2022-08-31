import { Button } from '@lib/ui';
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
// import useContractWrite from '../../../hooks/useContractWrite';
import { useSmartContract } from '../../../contexts/contract';

type ClaimButtonProps = {
  disabled?: boolean;
  children: ReactNode;
};

const ClaimButton: React.FC<ClaimButtonProps> = ({ disabled, children }) => {
  const { pocketContract } = useSmartContract();
  const { config: claimConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'claim',
  });
  const { writeAsync: claim } = useContractWrite({
    ...claimConfig,
    onError(e) {
      console.log(e.message);
      toast.error(`An error occured while claiming your money`);
    },
  });

  if (disabled) {
    return (
      <button
        disabled={true}
        className="relative flex cursor-not-allowed items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-dark-lightest px-4 py-3 text-bright dark:bg-dark-lightest"
      >
        {children}
      </button>
    );
  }

  return (
    <Button
      action={async () => {
        if (!claim) return;
        const tx = await claim();
        const info = toast.info(
          `The network is validating your claim. It may takes between 30 and 60 seconds, please wait`,
          { isLoading: true },
        );
        const result = await tx.wait();
        toast.dismiss(info);
        if (result.status! === 1) toast.success('Your claim is a success');
        else toast.error('An error occured during the claim.');
      }}
    >
      {children}
    </Button>
  );
};

export default ClaimButton;
