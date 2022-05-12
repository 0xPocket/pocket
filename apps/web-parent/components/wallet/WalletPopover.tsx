import { Popover } from '@headlessui/react';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import Button from '../common/Button';
import { usePopper } from 'react-popper';
import { toast } from 'react-toastify';

type WalletPopoverProps = {};

function WalletPopover({}: WalletPopoverProps) {
  const { user } = useAuth<UserParent>();
  const { provider } = useSmartContract();
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
  });

  const balanceQuery = useQuery('balance', async () => {
    const balanceEth = await provider?.getBalance(user?.wallet.publicKey!);
    return ethers.utils.formatEther(balanceEth!);
  });

  return (
    <Popover className="relative">
      <Popover.Button ref={setReferenceElement}>Wallet</Popover.Button>
      <Popover.Overlay className="fixed inset-0 z-20 bg-dark opacity-30" />
      <Popover.Panel
        ref={setPopperElement}
        className="absolute z-30"
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="flex min-w-[400px] flex-col gap-4 rounded-lg bg-bright px-8 py-4 shadow-lg">
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
          <Button light>Settings</Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default WalletPopover;
