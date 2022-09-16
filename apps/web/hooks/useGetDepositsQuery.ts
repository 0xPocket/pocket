import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { formatUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { Event } from './useGetClaimsQuery';
export const useGetDepositsQuery = (
  childAddress: string,
  parentAddress: string,
) => {
  const provider = useProvider();
  const { pocketContract } = useSmartContract();
  const { erc20 } = useSmartContract();

  const eventFilter = useMemo(() => {
    return pocketContract.filters[
      'FundsAdded(uint256,address,uint256,address)'
    ](null, parentAddress, null, childAddress);
  }, [childAddress, pocketContract.filters, parentAddress]);

  return useQuery(
    ['child.deposit', childAddress],
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
            category: 'Deposit',
          });
        }
        return parsed.reverse();
      },
    },
  );
};
