import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useAlchemy } from '../../../contexts/alchemy';
import { getNftsForOwner } from '@alch/alchemy-sdk';
import NftCard from './NftCard';

type NftContentProps = {
  child: UserChild;
};

function NftContent({ child }: NftContentProps) {
  const { alchemy } = useAlchemy();

  const { isLoading, data: content } = useQuery(
    ['child-nft-content', child.id],
    () => getNftsForOwner(alchemy, child.web3Account.address),
    {
      enabled: !!child,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div className="space-y-8">
      <h2>Nft Library</h2>
      {!isLoading && content && (
        <div className="grid grid-cols-12 gap-4">
          {content.ownedNfts.map((nft) => (
            <NftCard nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NftContent;
