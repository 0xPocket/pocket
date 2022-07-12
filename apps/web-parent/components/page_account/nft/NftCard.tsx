import { OwnedNft } from '@alch/alchemy-sdk';
import { NftData } from '@lib/types/interfaces';
import Image from 'next/image';

function NftCard({ nft }: { nft: OwnedNft }) {
  return (
    <div className="dark:danger w-48 rounded-lg border-dark border-opacity-5 bg-white shadow-lg dark:border-white-darker dark:bg-dark-light">
      {nft.media[0].gateway && (
        // <Image
        //   src={nft.media[0].gateway}
        //   className="rounded-t-lg"
        //   width={300}
        //   height={300}
        //   alt={nft.title}
        // />
        <img src={nft.media[0].gateway} alt={nft.title} />
      )}
      <p
        title={nft.title}
        className="mx-2 mb-4 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {nft.description}
      </p>
      {/* <div className="my-2 mx-2">#{nft.token_id}</div> */}
    </div>
  );
}

export default NftCard;
