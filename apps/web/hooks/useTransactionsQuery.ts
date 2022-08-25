import { useQuery } from 'react-query';
import { useAlchemy } from '../contexts/alchemy';
import {
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
} from '@lib/types/interfaces';
import {
  Alchemy,
  AssetTransfersCategory,
  getAssetTransfers,
} from '@alch/alchemy-sdk';

const staticAssetTransfersParams = {
  excludeZeroValue: false,
  withMetadata: true,
  maxCount: 1000,
  category: [
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.ERC1155,
    AssetTransfersCategory.SPECIALNFT,
  ],
  // order: AssetTransfersOrder.ASCENDING,
};

async function fetchTransactions(alchemy: Alchemy, fromAddress: string) {
  let tx: AssetTransfersResultWithMetadata[] = [];
  let pageKey = undefined;
  do {
    const ret = (await getAssetTransfers(alchemy, {
      fromAddress,
      ...staticAssetTransfersParams,
      pageKey,
    })) as AssetTransfersResponseWithMetadata;
    tx = tx.concat(ret.transfers);
    pageKey = ret.pageKey;
  } while (pageKey !== undefined);
  return tx;
}

export const useTransactionsQuery = (address: string) => {
  const { alchemy } = useAlchemy();

  return useQuery(
    ['child.transactions-content', address],
    () => {
      return fetchTransactions(alchemy, address);
    },
    {
      staleTime: 60 * 1000,
      select: (transfers) => {
        transfers.reverse();
        return transfers;
      },
    },
  );
};
