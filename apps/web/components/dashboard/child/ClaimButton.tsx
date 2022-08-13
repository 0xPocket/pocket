import { Button } from '@lib/ui';
import React, { ReactNode } from 'react';
import useContractWrite from '../../../hooks/useContractWrite';
import { useSmartContract } from '../../../contexts/contract';

type ClaimButtonProps = {
  disabled?: boolean;
  children: ReactNode;
};

const ClaimButton: React.FC<ClaimButtonProps> = ({ disabled, children }) => {
  const { pocketContract } = useSmartContract();
  const { write } = useContractWrite({
    contract: pocketContract,
    functionName: 'claim',
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

  return <Button action={() => write()}>{children}</Button>;
};

export default ClaimButton;
