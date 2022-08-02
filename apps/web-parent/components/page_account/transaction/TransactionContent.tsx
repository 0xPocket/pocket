import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import {
  AssetTransfersParamsWithMetadata,
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
  UserChild,
} from '@lib/types/interfaces';
import { useQuery, useQueryClient } from 'react-query';
import TransactionsTable from './activity/ActivityTable';
import { AssetTransfersCategory, getAssetTransfers } from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../contexts/alchemy';
import { useMemo, useState } from 'react';
import TopupsTable from './topups/TopupsTable';
import { useAccount } from 'wagmi';

type TransactionContentProps = {
  child: UserChild;
};

function TransactionContent({ child }: TransactionContentProps) {
  const { alchemy } = useAlchemy();
  const [pageKey, setPageKey] = useState<string>();
  const [index, setIndex] = useState(0);
  const [doneFetchingTx, setDoneFetchingTx] = useState(false);
  const pageLen = 10;
  const { address } = useAccount();

  const lowerBound = () => index * pageLen;
  const upperBound = () => (index + 1) * pageLen;

  const assetTransfersParams: AssetTransfersParamsWithMetadata = useMemo(() => {
    return {
      // fromAddress: '0x0ac93fee5ad4a6ee7e705ba53a5592e4456cf570',
      fromAddress: address,
      excludeZeroValue: false,
      withMetadata: true,
      maxCount: 1000,
      pageKey: pageKey,

      category: [
        // AssetTransfersCategory.ERC20,
        // AssetTransfersCategory.ERC721,
        // AssetTransfersCategory.ERC1155,
        // AssetTransfersCategory.SPECIALNFT,
        AssetTransfersCategory.EXTERNAL,
        // AssetTransfersCategory.TOKEN,
      ],
    };
  }, [pageKey, address]);

  const queryClient = useQueryClient();
  const {
    isLoading,
    data: content,
    isFetching,
  } = useQuery<AssetTransfersResponseWithMetadata>(
    ['child-transactions-content', child.id, pageKey],
    async () => {
      const page = await getAssetTransfers(alchemy, assetTransfersParams);
      return page as unknown as Promise<AssetTransfersResponseWithMetadata>;
    },
    {
      keepPreviousData: true,
      enabled: !!address,
      onSuccess: (result) => {
        if (result.pageKey !== undefined) {
          setPageKey(result.pageKey);
        } else {
          setDoneFetchingTx(true);
        }
      },

      select: (data) => {
        data.transfers.reverse();
        return data;
      },
    },
  );

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
                setPageKey(undefined);
                setIndex(0);
                queryClient.invalidateQueries('child-transactions-content');
              }}
            >
              &#8635;
            </button>
            {!isLoading && !isFetching && content?.transfers ? (
              <TransactionsTable
                transactionsList={
                  content.transfers.slice(
                    lowerBound(),
                    upperBound(),
                  ) as AssetTransfersResultWithMetadata[]
                }
              />
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            <button
              onClick={() => {
                setPageKey(undefined);
                setIndex(0);
                queryClient.invalidateQueries('child-transactions-content');
              }}
            >
              &#8635;
            </button>
            {doneFetchingTx && content?.transfers ? (
              <TopupsTable
                transactionsList={content.transfers}
                childAddress={child.address}
              />
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <div className="grid grid-cols-3 gap-4">
        <button
          disabled={index === 0}
          onClick={() => {
            setIndex((index) => index - 1);
          }}
        >
          Previous
        </button>
        Page : {index + 1}
        <button
          disabled={index < upperBound()}
          onClick={() => {
            setIndex((index) => index + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionContent;
