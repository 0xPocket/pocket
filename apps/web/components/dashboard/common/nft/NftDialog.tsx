import { OwnedNft } from '@alch/alchemy-sdk';
import { DialogPopupWrapper } from '@lib/ui';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

type NftDialogProps = {
  nft: OwnedNft;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function NftDialog({ nft, isOpen, setIsOpen }: NftDialogProps) {
  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="max-h-screen max-w-lg space-y-4">
        <img src={nft.media[0]?.gateway} alt={nft.title} className="w-full" />
        <h2>{nft.title}</h2>
        <p className="max-h-52 overflow-scroll">{nft.description}</p>
        <div className="flex justify-end">
          <Link
            href={`https://opensea.io/assets/matic/${nft.contract.address}/${nft.tokenId}`}
          >
            <a className="inline-block">See on OpenSea</a>
          </Link>
        </div>
      </div>
    </DialogPopupWrapper>
  );
}

export default NftDialog;
