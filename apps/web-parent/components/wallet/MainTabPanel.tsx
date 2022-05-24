import { UserParent } from '@lib/types/interfaces';
import { SHA256 } from 'crypto-js';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import { useWallet } from '../../contexts/wallet';
import Button from '../common/Button';

type MainTabPanelProps = {
  user: UserParent | undefined;
  balanceQuery: UseQueryResult<string | undefined, unknown>;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

interface FormValues {
  password: string;
}

function MainTabPanel({
  user,
  balanceQuery,
  setSelectedIndex,
}: MainTabPanelProps) {
  const router = useRouter();
  const { wallet, decryptKey } = useWallet();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const encryptedPassword = SHA256(data.password).toString();
    decryptKey(encryptedPassword);
  };

  if (!user.wallet) {
    return (
      <div className="flex flex-col gap-4">
        <Button action={() => router.push('/create-wallet')}>
          CREATE YOUR WALLET
        </Button>
      </div>
    );
  }

  if (!wallet?.privateKey) {
    return (
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="">My Wallet</h2>
        <Button
          action={() => {
            navigator.clipboard.writeText(user?.wallet.publicKey!);
            toast.success('Address copied to clipboard !');
          }}
        >
          Copy address
        </Button>
      </div>
      <div className="border-b pb-4">
        <span>Available funds</span>
        <div>
          {balanceQuery.isLoading ? (
            <h2>loading...</h2>
          ) : (
            <div className="flex items-end gap-2">
              <h2>{balanceQuery.data}</h2>
              <span>MATIC</span>
            </div>
          )}
        </div>
      </div>
      <Button>Top-Up</Button>
      <Button light action={() => setSelectedIndex(1)}>
        Settings
      </Button>
    </div>
  );
}

export default MainTabPanel;
