import { useQuery } from 'react-query';
import type { AssetTransfersResponseWithMetadata } from '@lib/types/interfaces';
import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersOrder,
  type Network,
} from 'alchemy-sdk';
import { env } from 'config/env/client';

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

const alchemy = new Alchemy({
  apiKey: env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: env.NETWORK_KEY as Network, // Replace with your network.
  maxRetries: 10,
});

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
