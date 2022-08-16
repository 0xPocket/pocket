import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useAlchemy } from '../../../../contexts/alchemy';
import { getNftsForOwner } from '@alch/alchemy-sdk';
import NftCard from './NftCard';

type NftContentProps = {
  childAddress: string;
  fill_nbr?: number;
};

function NftContent({ childAddress, fill_nbr = 0 }: NftContentProps) {
  const { alchemy } = useAlchemy();

  const { isLoading, data: content } = useQuery(
    ['child.nft-content', childAddress],
    () => getNftsForOwner(alchemy, childAddress),
    {
      // enabled: !!child && !!child.address,
      staleTime: 60 * 1000,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div className="space-y-8">
      <h2>Nft Library</h2>
      <div className="grid grid-cols-12 gap-4">
        {content &&
          content.ownedNfts.map((nft, index) => (
            <NftCard nft={nft} key={index} />
          ))}
        {content &&
          fill_nbr > content.ownedNfts.length &&
          [...Array(fill_nbr - content.ownedNfts.length)].map((_, index) => (
            <NftCard key={index} />
          ))}

        {isLoading &&
          [...Array(fill_nbr)].map((_, index) => (
            <NftCard key={index} isLoading />
          ))}
      </div>
    </div>
  );
}

export default NftContent;
