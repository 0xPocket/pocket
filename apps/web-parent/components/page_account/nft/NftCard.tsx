import { OwnedNft } from '@alch/alchemy-sdk';
import { useState } from 'react';
import NftDialog from './NftDialog';

type NftCardProps = {
  nft?: OwnedNft;
  isLoading?: boolean;
};

function NftCard({ nft, isLoading = false }: NftCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (nft)
    return (
      <div className="container-classic col-span-4 flex flex-col overflow-hidden rounded-md">
        {nft.media[0].gateway && (
          <img
            src={nft.media[0].gateway}
            alt={nft.title}
            className="aspect-square object-cover"
          />
        )}
        <div className="flex flex-grow flex-col justify-between p-2">
          <div>
            <h3>{nft.title}</h3>
          </div>
          <a className="text-right" onClick={() => setIsOpen(true)}>
            See more
          </a>
        </div>
        <NftDialog nft={nft} isOpen={isOpen} setIsOpem={setIsOpen}></NftDialog>
      </div>
    );

  return (
    <div
      className={`${
        isLoading ? 'opacity-50' : 'opacity-30'
      } container-classic col-span-4 flex flex-col overflow-hidden rounded-md opacity-30`}
    >
      <div className={`${isLoading && 'skeleton'} aspect-square`}></div>
      <div className="flex flex-grow flex-col justify-between space-y-4 p-2">
        <div
          className={`${isLoading && 'skeleton'} h-4 w-[50%] bg-white-darker`}
        ></div>

        <a
          className={`${
            isLoading && 'skeleton'
          } h-4 w-[35%] self-end bg-white-darker text-right`}
        ></a>
      </div>
    </div>
  );
}

export default NftCard;
