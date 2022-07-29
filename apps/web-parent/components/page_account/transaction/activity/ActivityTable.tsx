import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import ActivityLine from './ActivityLine';

type TransactionsTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
};

function TransactionsTable({ transactionsList }: TransactionsTableProps) {
  transactionsList = transactionsList.filter(
    (tx) => tx.to !== process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  );
  return (
    <table className="w-full bg-dark-light">
      <thead>
        <tr className="grid grid-cols-3 gap-4">
          <td>Date</td>
          <td>Amount</td>
          <td>Type</td>
        </tr>
      </thead>
      <tbody>
        {transactionsList.map((tx, index) => (
          <ActivityLine transaction={tx} key={index} />
        ))}
      </tbody>
    </table>
  );
}

export default TransactionsTable;
