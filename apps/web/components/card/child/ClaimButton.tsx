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

  return (
    <button
      disabled={disabled || !claim.write}
      className="action-btn min-w-[200px]"
      onClick={() => {
        if (claim.write) claim.write();
      }}
    >
      {children}
    </button>
  );
};

export default ClaimButton;
