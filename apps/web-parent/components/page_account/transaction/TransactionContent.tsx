import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import {
  AssetTransfersParamsWithMetadata,
  AssetTransfersResponseWithMetadata,
  UserChild,
} from '@lib/types/interfaces';
import { useQuery, useQueryClient } from 'react-query';
import TransactionsTable from './activity/ActivityTable';
import { AssetTransfersCategory, getAssetTransfers } from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../contexts/alchemy';
import { useMemo, useState } from 'react';
import TopupsTable from './topups/TopupsTable';

type TransactionContentProps = {
  child: UserChild;
};

// metadata: { blockTimestamp: string };

//docs.alchemy.com/alchemy/enhanced-apis/transfers-api

function TransactionContent({ child }: TransactionContentProps) {
  const { alchemy } = useAlchemy();
  const [pageNb, setPageNb] = useState<string>();
  const [index, setIndex] = useState(0);

  const assetTransfersParams: AssetTransfersParamsWithMetadata = useMemo(() => {
    return {
      fromAddress: '0x0ac93fee5ad4a6ee7e705ba53a5592e4456cf570',
      excludeZeroValue: false,
      withMetadata: true,
      maxCount: 10,
      pageKey: pageNb,

      category: [
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
        AssetTransfersCategory.SPECIALNFT,
      ],
    };
  }, [pageNb]);

  const queryClient = useQueryClient();
  const {
    isLoading,
    data: content,
    isFetching,
  } = useQuery<AssetTransfersResponseWithMetadata>(
    ['child-transactions-content', child.id, index],
    async () => {
      const page = await getAssetTransfers(alchemy, assetTransfersParams);

      return page as unknown as Promise<AssetTransfersResponseWithMetadata>;
    },
    { keepPreviousData: true, staleTime: 6000000 },
  );
  // const data = fetchTransactions(child.web3Account.address);

  return (
    <div className="space-y-8">
      <h2>Transaction history</h2>

      <Tab.Group>
        <Tab.List className="space-x-8">
          <Tab
            className={({ selected }) =>
              selected
                ? 'text-dark underline dark:text-white'
                : 'text-white-darker'
            }
          >
            activity
          </Tab>

          <Tab
            className={({ selected }) =>
              selected
                ? 'text-dark underline dark:text-white'
                : 'text-white-darker'
            }
          >
            top-ups
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <button
              onClick={() => {
                setPageNb(undefined);
                setIndex(0);
                queryClient.invalidateQueries('child-transactions-content');
              }}
            >
              &#8635;
            </button>
            {!isLoading && !isFetching && content?.transfers ? (
              <TransactionsTable transactionsList={content.transfers} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            <button
              onClick={() => {
                setPageNb(undefined);
                setIndex(0);
                queryClient.invalidateQueries('child-transactions-content');
              }}
            >
              &#8635;
            </button>
            {!isLoading && !isFetching && content?.transfers ? (
              <TopupsTable transactionsList={content.transfers} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <div className="flex flex-row gap-4">
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex((index) => index - 1);
          }}
        >
          Previous
        </button>
        {content?.pageKey && (
          <button
            onClick={() => {
              setPageNb(content.pageKey);
              setIndex((index) => index + 1);
            }}
          >
            Next
          </button>
        )}
        Page : {index + 1}
      </div>
    </div>
  );
}

export default TransactionContent;
