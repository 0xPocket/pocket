import { ParentContract } from 'pocket-contract/ts';
import { FormInputText } from '@lib/ui';
import { Wallet } from 'ethers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/wallet';
import { getSigner } from '../../utils/web3';

type Web3ButtonProps = {
  children: React.ReactNode;
  callback?: (signer: Wallet) => void;
  contract?: (contract: ParentContract) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

interface FormValues {
  password: string;
}

function Web3Button({
  children,
  callback,
  contract,
  type = 'button',
}: Web3ButtonProps) {
  const { wallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const onSubmit = (data: FormValues) => {
    try {
      const signer = getSigner(wallet?.encryptedPrivateKey!, data.password);

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

  return (
    <>
      <button onClick={onClick} type={type}>
        {children}
      </button>
      {showModal && (
        <div className="absolute inset-0 flow-root">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto rounded-md bg-dark p-4">
              <div className="flex items-center gap-4 pb-4 ">
                <h2 className="">Unlock Wallet</h2>
              </div>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormInputText
                  type="password"
                  placeHolder="Password"
                  registerValues={register('password', {
                    required: 'This field is required',
                  })}
                  error={errors.password}
                />

                <input
                  type="submit"
                  value="Submit"
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
