import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import {
  AssetTransfersParamsWithMetadata,
  AssetTransfersResponseWithMetadata,
  AssetTransfersResultWithMetadata,
  UserChild,
} from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import TransactionsTable from './activity/ActivityTable';
import {
  Alchemy,
  AssetTransfersCategory,
  getAssetTransfers,
} from '@alch/alchemy-sdk';
import { useAlchemy } from '../../../contexts/alchemy';
import { useMemo, useState } from 'react';
import TopupsTable from './topups/TopupsTable';
import TransactionCategories from './TansactionCategories';

type TransactionContentProps = {
  child: UserChild;
};

const fetchTransactions = async (
  alchemy: Alchemy,
  assetTransfersParams: AssetTransfersParamsWithMetadata,
) => {
  const page = await getAssetTransfers(alchemy, assetTransfersParams);
  return page as unknown as Promise<AssetTransfersResponseWithMetadata>;
};

function TransactionContent({ child }: TransactionContentProps) {
  const { alchemy } = useAlchemy();
  const [pageKey, setPageKey] = useState<string>();
  const [index, setIndex] = useState(0);
  const [doneFetchingTx, setDoneFetchingTx] = useState(false);
  const pageLen = 10;

  const lowerBound = () => index * pageLen;
  const upperBound = () => (index + 1) * pageLen;

  const assetTransfersParams: AssetTransfersParamsWithMetadata = useMemo(() => {
    return {
      fromAddress: child.address,
      excludeZeroValue: false,
      withMetadata: true,
      maxCount: 1000,
      pageKey: pageKey,

      category: [
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
        AssetTransfersCategory.SPECIALNFT,
      ],
    };
  }, [pageKey, child.address]);
  const {
    isLoading,
    data: content,
    isFetching,
  } = useQuery<AssetTransfersResponseWithMetadata>(
    ['child-transactions-content', child.id, pageKey],
    () => fetchTransactions(alchemy, assetTransfersParams),
    {
      keepPreviousData: true,
      enabled: !!child.address,
      onSuccess: (result) => {
        if (result.pageKey !== undefined) {
          setPageKey(result.pageKey);
        } else {
          setDoneFetchingTx(true);
        }
      },
      select: (data) => {
        console.log('again');
        data.transfers.reverse();
        return data;
      },
    },
  );

  return (
    <div className="space-y-8">
      <h2>Transaction history</h2>

      <Tab.Group>
        <TransactionCategories />
        <Tab.Panels>
          <Tab.Panel>
            {!isLoading && doneFetchingTx ? (
              <TransactionsTable
                transactionsList={
                  content?.transfers.slice(
                    lowerBound(),
                    upperBound(),
                  ) as AssetTransfersResultWithMetadata[]
                }
              />
            ) : (
              <FontAwesomeIcon icon={faSpinner} spin />
            )}
            {!isLoading && !isFetching}
          </Tab.Panel>

          <Tab.Panel>
            <TopupsTable childAddress={child.address} />
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
