import { OwnedNftsResponse } from '@alch/alchemy-sdk';
import { CovalentItem, NftData } from '@lib/types/interfaces';
import NftCard from './NftCard';

function NftLibrary({ nftContent }: { nftContent: OwnedNftsResponse }) {
  return (
    <div className="flex flex-wrap gap-4">
      {nftContent.ownedNfts.map((nft) => (
        <NftCard nft={nft} />
      ))}
    </div>
  );
}

export default NftLibrary;
