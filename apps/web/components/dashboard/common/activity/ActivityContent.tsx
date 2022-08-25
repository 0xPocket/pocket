import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';

import { useQuery } from 'react-query';
import {
  Alchemy,
  AssetTransfersCategory,
  getAssetTransfers,
} from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../../contexts/alchemy';
import { useProvider } from 'wagmi';
import { formatUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../../contexts/contract';

import ActivityTabHeaders from './ActivityTabHeader';
import {
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
} from '@lib/types/interfaces';
import {
  FundsAddedEventFilter,
  FundsClaimedEventFilter,
} from 'pocket-contract/typechain-types/contracts/PocketFaucet';
import EventsTable from './EventsTable';
import { TransactionsTable } from './TransactionsTable';

type ActivityContentProps = {
  childAddress: string;
  eventFilter: FundsClaimedEventFilter | FundsAddedEventFilter;
  rightHeader: string;
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
  // order: AssetTransfersOrder.ASCENDING,
};

type Event = {
  symbol: string;
  value: string;
  timestamp: number;
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

function ActivityContent({
  childAddress,
  eventFilter,
  rightHeader,
}: ActivityContentProps) {
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
      select: (transfers) => {
        transfers.reverse();
        return transfers;
      },
    },
  );

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
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed: Event[] = [];
        for (const log of extractedLogs) {
          const ev = pocketContract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          parsed.push({
            value: formatUnits(
              ev.args[2].toString(),
              erc20.data?.decimals,
            ).toString(),
            symbol: erc20.data!.symbol,
            timestamp: ev.args[0].toNumber(),
          });
        }
        return parsed.reverse();
      },
    },
  );

  return (
    <div className="flex flex-col space-y-8">
      <Tab.Group>
        <div className="flex justify-between">
          <h2>Activity</h2>
          <ActivityTabHeaders
            leftHeader="Transactions"
            rightHeader={rightHeader}
          />
        </div>
        <Tab.Panels className="container-classic max-h-[538px] w-full overflow-scroll rounded-lg px-8 py-4">
          <Tab.Panel>
            {!isTxLoading && txList ? (
              <TransactionsTable transactionsList={txList} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            {!isLogLoading && logs ? (
              <EventsTable logs={logs} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ActivityContent;
