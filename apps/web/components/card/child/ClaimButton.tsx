import { env } from 'config/env/client';
import moment from 'moment';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import React, { type ReactNode } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useSendMetaTx } from '../../../hooks/useSendMetaTx';
import FormattedMessage from '../../common/FormattedMessage';

type ClaimButtonProps = {
  disabled?: boolean;
  children: ReactNode;
  nextClaim?: moment.Moment;
};

const ClaimButton: React.FC<ClaimButtonProps> = ({
  disabled,
  children,
  nextClaim,
}) => {
  const intl = useIntl();

  const { write, isLoading } = useSendMetaTx({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'claim',
    onMutate: () => {
      toast.info(<FormattedMessage id="dashboard.child.claim.pending" />, {
        isLoading: true,
      });
    },
    onError() {
      toast.error(<FormattedMessage id="dashboard.child.claim.fail" />);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(<FormattedMessage id="dashbaord.child.claim.success" />);
    },
  });

  return (
    <div className="flex flex-col items-center gap-2">
      {nextClaim && (
        <p className="text-xs text-gray">
          <FormattedMessage id="card.child.piggyBank.status.next" />{' '}
          {moment
            .duration(moment().diff(nextClaim))
            .locale(intl.locale)
            .humanize() + ' !'}
        </p>
      )}
      <button
        disabled={disabled || !write || isLoading}
        className="action-btn min-w-[50%]"
        onClick={() => {
          if (write) write([]);
        }}
      >
        {children}
      </button>
    </div>
  );
};

export default ClaimButton;
