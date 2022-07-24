import { OwnedNft } from '@alch/alchemy-sdk';
import { useState } from 'react';
import NftDialog from './NftDialog';

function NftCard({ nft }: { nft: OwnedNft }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="container-classic col-span-4 flex flex-col overflow-hidden rounded-md">
      {nft.media[0].gateway && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={nft.media[0].gateway}
          alt={nft.title}
          className="aspect-square object-cover"
        />
      )}
      <div className="flex flex-grow flex-col justify-between p-2">
        <div>
          <h3 className="">{nft.title}</h3>
        </div>
        <a className="text-right" onClick={() => setIsOpen(true)}>
          See more
        </a>
      </div>
      <NftDialog isOpen={isOpen} setIsOpem={setIsOpen}></NftDialog>
    </div>
  );
}

export default NftCard;
