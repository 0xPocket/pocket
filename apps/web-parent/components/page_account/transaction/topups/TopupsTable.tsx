import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import { useAccount, useProvider } from 'wagmi';
import { useSmartContract } from '../../../../contexts/contract';
import TopupsLine from './TopupsLine';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

type TopupsTableProps = {
  childAddress: string;
};

function TopupsTable({ childAddress }: TopupsTableProps) {
  const { pocketContract } = useSmartContract();
  const { address } = useAccount();
  const provider = useProvider();
  const eventFilter = pocketContract.filters[
    'FundsAdded(address,uint256,address,uint256)'
  ](address, null, childAddress, null);

  const { data: logs } = useQuery(
    ['child-topups'],
    async () =>
      await provider.getLogs({
        fromBlock: 0x1a2848a,
        toBlock: 'latest',
        address: pocketContract.address,
        topics: eventFilter.topics,
      }),
    {
      keepPreviousData: true,
      enabled: !!childAddress,
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed = [] as ethers.utils.LogDescription[];
        for (const log of extractedLogs) {
          parsed.push(
            pocketContract.interface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            }),
          );
        }
        return parsed.reverse();
      },
    },
  );

  return (
    <table className="w-full bg-dark-light">
      <thead>
        <tr className="grid grid-cols-2 gap-4">
          <td>Date</td>
          <td>Amount</td>
        </tr>
      </thead>
      <tbody>
        {logs && logs.map((log, index) => <TopupsLine log={log} key={index} />)}
      </tbody>
    </table>
  );
}

export default TopupsTable;
