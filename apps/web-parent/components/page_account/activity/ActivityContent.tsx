import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import {
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
  UserChild,
} from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import {
  Alchemy,
  AssetTransfersCategory,
  getAssetTransfers,
} from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../contexts/alchemy';
import ActivityTabHeaders from './ActivityTabHeader';
import { TransactionsTable } from './TransactionsTable';
import { useAccount, useProvider } from 'wagmi';
import { formatUnits } from 'ethers/lib/utils';
import { useSmartContract } from '../../../contexts/contract';
import { TopupsTable } from './TopupsTable';

type ActivityContentProps = {
  child: UserChild;
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

type topup = {
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

function ActivityContent({ child }: ActivityContentProps) {
  const { alchemy } = useAlchemy();
  const { erc20 } = useSmartContract();
  const provider = useProvider();
  const { pocketContract } = useSmartContract();
  const { address } = useAccount();

  const { isLoading: isTxLoading, data: txList } = useQuery(
    ['child.transactions-content', child.id],
    () => {
      return fetchTransactions(alchemy, child.address!);
    },
    {
      staleTime: 60 * 1000,
      enabled: !!child.address,
      select: (transfers) => {
        transfers.reverse();
        return transfers;
      },
    },
  );

  const eventFilter = pocketContract.filters[
    'FundsAdded(address,uint256,address,uint256)'
  ](address, null, child.address, null);

  const { data: logs, isLoading: isLogLoading } = useQuery(
    ['child-topups', child.id],
    async () =>
      await provider.getLogs({
        fromBlock: 0x1a2848a,
        toBlock: 'latest',
        address: pocketContract.address,
        topics: eventFilter.topics,
      }),
    {
      keepPreviousData: true,
      enabled: !!child.address,
      staleTime: 10000,
      select: (extractedLogs) => {
        const parsed = [] as topup[];
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
            timestamp: ev.args[3].toNumber(),
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
        <ActivityTabHeaders />
        <Tab.Panels>
          <Tab.Panel>
            {!isTxLoading && txList ? (
              <TransactionsTable transactionsList={[]} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            {!isLogLoading && logs ? (
              <TopupsTable logs={logs} child={child} />
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