import { UserParent } from '@lib/types/interfaces';
import { Dispatch, SetStateAction } from 'react';
import { UseQueryResult } from 'react-query';
import { toast } from 'react-toastify';
import Button from '../common/Button';

type MainTabPanelProps = {
  user: UserParent | undefined;
  balanceQuery: UseQueryResult<string | undefined, unknown>;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

function MainTabPanel({
  user,
  balanceQuery,
  setSelectedIndex,
}: MainTabPanelProps) {
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
