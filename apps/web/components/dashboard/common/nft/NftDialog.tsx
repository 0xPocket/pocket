import { OwnedNft } from 'alchemy-sdk';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../../common/FormattedMessage';
import { DialogPopupWrapper } from '../../../common/wrappers/DialogsWrapper';

type NftDialogProps = {
  nft: OwnedNft;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function NftDialog({ nft, isOpen, setIsOpen }: NftDialogProps) {
  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="max-h-[90vh] max-w-lg space-y-4 overflow-auto">
        <img src={nft.media[0]?.gateway} alt={nft.title} className="w-full" />
        <h2>{nft.title}</h2>
        <p className="max-h-52 overflow-auto">{nft.description}</p>
        <div className="flex justify-end">
          <Link
            href={`https://opensea.io/assets/matic/${nft.contract.address}/${nft.tokenId}`}
          >
            <a className="inline-block" target="_blank">
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="mr-2"
              />

              <FormattedMessage id="dashboard.common.nft.opensea" />
            </a>
          </Link>
        </div>
      </div>
    </DialogPopupWrapper>
  );
}

export default NftDialog;
