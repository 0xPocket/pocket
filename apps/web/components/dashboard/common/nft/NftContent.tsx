import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Alchemy } from 'alchemy-sdk';
import type { Network } from 'alchemy-sdk';
import NftCard from './NftCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../../common/FormattedMessage';
import { env } from 'config/env/client';

const alchemy = new Alchemy({
  apiKey: env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: env.NETWORK_KEY as Network, // Replace with your network.
  maxRetries: 10,
});

type NftContentProps = {
  childAddress: string;
  fill_nbr?: number;
};

function NftContent({ childAddress, fill_nbr = 0 }: NftContentProps) {
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
