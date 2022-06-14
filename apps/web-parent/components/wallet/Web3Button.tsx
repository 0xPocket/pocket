import { ParentContract } from 'pocket-contract/ts';
import { Button, DialogPopupWrapper } from '@lib/ui';
import { Wallet } from 'ethers';
import { MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/wallet';
import { getSigner } from '../../utils/web3';

type Web3ButtonProps = {
  children: React.ReactNode;
  callback?: (signer: Wallet) => void;
  contract?: (contract: ParentContract) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  asDiv?: boolean;
};

function Web3Button({
  children,
  callback,
  contract,
  type = 'button',
  asDiv = false,
}: Web3ButtonProps) {
  const { wallet } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
  };

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
    setShowModal(false);
  };

  if (asDiv)
    return (
      <>
        <button
          onClick={onClick}
          type={type}
          className="flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-3 text-bright dark:bg-primary-dark"
        >
          {children}
        </button>
        {showModal && (
          <div className="absolute inset-0 flow-root">
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
              <div className="relative flex flex-col gap-4 rounded-md bg-dark p-4">
                <div
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  X
                </div>
                <h2 className="">Unlock Wallet</h2>
                <input
                  className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button action={() => onSubmit()}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </>
    );

  return (
    <>
      <button
        onClick={onClick}
        type={type}
        className="relative flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-3 text-bright dark:bg-primary-dark"
      >
        {children}
      </button>

      <DialogPopupWrapper isOpen={showModal} setIsOpen={setShowModal}>
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
    </>
  );
}

export default Web3Button;
