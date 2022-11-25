import { env } from 'config/env/client';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { useContractRead } from 'wagmi';

type UseChildConfigProps = {
  address: string | undefined;
};

export function useChildConfig({ address }: UseChildConfigProps) {
  return useContractRead({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'childToConfig',
    args: [address!],
    enabled: !!address,
    watch: true,
  });
}
