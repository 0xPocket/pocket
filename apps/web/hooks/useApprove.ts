import { BigNumber } from 'ethers';
import { erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi';

type UseApproveProps = {
  erc20Address: string;
  spender: `0x${string}`;
  amount: BigNumber;
};

export function useApprove({ erc20Address, spender, amount }: UseApproveProps) {
  const { config: configApprove } = usePrepareContractWrite({
    address: erc20Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, amount],
  });

  return useContractWrite({
    ...configApprove,
  });
}
