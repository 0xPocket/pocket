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
import FormattedMessage from '../../common/FormattedMessage';

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
    onError() {
      toast.error(<FormattedMessage id="dashboard.child.claim.fail" />);
    },
    onSuccess: () => {
      toast.info(<FormattedMessage id="dashboard.child.claim.pending" />, {
        isLoading: true,
      });
    },
  });

  useWaitForTransaction({
    hash: claim.data?.hash,
    onSuccess: () => {
      toast.dismiss();

      toast.success(<FormattedMessage id="dashbaord.child.claim.success" />);
    },
    onError: () => {
      toast.dismiss();

      toast.error(<FormattedMessage id="dashboard.child.claim.fail" />);
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
