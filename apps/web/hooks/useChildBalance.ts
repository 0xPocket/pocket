import { useBalance } from 'wagmi';
import { useSmartContract } from '../contexts/contract';

type UseChildBalanceProps = {
  address: string;
};
export function useChildBalance({ address }: UseChildBalanceProps) {
  const { erc20 } = useSmartContract();

  return useBalance({
    address,
    token: erc20?.address,
    watch: true,
    formatUnits: erc20?.decimals,
  });
}
