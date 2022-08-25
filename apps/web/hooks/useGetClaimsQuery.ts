import {
  FundsAddedEventFilter,
  FundsClaimedEventFilter,
} from 'pocket-contract/typechain-types/contracts/PocketFaucet';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import { formatUnits } from 'ethers/lib/utils';

type Event = {
  symbol: string;
  value: string;
  timestamp: number;
};

export const useGetClaimsQuery = (
  address: string,
  eventFilter: FundsClaimedEventFilter | FundsAddedEventFilter,
) => {
  const provider = useProvider();
  const { pocketContract } = useSmartContract();
  const { erc20 } = useSmartContract();

  return useQuery(
    ['child-claims', address],
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
          });
        }
        return parsed.reverse();
      },
    },
  );
};
