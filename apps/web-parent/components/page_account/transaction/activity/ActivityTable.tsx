import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import ActivityLine from './ActivityLine';

type ActivityTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
};

function ActivityTable({ transactionsList }: ActivityTableProps) {
  console.log('in the activity');
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
        {transactionsList &&
          transactionsList.map((tx, index) => (
            <ActivityLine transaction={tx} key={index} />
          ))}
      </tbody>
    </table>
  );
}

export default ActivityTable;
