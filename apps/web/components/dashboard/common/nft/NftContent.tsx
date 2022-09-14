import { useInfiniteQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useAlchemy } from '../../../../contexts/alchemy';
import {} from 'alchemy-sdk';
import NftCard from './NftCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../../common/FormattedMessage';

type NftContentProps = {
  childAddress: string;
  fill_nbr?: number;
};

function NftContent({ childAddress, fill_nbr = 0 }: NftContentProps) {
  const { alchemy } = useAlchemy();
  const [page, setPage] = useState(0);

  const {
    status,
    isFetchingNextPage,
    hasNextPage,
    data: content,
    fetchNextPage,
  } = useInfiniteQuery(
    ['child.nft-content', childAddress],
    (queryKey) =>
      alchemy.nft.getNftsForOwner(childAddress, {
        pageKey: queryKey.pageParam,
        pageSize: 6,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.pageKey,
      keepPreviousData: true,
      staleTime: 60 * 1000,
      onError: () =>
        toast.error(<FormattedMessage id="dashboard.common.nft.fail" />),
    },
  );

  return (
    <div className="space-y-8">
      <h2>
        <FormattedMessage id="dashboard.common.nft.title" />
      </h2>
      <div className="grid grid-cols-12 gap-4">
        <>
          {content &&
            // ! nft.tokenId is not unique, we must use index for unique div key
            content.pages[page]?.ownedNfts.map((nft, index) => (
              <NftCard nft={nft} key={index} />
            ))}
          {content &&
            fill_nbr > content.pages[page]?.ownedNfts.length &&
            [...Array(fill_nbr - content.pages[page]?.ownedNfts.length)].map(
              (_, index) => <NftCard key={index} />,
            )}

          {(status === 'loading' || isFetchingNextPage) &&
            [...Array(fill_nbr)].map((_, index) => (
              <NftCard key={index} isLoading />
            ))}
        </>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-right">
          <button
            className="disabled:opacity-20"
            disabled={page == 0}
            onClick={() => {
              if (page > 0) setPage((value) => value - 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <FormattedMessage id="prev" />
          </button>
        </div>
        <div className="">
          <button
            className="disabled:opacity-20"
            disabled={
              !(hasNextPage || content?.pages[page + 1]) || isFetchingNextPage
            }
            onClick={() => {
              setPage((value) => value + 1);
              if (!content?.pages[page + 1]) fetchNextPage();
            }}
          >
            <FormattedMessage id="next" />
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NftContent;
