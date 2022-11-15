import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { OwnedNft } from 'alchemy-sdk';
import { useState } from 'react';
import FormattedMessage from '../../../common/FormattedMessage';
import NftDialog from './NftDialog';

type NftCardProps = {
  nft?: OwnedNft;
  isLoading?: boolean;
};

function NftCard({ nft, isLoading = false }: NftCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (nft)
    // TODO: better height/size between placeholder / text / see more for consistent sizes
    return (
      <div className="container-classic col-span-6 flex flex-col overflow-hidden rounded-md md:col-span-4">
        {nft.media[0]?.gateway !== undefined ? (
          <img
            src={nft.media[0]?.gateway}
            alt={nft.title}
            className="aspect-square object-cover"
          />
        ) : (
          <div className="flex h-60 items-center justify-center">
            <FontAwesomeIcon icon={faImage} className="text-6xl opacity-50" />
          </div>
        )}
        <div className="flex flex-grow flex-col justify-between p-2">
          <div>
            <h3>{nft.title}</h3>
          </div>
          <a className="text-right" onClick={() => setIsOpen(true)}>
            <FormattedMessage id="dashboard.common.nft.seeMore" />
          </a>
        </div>
        <NftDialog nft={nft} isOpen={isOpen} setIsOpen={setIsOpen}></NftDialog>
      </div>
    );

  return (
    <div
      className={`${
        isLoading ? 'opacity-50' : 'opacity-30'
      } container-classic  hidden flex-col overflow-hidden rounded-md opacity-30 sm:col-span-6 md:col-span-4 md:flex`}
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
