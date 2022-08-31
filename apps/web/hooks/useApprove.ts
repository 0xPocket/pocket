import { erc20ABI, useContractWrite, usePrepareContractWrite } from 'wagmi';
import type { UseContractWriteConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractWrite';

type UseApproveProps = {
  erc20Address: string;
  spender: string;
  amount: string;
} & UseContractWriteConfig;

export function useApprove({
  erc20Address,
  spender,
  amount,
  ...props
}: UseApproveProps) {
  const { config: configApprove } = usePrepareContractWrite({
    addressOrName: erc20Address,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [spender, amount],
  });

  return useContractWrite({
    ...configApprove,
    ...props,
  });
}
