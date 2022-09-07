import { Button } from '@lib/ui';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import { useWaitForTransaction } from 'wagmi';
import { trpc } from '../../../utils/trpc';
import { Spinner } from '../../common/Spinner';

const ClaimMaticButton: FC = () => {
  const { data: canClaimMatic, refetch } = trpc.useQuery([
    'child.canClaimMatic',
  ]);
  const claimMatic = trpc.useMutation(['child.claimMatic'], {
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      refetch();
      toast.info(`Claim matic pending, please hang on !`, { isLoading: true });
    },
  });
  const tx = useWaitForTransaction({
    hash: claimMatic.data,
    enabled: claimMatic.isSuccess,
    onSuccess: () => {
      toast.dismiss();
      toast.success('Transaction success !');
    },
  });

  if (tx.isError) return <div>Transaction error</div>;
  if (!canClaimMatic) return null;

  return (
    <>
      <Button
        action={() => claimMatic.mutate()}
        disabled={claimMatic.isLoading}
      >
        {claimMatic.isLoading || tx.isLoading ? (
          <Spinner />
        ) : (
          'Claim your Matic !'
        )}
      </Button>
    </>
  );
};

export default ClaimMaticButton;
