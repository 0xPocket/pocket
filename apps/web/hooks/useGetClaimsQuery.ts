import { useQuery } from '@tanstack/react-query';
import { useContract, useProvider } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { env } from 'config/env/client';

export type Event = {
  symbol: string;
  value: string;
  timestamp: number;
  category: 'Claim' | 'Deposit';
};

export const useGetClaimsQuery = (address?: string) => {
  const provider = useProvider();
  const { erc20 } = useSmartContract();

  const pocketContract = useContract({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
  });

  const eventFilter = useMemo(() => {
    return pocketContract?.filters['FundsClaimed(uint256,address,uint256)'](
      null,
      address,
      null,
    );
  }, [address, pocketContract?.filters]);

  return useQuery(
    ['child.claims', address],
    async () =>
      await provider.getLogs({
        fromBlock: 0x1a27777,
        toBlock: 'latest',
        address: pocketContract?.address,
        topics: eventFilter?.topics,
      }),
    {
      keepPreviousData: true,
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed: Event[] = [];
        for (const log of extractedLogs) {
          const ev = pocketContract?.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          parsed.push({
            value: formatUnits(
              ev?.args[2].toString(),
              erc20?.decimals,
            ).toString(),
            symbol: erc20!.symbol,
            timestamp: ev?.args[0].toNumber(),
            category: 'Claim',
          });
        }
        return parsed.reverse();
      },
    },
  );
};
