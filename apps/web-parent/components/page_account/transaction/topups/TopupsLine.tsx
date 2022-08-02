import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import moment from 'moment';
import { useTransaction } from 'wagmi';
import { useSmartContract } from '../../../../contexts/contract';

type TopupsLineProps = {
  transaction: AssetTransfersResultWithMetadata;
};

function TopupsLine({ transaction }: TopupsLineProps) {
  const { pocketContract } = useSmartContract();

  const date = transaction.metadata.blockTimestamp;
  const asset = transaction.asset === 'ETH' ? 'Matic' : transaction.asset;
  const value =
    transaction.value?.toFixed(2) === '0.00'
      ? '0'
      : transaction.value?.toFixed(2);
  const tx = useTransaction({ hash: transaction.hash as `0x${string}` });

  return (
    <tr className="grid grid-cols-3 gap-4">
      <td>{moment(date).format('D/MM')}</td>
      <td>
        {value} {asset}
      </td>
    </tr>
  );
}

export default TopupsLine;
