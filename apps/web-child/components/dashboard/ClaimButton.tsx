import { Button } from '@lib/ui';
import React, { ReactNode } from 'react';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import PocketFaucet from 'pocket-contract/artifacts/contracts/PocketFaucet.sol/PocketFaucet.json';

type ClaimButtonProps = {
  disabled?: boolean;
  children: ReactNode;
};

const ClaimButton: React.FC<ClaimButtonProps> = ({ disabled, children }) => {
  const { data, status, write } = useContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    contractInterface: PocketFaucet.abi,
    functionName: 'claim',
  });

  const waitForTransaction = useWaitForTransaction({
    wait: data?.wait,
    onSuccess: () => {
      console.log('success');
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

  return <Button action={() => write()}>{children}</Button>;
};

export default ClaimButton;