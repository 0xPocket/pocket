import { Button } from '@lib/ui';
import type { FC } from 'react';
import { useWaitForTransaction } from 'wagmi';
import { trpc } from '../../../utils/trpc';
import { Spinner } from '../../common/Spinner';

const ClaimMaticButton: FC = () => {
  const claimMatic = trpc.useMutation(['child.claimMatic']);
  const tx = useWaitForTransaction({
    hash: claimMatic.data,
    enabled: claimMatic.isSuccess,
  });

  if (tx.isError) return <div>Transaction error</div>;

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
      {claimMatic.isError && <div>{claimMatic.error.message}</div>}
    </>
  );
};

export default ClaimMaticButton;
