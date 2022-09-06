import { useInfiniteQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useAlchemy } from '../../../../contexts/alchemy';
import {} from 'alchemy-sdk';
import NftCard from './NftCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div className="space-y-8">
      <h2>Nft Library</h2>
      <div className="grid grid-cols-12 gap-4">
        <>
          {content &&
            content.pages[page]?.ownedNfts.map((nft) => (
              <NftCard nft={nft} key={nft.tokenId} />
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
            Prev
          </button>
        </div>
        <div className="">
          <button
            className="disabled:opacity-20"
            disabled={!(hasNextPage || content?.pages[page + 1])}
            onClick={() => {
              setPage((value) => value + 1);
              if (!content?.pages[page + 1]) fetchNextPage();
            }}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NftContent;
