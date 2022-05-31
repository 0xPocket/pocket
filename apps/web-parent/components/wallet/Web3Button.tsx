import { Dialog } from '@headlessui/react';
import { ParentContract } from '@lib/contract';
import { AES, enc, SHA256 } from 'crypto-js';
import { Wallet } from 'ethers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useSmartContract } from '../../contexts/contract';
import { useWallet } from '../../contexts/wallet';
import Button from '../common/Button';

type Web3ButtonProps = {
  name: string;
  callback?: (signer: Wallet) => void;
  contract?: (contract: ParentContract) => void;
};

interface FormValues {
  password: string;
}

function Web3Button({ name, callback, contract }: Web3ButtonProps) {
  const { wallet } = useWallet();
  const { provider } = useSmartContract();
  const { register, handleSubmit } = useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setShowModal(true);
  };

  const onSubmit = (data: FormValues) => {
    const encryptedPassword = SHA256(data.password).toString();

    try {
      const decryptedPK = AES.decrypt(
        wallet?.privateKey!,
        encryptedPassword,
      ).toString(enc.Utf8);
      const signer = new Wallet(decryptedPK, provider);
      setShowModal(false);

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
  };

  return (
    <>
      <button onClick={onClick}>{name}</button>
      {showModal && (
        <div className="absolute inset-0 flow-root">
          <div className="fixed inset-0 flex items-center justify-center bg-dark/30 p-4">
            <div className="mx-auto rounded-lg bg-[#273138] p-4 text-bright">
              <div className="flex items-center gap-4 border-b pb-4">
                <h2 className="">Unlock Wallet</h2>
              </div>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  className="border p-2 text-dark"
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'This field is required',
                  })}
                />
                <input
                  type="submit"
                  value="Decrypt Wallet"
                  className="rounded-md bg-dark  px-4 py-3 text-bright"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Web3Button;
