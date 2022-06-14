import { ParentContract } from 'pocket-contract/ts';
import { Button, DialogPopupWrapper } from '@lib/ui';
import { Wallet } from 'ethers';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/wallet';
import { getSigner } from '../../utils/web3';

type Web3ModalProps = {
  callback?: (signer: Wallet) => void;
  contract?: (contract: ParentContract) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function Web3Modal({ callback, contract, isOpen, setIsOpen }: Web3ModalProps) {
  const { wallet } = useWallet();
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    try {
      const signer = getSigner(wallet?.encryptedPrivateKey!, password);

      if (callback) {
        callback(signer);
      }
      if (contract) {
        const parentContract = new ParentContract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          signer,
        );
        contract(parentContract);
      }
    } catch (e) {
      toast.error('Invalid password');
    }
    setIsOpen(false);
  };

  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-4 rounded-md bg-dark p-4">
        <h2 className="">Unlock Wallet</h2>
        <input
          className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button action={() => onSubmit()}>Submit</Button>
      </div>
    </DialogPopupWrapper>
  );
}

export default Web3Modal;
