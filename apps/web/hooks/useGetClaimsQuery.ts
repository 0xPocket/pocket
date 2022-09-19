import { useQuery } from 'react-query';
import { useAccount, useProvider } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';

export type Event = {
  symbol: string;
  value: string;
  timestamp: number;
  category: 'Claim' | 'Deposit';
};

export const useGetClaimsQuery = (address: string) => {
  const provider = useProvider();
  const { pocketContract } = useSmartContract();
  const { erc20 } = useSmartContract();

  const eventFilter = useMemo(() => {
    return pocketContract.filters['FundsClaimed(uint256,address,uint256)'](
      null,
      address,
      null,
    );
  }, [address, pocketContract.filters]);

  return useQuery(
    ['child.claims', address],
    async () =>
      await provider.getLogs({
        fromBlock: 0x1a27777,
        toBlock: 'latest',
        address: pocketContract.address,
        topics: eventFilter.topics,
      }),
    {
      keepPreviousData: true,
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed: Event[] = [];
        for (const log of extractedLogs) {
          const ev = pocketContract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          parsed.push({
            value: formatUnits(
              ev.args[2].toString(),
              erc20.data?.decimals,
            ).toString(),
            symbol: erc20.data!.symbol,
            timestamp: ev.args[0].toNumber(),
            category: 'Claim',
          });
        }
        return parsed.reverse();
      },
    },
  );
};
