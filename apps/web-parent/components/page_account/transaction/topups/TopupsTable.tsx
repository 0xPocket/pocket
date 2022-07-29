import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import TopupsLine from './TopupsLine';

type TopupsTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
};

function TopupsTable({ transactionsList }: TopupsTableProps) {
  transactionsList = transactionsList.filter(
    (tx) => tx.to === process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
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
        {transactionsList.map((tx, index) => (
          <TopupsLine transaction={tx} key={index} />
        ))}
      </tbody>
    </table>
  );
}

export default TopupsTable;
