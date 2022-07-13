import { OwnedNft } from '@alch/alchemy-sdk';
import Link from 'next/link';

function NftCard({ nft }: { nft: OwnedNft }) {
  return (
    <div className="col-span-4 flex flex-col overflow-hidden rounded-md border border-dark border-opacity-10 bg-white  shadow-lg dark:border-white-darker dark:bg-dark-light">
      {nft.media[0].gateway && (
        <img
          src={nft.media[0].gateway}
          alt={nft.title}
          className="aspect-square object-cover"
        />
      )}
      <div className="flex flex-grow flex-col justify-between p-2">
        <div>
          <h3 className="font-bold">{nft.title}</h3>
          {/* <p className="overflow-hidden text-ellipsis whitespace-nowrap font-thin">
            {nft.description}
          </p> */}
        </div>
        <Link href="#">
          <a className="mt-2 text-right text-primary">See more</a>
        </Link>
      </div>
    </div>
  );
}

export default NftCard;
