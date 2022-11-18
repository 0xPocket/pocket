import type { FC } from 'react';
import type { TransakOrderStatus } from '../hooks/useTransak';
import { Spinner } from './common/Spinner';

type TransakStatusProps = {
  status: TransakOrderStatus;
};

const TransakStatus: FC<TransakStatusProps> = ({ status }) => {
  if (status === 'order_processing') {
    return (
      <>
        <p>
          Les cryptos sont en cours de livraison, ca ne devrait pas tarder !
        </p>
        <Spinner />
      </>
    );
  }

  if (status === 'order_successful') {
    return (
      <>
        <p>On attend toujours tes cryptos...</p>
        <Spinner />
      </>
    );
  }
  return <div>Vous avez bien recu les cryptos !</div>;
};

export default TransakStatus;
