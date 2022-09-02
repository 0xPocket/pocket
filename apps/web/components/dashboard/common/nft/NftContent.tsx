import { useInfiniteQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useAlchemy } from '../../../../contexts/alchemy';
import {} from 'alchemy-sdk';
import NftCard from './NftCard';
import { useState } from 'react';

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
      {page > 0 && (
        <button
          onClick={() => {
            if (page > 0) setPage((value) => value - 1);
          }}
        >
          Prev
        </button>
      )}
      {(hasNextPage || content?.pages[page + 1]) && (
        <button
          onClick={() => {
            setPage((value) => value + 1);
            if (!content?.pages[page + 1]) fetchNextPage();
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default NftContent;
