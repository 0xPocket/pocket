import { useBalance } from 'wagmi';
import { useSmartContract } from '../contexts/contract';

type UseChildBalanceProps = {
  address: string | undefined;
};
export function useChildBalance({ address }: UseChildBalanceProps) {
  const { erc20 } = useSmartContract();

  return useBalance({
    address,
    token: erc20?.address,
    watch: true,
    enabled: !!address,
    formatUnits: erc20?.decimals,
  });
}
