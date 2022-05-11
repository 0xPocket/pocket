import { ethers } from 'ethers';
import { useState } from 'react';
import Button from '../common/Button';
import { DialogPopupWrapper } from '../wrappers/DialogsWrapper';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { useSmartContract } from '../../contexts/contract';
import { useQuery } from 'react-query';

type WalletPanelProps = {};

function WalletPanel({}: WalletPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTopup, setIsOpenTopup] = useState<boolean>(false);
  const { user } = useAuth<UserParent>();
  const { provider } = useSmartContract();

  const balanceQuery = useQuery('balance', async () => {
    const balanceEth = await provider?.getBalance(user?.wallet.publicKey!);
    return ethers.utils.formatEther(balanceEth!);
  });

  return (
    <div className="">
      <div className="flex justify-between">
        <h2 className="mb-4">My Wallet</h2>
        <Button isOpen={isOpenTopup} setIsOpen={setIsOpenTopup}>
          Top-up
        </Button>
        <DialogPopupWrapper isOpen={isOpenTopup} setIsOpen={setIsOpenTopup}>
          Top-up Dialog
        </DialogPopupWrapper>
      </div>
      <div className="flex flex-col gap-8">
        <h3>
          Available funds:{' '}
          {balanceQuery.isLoading ? 'loading...' : balanceQuery.data + ' ETH'}
        </h3>
        <div className="rounded-md bg-dark p-4 text-bright">
          <h3 className="mb-4">History</h3>
          <ul className="flex flex-col gap-2">
            <li>Transfert: 30$ JUSD to Matthieu</li>
            <li>Transfert: 30$ JUSD to Matthieu</li>
            <li>Transfert: 30$ JUSD to Matthieu</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Button isOpen={isOpen} setIsOpen={setIsOpen}>
          Settings
        </Button>
        <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
          Settings Dialog
        </DialogPopupWrapper>
      </div>
    </div>
  );
}

export default WalletPanel;
