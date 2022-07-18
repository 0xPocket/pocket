import { DialogPopupWrapper } from '@lib/ui';
import { Dispatch, SetStateAction } from 'react';

type NftDialogProps = {
  isOpen: boolean;
  setIsOpem: Dispatch<SetStateAction<boolean>>;
};

function NftDialog({ isOpen, setIsOpem }: NftDialogProps) {
  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpem}>
      Salut
    </DialogPopupWrapper>
  );
}

export default NftDialog;
