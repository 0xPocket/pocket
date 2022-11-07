import { env } from 'config/env/client';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import React, { type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useSendMetaTx } from '../../../hooks/useSendMetaTx';
import FormattedMessage from '../../common/FormattedMessage';

type ClaimButtonProps = {
  disabled?: boolean;
  children: ReactNode;
};

const ClaimButton: React.FC<ClaimButtonProps> = ({ disabled, children }) => {
  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'claim',
    onMutate: () => {
      toast.info(<FormattedMessage id="dashboard.child.claim.pending" />, {
        isLoading: true,
      });
    },
    onError() {
      toast.error(<FormattedMessage id="dashboard.child.claim.fail" />);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(<FormattedMessage id="dashbaord.child.claim.success" />);
    },
  });

  return (
    <button
      disabled={disabled || !write || isLoading}
      className="action-btn min-w-[50%]"
      onClick={() => {
        if (write) write([]);
      }}
    >
      {children}
    </button>
  );
};

export default ClaimButton;
