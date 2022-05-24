import { Dialog } from '@headlessui/react';
import { SHA256 } from 'crypto-js';
import { useForm } from 'react-hook-form';
import { useWallet } from '../../contexts/wallet';

interface FormValues {
  password: string;
}

function DecryptWalletModal() {
  const { register, handleSubmit } = useForm<FormValues>();
  const { decrypt, decryptKey, cancelDecrypt } = useWallet();

  const onSubmit = (data: FormValues) => {
    const encryptedPassword = SHA256(data.password).toString();
    decryptKey(encryptedPassword);
  };

  return (
    <>
      <Dialog open={decrypt} onClose={() => cancelDecrypt()}>
        <div className="fixed inset-0 flex items-center justify-center bg-dark/30 p-4">
          <Dialog.Panel className="mx-auto rounded-lg bg-[#273138] p-4 text-bright">
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default DecryptWalletModal;
