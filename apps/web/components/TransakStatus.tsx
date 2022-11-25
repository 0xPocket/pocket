import type { FC } from 'react';
import type { TransakOrderStatus } from '../hooks/useTransak';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';

type TransakStatusProps = {
  status: TransakOrderStatus;
};

const TransakStatus: FC<TransakStatusProps> = ({ status }) => {
  if (status === 'order_processing') {
    return (
      <>
        <p>
          <FormattedMessage id="transak.processing" />
        </p>
        <Spinner />
      </>
    );
  }

  if (status === 'order_successful') {
    return (
      <>
        <FormattedMessage id="transak.successful" />
        <Spinner />
      </>
    );
  }

  return (
    <div>
      <FormattedMessage id="transak.completed" />
    </div>
  );
};

export default TransakStatus;
