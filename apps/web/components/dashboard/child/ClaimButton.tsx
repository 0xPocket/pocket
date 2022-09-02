import { Button } from '@lib/ui';
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
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

  const claim = useContractWrite({
    ...claimConfig,
    onError(e) {
      console.log(e.message);
      toast.error(`Claim failed.`);
    },
    onSuccess: () => {
      toast.info(`Claim pending, please hang on !`, { isLoading: true });
    },
  });

  useWaitForTransaction({
    hash: claim.data?.hash,
    onSuccess: () => {
      toast.dismiss();
      toast.success('Successfull claim !');
    },
    onError: () => {
      toast.dismiss();
      toast.error(`Claim failed.`);
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
      disabled={!claim.write}
      action={() => {
        if (claim.write) claim.write();
      }}
    >
      {children}
    </Button>
  );
};

export default ClaimButton;
