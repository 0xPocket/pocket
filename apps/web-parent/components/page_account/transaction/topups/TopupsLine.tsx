import { AssetTransfersCategory } from '@alch/alchemy-sdk';
import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import moment from 'moment';

type TopupsLineProps = {
  transaction: AssetTransfersResultWithMetadata;
};

function transformCategory(category: AssetTransfersCategory) {
  if (category === 'erc20') return 'Cryptocurrency';
  if (
    category === 'erc721' ||
    category === 'erc1155' ||
    category === 'specialnft'
  )
    return 'NFT';
  return category;
}

function TopupsLine({ transaction }: TopupsLineProps) {
  const date = transaction.metadata.blockTimestamp;
  const asset = transaction.asset === 'ETH' ? 'Matic' : transaction.asset;
  const value =
    transaction.value?.toFixed(2) === '0.00'
      ? '0'
      : transaction.value?.toFixed(2);
  const category = transformCategory(transaction.category);

  return (
    <tr className="grid grid-cols-3 gap-4">
      <td>{moment(date).format('D/MM')}</td>
      <td>
        {value} {asset}
      </td>
      <td>{category}</td>
    </tr>
  );
}

export default TopupsLine;
