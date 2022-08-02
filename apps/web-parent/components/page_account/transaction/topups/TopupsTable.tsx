import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import { useAccount, useProvider } from 'wagmi';
import { useSmartContract } from '../../../../contexts/contract';
import TopupsLine from './TopupsLine';
import { ethers } from 'ethers';

type TopupsTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
  childAddress: string;
};

function TopupsTable({ transactionsList, childAddress }: TopupsTableProps) {
  const { pocketContract } = useSmartContract();
  const { address } = useAccount();
  const provider = useProvider();
  const log = pocketContract.filters['FundsAdded(address,uint256,address)'](
    // null,
    // null,
    address,
  );

  provider
    .getLogs({
      fromBlock: 0x0,
      toBlock: 'latest',
      address: pocketContract.address,
      topics: log.topics,
    })
    .then((logs) => {
      // console.log('bite', logs);
      // const index = 0;
      for (const log of logs) {
        // if (index < 5) {
        // index++;
        // continue;
        // }
        console.log(
          pocketContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          }),
        );
      }
    });

  return (
    <table className="w-full bg-dark-light">
      <thead>
        <tr className="grid grid-cols-2 gap-4">
          <td>Date</td>
          <td>Amount</td>
        </tr>
      </thead>
      <tbody>
        {transactionsList
          .filter((tx) => {
            return (
              tx.to?.toLowerCase() ===
              process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!.toLowerCase()
            );
          })
          .map((tx, index) => (
            <TopupsLine transaction={tx} key={index} />
          ))}
      </tbody>
    </table>
  );
}

export default TopupsTable;
