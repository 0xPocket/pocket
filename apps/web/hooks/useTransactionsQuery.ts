import { useQuery } from 'react-query';
import { useAlchemy } from '../contexts/alchemy';
import type { AssetTransfersResponseWithMetadata } from '@lib/types/interfaces';
import { AssetTransfersCategory, AssetTransfersOrder } from 'alchemy-sdk';

const staticAssetTransfersParams = {
  excludeZeroValue: false,
  withMetadata: true,
  maxCount: 100,
  category: [
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.ERC1155,
    AssetTransfersCategory.SPECIALNFT,
    AssetTransfersCategory.EXTERNAL,
  ],
  order: AssetTransfersOrder.DESCENDING,
};

// async function fetchTransactions(alchemy: Alchemy, fromAddress: string) {
//   let tx: AssetTransfersResultWithMetadata[] = [];
//   let pageKey = undefined;
//   do {
//     const ret = (await getAssetTransfers(alchemy, {
//       fromAddress,
//       ...staticAssetTransfersParams,
//       pageKey,
//     })) as AssetTransfersResponseWithMetadata;
//     tx = tx.concat(ret.transfers);
//     pageKey = ret.pageKey;
//   } while (pageKey !== undefined);
//   return tx;
// }

export const useTransactionsQuery = (address: string) => {
  const { alchemy } = useAlchemy();

  return useQuery(
    ['child.transactions-content', address],
    () => {
      return alchemy.core.getAssetTransfers({
        fromAddress: address,
        ...staticAssetTransfersParams,
      }) as Promise<AssetTransfersResponseWithMetadata>;
    },
    {
      staleTime: 60 * 1000,
      select(data) {
        return data.transfers;
      },
    },
  );
};
