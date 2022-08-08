import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';

import { useQuery } from 'react-query';
import {
  Alchemy,
  AssetTransfersCategory,
  getAssetTransfers,
} from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../contexts/alchemy';
import { useProvider } from 'wagmi';
import { formatUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import { ClaimsTable } from './ClaimsTable';
import ActivityTabHeaders from '../../page_account/activity/ActivityTabHeader';
import { TransactionsTable } from '../../page_account/activity/TransactionsTable';
import {
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
} from '@lib/types/interfaces';

type ActivityContentProps = {
  childAddress: string;
};

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
};

type claim = {
  symbol: string;
  value: string;
  timestamp: number;
};

async function fetchTransactions(alchemy: Alchemy, fromAddress: string) {
  let tx = [] as AssetTransfersResultWithMetadata[];
  let pageKey = undefined;
  do {
    const ret = (await getAssetTransfers(alchemy, {
      fromAddress,
      ...staticAssetTransfersParams,
      pageKey,
    })) as AssetTransfersResponseWithMetadata;
    console.log(ret.transfers.length);
    tx = tx.concat(ret.transfers);
    pageKey = ret.pageKey;
  } while (pageKey !== undefined);
  return tx;
}

function ActivityChildContent({ childAddress }: ActivityContentProps) {
  const { alchemy } = useAlchemy();
  const { erc20 } = useSmartContract();
  const provider = useProvider();
  const { pocketContract } = useSmartContract();

  const { isLoading: isTxLoading, data: txList } = useQuery(
    ['child.transactions-content', childAddress],
    () => {
      return fetchTransactions(alchemy, childAddress);
    },
    {
      staleTime: 60 * 1000,
      // enabled: !!child.address,
      select: (transfers) => {
        transfers.reverse();
        return transfers;
      },
    },
  );
  const eventFilter = pocketContract.filters[
    'FundsClaimed(address,uint256,uint256)'
  ](childAddress, null, null);

  const { data: logs, isLoading: isLogLoading } = useQuery(
    ['child-claims', childAddress],
    async () =>
      await provider.getLogs({
        fromBlock: 0x1a27777,
        toBlock: 'latest',
        address: pocketContract.address,
        topics: eventFilter.topics,
      }),
    {
      keepPreviousData: true,
      // enabled: !!child.address,
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed = [] as claim[];
        for (const log of extractedLogs) {
          const ev = pocketContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
          parsed.push({
            value: formatUnits(
              ev.args[1].toString(),
              erc20.data?.decimals,
            ).toString(),
            symbol: erc20.data!.symbol,
            timestamp: ev.args[2].toNumber(),
          });
        }
        return parsed.reverse();
      },
    },
  );

  return (
    <div className="space-y-8">
      <h2>Activity</h2>

      <Tab.Group>
        <ActivityTabHeaders
          leftHeader="Transactions"
          rightHeader="Your claims"
        />
        <Tab.Panels>
          <Tab.Panel>
            {!isTxLoading && txList ? (
              <TransactionsTable transactionsList={txList} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            {!isLogLoading && logs ? (
              <ClaimsTable logs={logs} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ActivityChildContent;
