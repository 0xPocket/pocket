import { UserParent } from '@lib/types/interfaces';
import { useState } from 'react';
import Button from '../common/Button';
import { DialogPopupWrapper } from '../wrappers/Dialogs';

type WalletPanelProps = {
  user: UserParent;
};

function WalletPanel({ user }: WalletPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTopup, setIsOpenTopup] = useState<boolean>(false);
  return (
    <div className="">
      <div className="flex justify-between">
        <h2 className="mb-4">My Wallet</h2>
        <Button
          action={(isOpenTopup: boolean) => setIsOpenTopup(!isOpenTopup)}
          arg={isOpenTopup}
        >
          Top-up
        </Button>
        <DialogPopupWrapper isOpen={isOpenTopup} setIsOpen={setIsOpenTopup}>
          Top-up Dialog
        </DialogPopupWrapper>
      </div>
      <div>
        <p>Available funds: 600 $JEUR</p>
      </div>
      <div className="mt-8 flex gap-4">
        <Button action={(isOpen: boolean) => setIsOpen(!isOpen)} arg={isOpen}>
          Withdraw
        </Button>
        <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
          Withdraw Dialog
        </DialogPopupWrapper>

        <Button light>History</Button>
      </div>
    </div>
  );
}

export default WalletPanel;
